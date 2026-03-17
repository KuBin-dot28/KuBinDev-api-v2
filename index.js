import fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";

// --- CẤU HÌNH HỆ THỐNG ---
const VERSION = "Lc79 > S18 Bá rõ .";
const API_URL = "https://wcl.tele68.com/v1/chanlefull/sessions";
const app = fastify({ logger: false });
await app.register(cors, { origin: "*" });

let rikResults = [];

// ================================================================
// 1. KHO THUẬT TOÁN ĐA MÔ HÌNH
// ================================================================
const Algos = {
    cycle3: (tx) => (tx.slice(-6, -3).join('') === tx.slice(-3).join('') ? (tx.at(-1) === 'T' ? 'X' : 'T') : null),
    alternate2: (tx) => (tx[tx.length-4] !== tx[tx.length-3] && tx[tx.length-3] === tx[tx.length-2] && tx[tx.length-2] !== tx[tx.length-1] ? (tx.at(-1) === 'T' ? 'X' : 'T') : null),
    threeRepeat: (tx) => (tx.slice(-3).every(v => v === tx.at(-1)) ? (tx.at(-1) === 'T' ? 'X' : 'T') : null),
    markovOrder3: (tx) => {
        if (tx.length < 15) return null;
        const last3 = tx.slice(-3).join('');
        let counts = {T:0, X:0};
        for(let i=0; i<tx.length-4; i++) {
            if(tx.slice(i, i+3).join('') === last3) counts[tx[i+3]]++;
        }
        return counts.T > counts.X ? 'T' : (counts.X > counts.T ? 'X' : null);
    },
    entropyCalc: (tx) => {
        const arr = tx.slice(-12);
        if (arr.length < 12) return null;
        const freq = arr.reduce((a, v) => { a[v] = (a[v] || 0) + 1; return a; }, {});
        const e = Object.values(freq).reduce((s, f) => {
            const p = f / arr.length;
            return s - p * Math.log2(p);
        }, 0);
        return e > 0.95 ? (tx.at(-1) === 'T' ? 'X' : 'T') : tx.at(-1);
    },
    adaptiveNgram: (tx) => {
        let best = null;
        for(let k=2; k<=4; k++){
            const gram = tx.slice(-k).join('');
            let c = {T:0, X:0};
            for(let i=0; i<tx.length-k; i++) if(tx.slice(i,i+k).join('')===gram) c[tx[i+k]]++;
            if(c.T !== c.X) best = c.T > c.X ? 'T' : 'X';
        }
        return best;
    }
};

// ================================================================
// 2. ENGINE DỰ ĐOÁN TỔNG HỢP (ENSEMBLE)
// ================================================================
const seiuManager = {
    getPrediction: (history) => {
        // Trả về mặc định nếu không có dữ liệu để tránh lỗi Undefined
        if (!history || history.length < 5) return { prediction: "N/A", confidence: 0, votes: {T:0, X:0} };
        
        const tx = history.map(h => (h.totalScore >= 11 || h.result === "Tài") ? 'T' : 'X');
        let votes = { T: 0, X: 0 };
        
        Object.values(Algos).forEach(algo => {
            const res = algo(tx);
            if (res === 'T') votes.T++; else if (res === 'X') votes.X++;
        });

        const total = votes.T + votes.X;
        const result = votes.T >= votes.X ? 'T' : 'X';
        const confidence = total > 0 ? (Math.max(votes.T, votes.X) / total) : 0;

        return { prediction: result, confidence, votes };
    }
};

// ================================================================
// 3. FETCH DATA & RENDER CONSOLE
// ================================================================
async function updateDataAndRender() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const rawList = data.data || data;
        if (!Array.isArray(rawList)) return;
        
        rikResults = rawList.slice(0, 50);
        const currentSession = rikResults[0];
        const historyLabels = rikResults.slice(0, 15).reverse().map(h => (h.totalScore >= 11) ? 'T' : 'X');
        const pred = seiuManager.getPrediction(rikResults);
        
        const dices = currentSession.dices || currentSession.dice || [0,0,3];
        const d3 = dices[2];
        
        renderGigaUI(currentSession.sessionId || currentSession.id, historyLabels, pred, d3);
    } catch (e) {
        console.log("🕒 Đang kết nối API Tele68...");
    }
}

function renderGigaUI(session, history, pred, d3) {
    console.clear();
    console.log("🚀 Tool Online | Phiên tiếp theo: " + (parseInt(session) + 1));
    console.log("Dự đoán: " + (pred.prediction === 'T' ? "TÀI" : "XỈU") + " (" + (pred.confidence * 100).toFixed(1) + "%)");
}

// ================================================================
// 4. ROUTE CHO RENDER (Giao diện JSON)
// ================================================================
app.get("/", async (request, reply) => {
    // PHÒNG THỦ: Nếu chưa lấy được dữ liệu từ API
    if (rikResults.length === 0) {
        return { status: "loading", message: "Đang tải dữ liệu phiên, vui lòng đợi 5s rồi tải lại trang..." };
    }

    const lastSession = rikResults[0];
    const predictionData = seiuManager.getPrediction(rikResults);
    
    // Đảm bảo votes luôn có giá trị
    const votes = predictionData.votes || { T: 0, X: 0 };

    const THANH_MAP = {1:5, 2:4, 3:6, 4:2, 5:1, 6:3};
    const dices = lastSession.dices || lastSession.dice || [0, 0, 3];
    const d3 = dices[2];
    const lotThanh = THANH_MAP[d3] || 0;
    const lotCoDinh = (predictionData.prediction === 'T') ? [12, 14, 16] : [5, 7, 10];
    const lot_tong_hop = [...new Set([...lotCoDinh, lotThanh])].sort((a, b) => a - b);

    return {
        id: "@KuBinDev .",
        phien_vua_xong: {
            id: lastSession.sessionId || lastSession.id || "N/A",
            ket_qua: (lastSession.totalScore >= 11) ? `TÀI (${lastSession.totalScore})` : `XỈU (${lastSession.totalScore})`,
            dice: dices.join("-")
        },
        du_doan_phien_moi: {
            id_tiep: parseInt(lastSession.sessionId || lastSession.id || 0) + 1,
            lenh: predictionData.prediction === 'T' ? "TÀI" : "XỈU",
            confidence: `${(predictionData.confidence * 100).toFixed(1)}%`,
            lot_vi: lot_tong_hop
        },
        analysis: {
            votes: `${votes.T}T - ${votes.X}X`,
            cau_gan_day: rikResults.slice(0, 10).map(h => h.totalScore >= 11 ? "T" : "X").join("-")
        },
        version: VERSION
    };
});

// ================================================================
// 5. KHỞI CHẠY
// ================================================================
const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        await app.listen({ port: port, host: "0.0.0.0" });
        console.log(`🚀 Server S18 Bá rõ . Online tại cổng: ${port}`);
        
        // Chạy ngay lần đầu
        await updateDataAndRender();
        // Lặp lại sau 15s
        setInterval(updateDataAndRender, 15000);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
