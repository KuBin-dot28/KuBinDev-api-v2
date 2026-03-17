import fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";

const app = fastify();
await app.register(cors, { origin: "*" });

// --- CONFIG & STATE ---
const API_URL = "https://wcl.tele68.com/v1/chanlefull/sessions";
let state = {
    history: [], // Mảng các ký tự 'C' hoặc 'L'
    totals: [],  // Lưu số lượng vị đỏ (0, 1, 2, 3, 4) để tính Mean Reversion
    predictions: [], 
    failS: 0, lastId: 0, win: 0, lose: 0, lastHash: ""
};

// ================================================================
// 🧠 SIÊU THUẬT TOÁN TỔNG HỢP (SUPER ALGORITHMS PACK)
// ================================================================
const SuperEngine = {
    // 1. N-Gram Adaptive: Tìm mẫu lặp 3-5 phiên trong quá khứ
    algo_NGram: (hist) => {
        if (hist.length < 10) return null;
        let bestPred = null; let maxCount = -1;
        for (let k = 3; k <= 5; k++) {
            const lastGram = hist.slice(-k).join('');
            let counts = { C: 0, L: 0 };
            for (let i = 0; i < hist.length - k; i++) {
                if (hist.slice(i, i + k).join('') === lastGram) {
                    const next = hist[i + k];
                    if (counts[next] !== undefined) counts[next]++;
                }
            }
            if (counts.C !== counts.L) {
                const currentMax = Math.max(counts.C, counts.L);
                if (currentMax > maxCount) {
                    maxCount = currentMax;
                    bestPred = counts.C > counts.L ? 'C' : 'L';
                }
            }
        }
        return bestPred;
    },

    // 2. Mean Reversion (Dựa trên số vị đỏ - Trung bình là 2)
    algo_MeanRev: (totals) => {
        if (totals.length < 7) return null;
        const avg = totals.slice(-7).reduce((a, b) => a + b, 0) / 7;
        if (avg > 2.5) return 'L'; // Quá nhiều đỏ (Chẵn) -> Đánh Lẻ
        if (avg < 1.5) return 'C'; // Quá ít đỏ (Lẻ) -> Đánh Chẵn
        return null;
    },

    // 3. Volatility Breakout (Biến động mạnh thì đảo chiều)
    algo_Volatility: (totals) => {
        if (totals.length < 10) return null;
        const mean = 2;
        const variance = totals.slice(-10).reduce((a, v) => a + Math.pow(v - mean, 2), 0) / 10;
        const std = Math.sqrt(variance);
        if (std > 1.2) return totals.at(-1) % 2 === 0 ? 'L' : 'C'; 
        return null;
    },

    // 4. Markov Chain (Xác suất chuyển tiếp)
    algo_Markov: (hist) => {
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
        if (!trans[lastKey]) return null;
        const { C, L } = trans[lastKey];
        return C === L ? null : (C > L ? 'C' : 'L');
    }
};

// ================================================================
// 🛠 HÀM PHÂN TÍCH TỔNG HỢP (VOTING SYSTEM)
// ================================================================
function analyzeOmega() {
    const hist = state.history;
    const totals = state.totals;
    
    let votes = { C: 0, L: 0 };

    // --- LỚP 1: THUẬT TOÁN HÌNH MẪU (Dựa trên hist) ---
    const nGram = SuperEngine.algo_NGram(hist);
    if (nGram) votes[nGram] += 3.5;

    const markov = SuperEngine.algo_Markov(hist);
    if (markov) votes[markov] += 2.5;

    // --- LỚP 2: THUẬT TOÁN THỐNG KÊ (Dựa trên totals) ---
    const meanRev = SuperEngine.algo_MeanRev(totals);
    if (meanRev) votes[meanRev] += 2.0;

    const vol = SuperEngine.algo_Volatility(totals);
    if (vol) votes[vol] += 2.0;

    // --- LỚP 3: HASH LOGIC (P1-P8 từ v13) ---
    // (Giả lập logic P1 đơn giản để demo, bạn có thể copy nguyên cục P1-P8 cũ vào đây)
    const hashBit = parseInt(state.lastHash.slice(-1), 16) % 2 === 0 ? 'C' : 'L';
    votes[hashBit] += 3.0;

    // KẾT LUẬN
    let finalSide = votes.C >= votes.L ? 'C' : 'L';
    
    // Anti-Fail
    if (state.failS >= 3) finalSide = finalSide === 'C' ? 'L' : 'C';

    const totalWeight = votes.C + votes.L;
    const conf = Math.min(99, Math.round((Math.max(votes.C, votes.L) / (totalWeight || 1)) * 100));

    return { finalSide, conf, votes };
}

// ================================================================
// 📡 ĐỒNG BỘ DỮ LIỆU
// ================================================================
async function sync() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const latest = data.list[0];

        if (latest && latest.id !== state.lastId) {
            const side = latest.resultTruyenThong === "chan" ? 'C' : 'L';
            // Tính số vị đỏ từ field "result" (VD: "do-trang-do-do" -> 3)
            const redCount = (latest.result.match(/do/g) || []).length;

            if (state.lastPred) {
                const isWin = state.lastPred === side;
                state.predictions.push(isWin ? "✅" : "❌");
                if (isWin) { state.failS = 0; state.win++; } else { state.failS++; state.lose++; }
            }

            state.history.push(side);
            state.totals.push(redCount);
            if (state.history.length > 30) { state.history.shift(); state.totals.shift(); }
            if (state.predictions.length > 20) state.predictions.shift();
            
            state.lastId = latest.id;
            state.lastHash = latest.hash || latest.md5;
            state.lastResultDetail = latest;
        }
    } catch (e) { console.error("Sync Error"); }
}

// ================================================================
// 📡 API ENDPOINT
// ================================================================
app.get("/", async (req, reply) => {
    await sync();
    const result = analyzeOmega();
    state.lastPred = result.finalSide;

    return {
        "author": "@KuBinDev .",
        "he_thong": "STABLE - OMEGA VIP v13.0 (SUPER UPGRADE)",
        "phong_do_20_tay": state.predictions.join(" "),
        "thong_ke_tong_quat": {
            "thang": state.win,
            "thua": state.lose,
            "ti_le_thang_tb": `${((state.win/(state.win+state.lose||1))*100).toFixed(1)}%`
        },
        "phien_vua_xong": {
            "id": state.lastId,
            "ket_qua": state.lastResultDetail?.resultTruyenThong.toUpperCase(),
            "dices": state.lastResultDetail?.result
        },
        "du_doan_phien_moi": {
            "id_tiep": state.lastId + 1,
            "lenh": result.finalSide === 'C' ? "CHẴN" : "LẺ",
            "tin_cay_thuc_te": `${result.conf}.0%`,
            "goi_y_lot": result.finalSide === 'C' ? ["Tứ Đỏ", "Tứ Trắng"] : ["3 Đỏ", "3 Trắng"]
        },
        "phan_tich_sau": {
            "trang_thai_cau": state.failS >= 2 ? "BIẾN ĐỘNG MẠNH" : "CẦU ĐI ĐỀU",
            "bieu_quyet": `Engine Chẵn (${result.votes.C.toFixed(1)}) vs Engine Lẻ (${result.votes.L.toFixed(1)})`,
            "canh_bao_rui_ro": result.conf < 60 ? "⚠️ CẦU YẾU" : "✅ NHỊP ĐẸP",
            "chuoi_lich_su_10": state.history.slice(-10).join("-")
        },
        "loi_khuyen_chien_thuat": result.conf > 75 ? "VÀO MẠNH TAY" : "CHỜ PHIÊN ĐẸP"
    };
});

// START
const port = process.env.PORT || 3000;
app.listen({ port, host: "0.0.0.0" }, () => {
    setInterval(sync, 4000);
    console.log("Omega Super Engine is Live!");
});
