import fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";

const app = fastify();
await app.register(cors, { origin: "*" });

// --- CONFIG & STATE ---
const API_URL = "https://wcl.tele68.com/v1/chanlefull/sessions";
let state = {
    history: [], totals: [], predictions: [],
    failS: 0, lastId: 0, win: 0, lose: 0, 
    lastHash: "", lastPred: null, lastResultDetail: null
};

// ================================================================
// 🧠 DANH SÁCH THUẬT TOÁN (TÁCH RIÊNG CHI TIẾT)
// ================================================================

// 1. Cầu lặp chu kỳ (N-Gram)
function algo_NGram(hist) {
    if (hist.length < 10) return null;
    let best = { side: null, weight: 0 };
    for (let k = 3; k <= 5; k++) {
        const lastGram = hist.slice(-k).join('');
        let counts = { C: 0, L: 0 };
        for (let i = 0; i < hist.length - k; i++) {
            if (hist.slice(i, i + k).join('') === lastGram) counts[hist[i+k]]++;
        }
        if (counts.C !== counts.L) {
            let side = counts.C > counts.L ? 'C' : 'L';
            let w = Math.max(counts.C, counts.L) * 1.5;
            if (w > best.weight) best = { side, weight: w };
        }
    }
    return best.side ? { side: best.side, weight: best.weight } : null;
}

// 2. Markov Chain (Xác suất chuyển tiếp)
function algo_Markov(hist) {
    const order = 3;
    if (hist.length < order + 1) return null;
    const trans = {};
    for (let i = 0; i <= hist.length - order - 1; i++) {
        const key = hist.slice(i, i + order).join('');
        const next = hist[i + order];
        trans[key] = trans[key] || { C: 0, L: 0 };
        trans[key][next]++;
    }
    const lastKey = hist.slice(-order).join('');
    if (!trans[lastKey] || trans[lastKey].C === trans[lastKey].L) return null;
    return { 
        side: trans[lastKey].C > trans[lastKey].L ? 'C' : 'L', 
        weight: 2.5 
    };
}

// 3. Mean Reversion (Hồi quy vị đỏ)
function algo_MeanRev(totals) {
    if (totals.length < 10) return null;
    const avg = totals.slice(-10).reduce((a, b) => a + b, 0) / 10;
    if (avg > 2.3) return { side: 'L', weight: 3.0 }; // Quá nhiều đỏ -> Lẻ
    if (avg < 1.7) return { side: 'C', weight: 3.0 }; // Quá ít đỏ -> Chẵn
    return null;
}

// 4. Volatility (Biến động mạnh - Bẻ bệt)
function algo_Volatility(totals) {
    if (totals.length < 10) return null;
    const mean = 2;
    const std = Math.sqrt(totals.slice(-10).reduce((a, v) => a + Math.pow(v - mean, 2), 0) / 10);
    if (std > 1.2) return { side: totals.at(-1) % 2 === 0 ? 'L' : 'C', weight: 2.0 };
    return null;
}

// 5. Hash MD5 Logic
function algo_Hash(hash) {
    if (!hash) return { side: 'C', weight: 1.0 };
    const side = parseInt(hash.slice(-1), 16) % 2 === 0 ? 'C' : 'L';
    return { side, weight: 3.0 };
}

// ================================================================
// 📡 ĐỒNG BỘ DỮ LIỆU (CHỐNG KẸT & FIX SYNC ERROR)
// ================================================================
async function sync() {
    try {
        const res = await fetch(`${API_URL}?t=${Date.now()}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' }
        });
        const data = await res.json();
        const list = data.list || [];
        if (list.length === 0) return;

        // Tự động nạp 50 phiên khi khởi động để tránh bieu_quyet (0-0)
        if (state.history.length === 0) {
            [...list].reverse().slice(-50).forEach(item => {
                state.history.push(item.resultTruyenThong === "chan" ? 'C' : 'L');
                state.totals.push((item.result.match(/do/g) || []).length);
            });
        }

        const latest = list[0];
        if (latest.id > state.lastId) {
            const side = latest.resultTruyenThong === "chan" ? 'C' : 'L';
            const red = (latest.result.match(/do/g) || []).length;

            if (state.lastPred) {
                const isWin = state.lastPred === side;
                state.predictions.push(isWin ? "✅" : "❌");
                isWin ? (state.failS = 0, state.win++) : (state.failS++, state.lose++);
            }

            state.history.push(side);
            state.totals.push(red);
            if (state.history.length > 50) state.history.shift();
            if (state.predictions.length > 20) state.predictions.shift();
            
            state.lastId = latest.id;
            state.lastHash = latest.hash || latest.md5;
            state.lastResultDetail = latest;
        }
    } catch (e) { console.log("Sync Error..."); }
}

// ================================================================
// 💻 API RENDER JSON
// ================================================================
app.get("/", async (req, reply) => {
    await sync();
    
    let vC = 0, vL = 0;
    const algos = [
        algo_NGram(state.history),
        algo_Markov(state.history),
        algo_MeanRev(state.totals),
        algo_Volatility(state.totals),
        algo_Hash(state.lastHash)
    ];

    algos.forEach(res => {
        if (res) res.side === 'C' ? vC += res.weight : vL += res.weight;
    });

    let finalSide = vC >= vL ? 'C' : 'L';
    if (state.failS >= 3) finalSide = (finalSide === 'C' ? 'L' : 'C');
    state.lastPred = finalSide;

    const conf = Math.min(99, Math.round((Math.max(vC, vL) / (vC + vL || 1)) * 100));
    
    const getVi = (dices) => {
        if (!dices) return "unknown";
        const r = (dices.match(/do/g) || []).length;
        if (r === 2) return "sấp đôi";
        if (r === 4) return "tứ đỏ";
        if (r === 0) return "tứ trắng";
        return r === 3 ? "3 đỏ 1 trắng" : "3 trắng 1 đỏ";
    };

    return {
        "author": "@KuBinDev .",
        "he_thong": "STABLE - OMEGA VIP Phân Tích S1vn (SUPER UPGRADE)",
        "phong_do_20_tay": state.predictions.join(" "),
        "thong_ke_tong_quat": {
            "thang": state.win,
            "thua": state.lose,
            "ti_le_thang_tb": `${((state.win/(state.win + state.lose || 1))*100).toFixed(1)}%`
        },
        "phien_vua_xong": {
            "id": state.lastId,
            "ket_qua": state.lastResultDetail?.resultTruyenThong.toUpperCase() || "N/A",
            "vi": getVi(state.lastResultDetail?.result),
            "dices": state.lastResultDetail?.result || "N/A"
        },
        "du_doan_phien_moi": {
            "id_tiep": state.lastId + 1,
            "lenh": finalSide === 'C' ? "CHẴN" : "LẺ",
            "tin_cay_thuc_te": `${conf}.0%`,
            "goi_y_lot": finalSide === 'C' ? ["Tứ Đỏ", "Tứ Trắng"] : ["3 Đỏ", "3 Trắng"]
        },
        "phan_tich_sau": {
            "trang_thai_cau": state.failS >= 2 ? "CẦU ĐẢO BIẾN THIÊN" : "CẦU ĐI ĐỀU",
            "bieu_quyet": `Engine Chẵn (${vC.toFixed(1)}) vs Engine Lẻ (${vL.toFixed(1)})`,
            "can_bao_rui_ro": conf < 65 ? "⚠️ CẦU YẾU - ĐỢI THÊM" : "✅ NHỊP ĐẸP",
            "chuoi_lich_su_10": state.history.slice(-10).join("-")
        },
        "loi_khuyen_chien_thuat": conf > 75 ? "VÀO MẠNH TAY" : "CHỜ PHIÊN ĐẸP HƠN"
    };
});

const port = process.env.PORT || 10000;
app.listen({ port, host: "0.0.0.0" }, () => {
    setInterval(sync, 4000);
    console.log("Omega System Live!");
});
