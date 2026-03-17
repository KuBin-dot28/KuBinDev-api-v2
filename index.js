import fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";

// --- CẤU HÌNH ---
const API_URL = "https://wcl.tele68.com/v1/chanlefull/sessions";
const app = fastify({ logger: false });
await app.register(cors, { origin: "*" });

let xocDiaResults = [];

// ================================================================
// 1. KHO THUẬT TOÁN DỰ ĐOÁN (PHÂN TÍCH CHẴN LẺ)
// ================================================================
const Algos = {
    // Dự đoán dựa trên xu hướng gần nhất
    trendFollow: (cl) => (cl.slice(-3).every(v => v === cl.at(-1)) ? (cl.at(-1) === 'C' ? 'L' : 'C') : cl.at(-1)),
    
    // Thuật toán Markov: tìm xác suất xuất hiện sau một chuỗi
    markovChain: (cl) => {
        if (cl.length < 10) return null;
        const last = cl.at(-1);
        let count = {C: 0, L: 0};
        for(let i=0; i < cl.length - 1; i++) {
            if(cl[i] === last) count[cl[i+1]]++;
        }
        return count.C > count.L ? 'C' : 'L';
    },

    // Phân tích đảo cầu (1-1)
    pingPong: (cl) => {
        const last2 = cl.slice(-2).join('');
        if (last2 === 'CL') return 'C';
        if (last2 === 'LC') return 'L';
        return null;
    }
};

// ================================================================
// 2. BỘ ĐIỀU KHIỂN DỮ LIỆU
// ================================================================
const xocDiaManager = {
    getPrediction: (history) => {
        if (!history || history.length < 5) return { prediction: "N/A", confidence: 0, votes: {C:0, L:0} };
        
        // Chuyển đổi dữ liệu API (chan/le) sang ký hiệu C/L để tính toán
        const cl = history.map(h => h.resultTruyenThong === "chan" ? 'C' : 'L').reverse();
        
        let votes = { C: 0, L: 0 };
        Object.values(Algos).forEach(algo => {
            const res = algo(cl);
            if (res === 'C') votes.C++; else if (res === 'L') votes.L++;
        });

        const total = votes.C + votes.L;
        const result = votes.C >= votes.L ? 'C' : 'L';
        const confidence = total > 0 ? (Math.max(votes.C, votes.L) / total) : 0;

        return { prediction: result, confidence, votes };
    }
};

// ================================================================
// 3. HÀM QUÉT DỮ LIỆU TỪ API
// ================================================================
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        // Tele68 trả dữ liệu trong mảng 'list'
        xocDiaResults = data.list || [];
    } catch (e) {
        console.log("⚠️ Đang chờ kết nối API Tele68...");
    }
}

// ================================================================
// 4. GIAO DIỆN TRANG CHỦ (HIỂN THỊ KẾT QUẢ)
// ================================================================
app.get("/", async (request, reply) => {
    // Chống lỗi khi server mới khởi động chưa có dữ liệu
    if (!xocDiaResults || xocDiaResults.length === 0) {
        return { 
            status: "loading", 
            message: "Đang nạp dữ liệu từ sàn... Vui lòng F5 sau 5 giây!" 
        };
    }

    const last = xocDiaResults[0];
    const predData = xocDiaManager.getPrediction(xocDiaResults);

    // Phân tích chuỗi cầu hiện tại (Bệt hay Đảo)
    const last10 = xocDiaResults.slice(0, 10).map(h => h.resultTruyenThong === "chan" ? "C" : "L");
    let count_bet = 1;
    for (let i = 0; i < last10.length - 1; i++) {
        if (last10[i] === last10[i+1]) count_bet++; else break;
    }
    const status_cau = count_bet >= 4 ? `BỆT ${count_bet} TAY` : "CẦU ĐẢO 1-1";

    // Gợi ý lót vị thông minh
    const suggestedLot = (predData.prediction === 'C') ? ["4 Đỏ", "4 Trắng"] : ["3 Đỏ", "3 Trắng"];

    return {
        author: "@KuBinDev .",
        phien_vua_xong: {
            id: last.id,
            ket_qua: last.resultTruyenThong.toUpperCase(),
            vi_chi_tiet: last.resultVi,
            dice_mau: last.dices.join(" - ")
        },
        du_doan_phien_moi: {
            id_tiep_theo: last.id + 1,
            lenh_danh: predData.prediction === 'C' ? "CHẴN" : "LẺ",
            do_tin_cay: `${(predData.confidence * 100).toFixed(1)}%`,
            goi_y_lot: suggestedLot
        },
        phan_tich_ky_thuat: {
            trang_thai_cau: status_cau,
            ti_le_dong_thuan: `${predData.votes.C} Chẵn vs ${predData.votes.L} Lẻ`,
            chuoi_10_phien: last10.join("-")
        },
        chien_thuat: predData.confidence > 0.7 ? "NÊN VÀO TIỀN" : "NÊN THEO DÕI THÊM"
    };
});

// ================================================================
// 5. KHỞI CHẠY SERVER
// ================================================================
const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        await app.listen({ port: port, host: "0.0.0.0" });
        
        // Lấy dữ liệu ngay khi bật server
        await fetchData();
        
        // Quét lại mỗi 10 giây (Tốc độ xóc đĩa nhanh nên để 10s là đẹp)
        setInterval(fetchData, 10000);
        
        console.log(`🚀 Tool S18 Xóc Đĩa LIVE tại cổng: ${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
