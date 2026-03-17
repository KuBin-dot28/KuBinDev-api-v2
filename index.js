import fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";

// --- CẤU HÌNH HỆ THỐNG ---
const API_URL = "https://wcl.tele68.com/v1/chanlefull/sessions";
const app = fastify({ logger: false });
await app.register(cors, { origin: "*" });

// --- CƠ SỞ DỮ LIỆU TẠM THỜI (STATE) ---
let xocDiaResults = [];
let lastPrediction = null;
let historyStatus = [];
let totalWins = 0;
let totalLoses = 0;

// ================================================================
// 🧠 HỆ THỐNG 5 THUẬT TOÁN PHÂN TÍCH (SUPER STABLE)
// ================================================================
const Engine = {
    // 1. Phân tích Xu hướng (Trend)
    checkTrend: (cl) => {
        const last = cl.at(-1);
        const count = cl.slice(-4).filter(v => v === last).length;
        if (count >= 3) return last; // Đang theo dây
        return null;
    },
    // 2. Phân tích Xác suất Markov (History Probability)
    checkMarkov: (cl) => {
        if (cl.length < 20) return null;
        const pattern = cl.slice(-2).join('');
        let c = 0, l = 0;
        for (let i = 0; i < cl.length - 2; i++) {
            if (cl.slice(i, i + 2).join('') === pattern) {
                cl[i + 2] === 'C' ? c++ : l++;
            }
        }
        return c > l ? 'C' : (l > c ? 'L' : null);
    },
    // 3. Phân tích Cầu Nhảy (Ping-Pong)
    checkPingPong: (cl) => {
        const last3 = cl.slice(-3).join('-');
        if (last3 === 'C-L-C') return 'L';
        if (last3 === 'L-C-L') return 'C';
        return null;
    },
    // 4. Phân tích Đối xứng (Symmetry)
    checkSymmetry: (cl) => {
        const part1 = cl.slice(-4, -2).join('');
        const part2 = cl.slice(-2).reverse().join('');
        if (part1 === part2) return cl.at(-1) === 'C' ? 'L' : 'C';
        return null;
    },
    // 5. Logic Hồi mã thương (Vả ngược bệt dài)
    checkBreak: (cl) => {
        let last = cl.at(-1);
        let count = 0;
        for (let i = cl.length - 1; i >= 0; i--) {
            if (cl[i] === last) count++; else break;
        }
        if (count >= 5) return last === 'C' ? 'L' : 'C'; // Bệt 5 tay mới báo bẻ
        return null;
    }
};

// ================================================================
// 📡 TRÌNH QUẢN LÝ DỮ LIỆU & ĐỐI CHIẾU ĐÚNG SAI
// ================================================================
async function syncData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const newList = data.list || [];

        if (xocDiaResults.length > 0 && newList[0].id !== xocDiaResults[0].id) {
            const realResult = newList[0].resultTruyenThong === "chan" ? 'CHẴN' : 'LẺ';
            
            if (lastPrediction && lastPrediction.id === newList[0].id) {
                const isWin = lastPrediction.pick === realResult;
                if (isWin) { totalWins++; historyStatus.unshift("✅"); }
                else { totalLoses++; historyStatus.unshift("❌"); }
                if (historyStatus.length > 20) historyStatus.pop();
            }
        }
        xocDiaResults = newList;
    } catch (e) {
        console.log("⚠️ Đang đợi sàn nhả dữ liệu...");
    }
}

// ================================================================
// 💻 GIAO DIỆN TRANG CHỦ (PHÂN TÍCH CHI TIẾT)
// ================================================================
app.get("/", async (request, reply) => {
    if (xocDiaResults.length < 20) return { status: "DỮ LIỆU YẾU", msg: "Cần tối thiểu 20 phiên để phân tích nết..." };

    const last = xocDiaResults[0];
    const cl = xocDiaResults.map(h => h.resultTruyenThong === "chan" ? 'C' : 'L').reverse();
    
    // Thu thập biểu quyết từ 5 Engine
    let voteC = 0, voteL = 0;
    Object.values(Engine).forEach(fn => {
        const res = fn(cl);
        if (res === 'C') voteC++; else if (res === 'L') voteL++;
    });

    // Tính độ tin cậy dựa trên sự đồng thuận (Không random)
    const totalVotes = voteC + voteL;
    const predict = voteC >= voteL ? "CHẴN" : "LẺ";
    let confidence = totalVotes > 0 ? (Math.max(voteC, voteL) / 5) * 100 : 50;

    // Lưu phiên dự đoán tiếp theo
    lastPrediction = { id: last.id + 1, pick: predict };

    // Phân tích dây bệt hiện tại
    let streak = 1;
    for (let i = 0; i < cl.length - 1; i++) {
        if (cl.at(-(i+1)) === cl.at(-(i+2))) streak++; else break;
    }

    return {
        author: "@KuBinDev .",
        he_thong: "STABLE - OMEGA VIP",
        phong_do_20_tay: historyStatus.join(" "),
        thong_ke_tong_quat: {
            thang: totalWins,
            thua: totalLoses,
            ti_le_thang_tb: `${((totalWins / (totalWins + totalLoses || 1)) * 100).toFixed(1)}%`
        },
        phien_vua_xong: {
            id: last.id,
            ket_qua: last.resultTruyenThong.toUpperCase(),
            vi: last.resultVi,
            dices: last.dices ? last.dices.join(" - ") : "N/A"
        },
        du_doan_phien_moi: {
            id_tiep: last.id + 1,
            lenh: predict,
            tin_cay_thuc_te: `${confidence.toFixed(1)}%`,
            goi_y_lot: predict === "CHẴN" ? ["Tứ Đỏ", "Tứ Trắng"] : ["3 Đỏ", "3 Trắng"]
        },
        phan_tich_sau: {
            trang_thai_cau: streak >= 4 ? `BỆT ${streak} TAY` : "CẦU ĐẢO BIẾN THIÊN",
            bieu_quyet: `Engine Chẵn (${voteC}) vs Engine Lẻ (${voteL})`,
            canh_bao_rui_ro: (historyStatus[0] === "❌" && historyStatus[1] === "❌") ? "⛔ CẦU ĐANG GÃY - DỪNG NGAY" : (confidence >= 80 ? "🔥 CẦU NÉT - VÀO TIỀN" : "⚠️ CẦU YẾU - ĐỢI THÊM"),
            chuoi_lich_su_10: cl.slice(-10).join("-")
        },
        loi_khuyen_chien_thuat: confidence >= 80 ? "ĐI ĐỀU TAY + LÓT VỊ" : "CHỜ PHIÊN ĐẸP HƠN"
    };
});

// KHỞI CHẠY HỆ THỐNG
const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        await app.listen({ port: port, host: "0.0.0.0" });
        await syncData();
        setInterval(syncData, 8000); 
        console.log(`🚀 HỆ THỐNG SUPER VIP ĐANG CHẠY TẠI CỔNG: ${port}`);
    } catch (err) { process.exit(1); }
};
start();
