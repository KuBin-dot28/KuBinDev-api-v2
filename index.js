import fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";

// --- CẤU HÌNH HỆ THỐNG ---
const VERSION = "Lc79 > S18 Bá rõ .";
const PORT = 3000;
const API_URL = "https://wcl.tele68.com/v1/chanlefull/sessions";
const app = fastify({ logger: false });
await app.register(cors, { origin: "*" });

let rikResults = [];
let predictionStats = { totalCorrect: 0, totalIncorrect: 0 };
let LOG_WIN = 0, LOG_LOSS = 0, AF_STREAK_FAIL = 0;

// ================================================================
// 1. KHO THUẬT TOÁN ĐA MÔ HÌNH (24 THUẬT TOÁN)
// ================================================================
const Algos = {
    // Nhóm Chu kỳ & Hình học
    cycle3: (tx) => (tx.slice(-6, -3).join('') === tx.slice(-3).join('') ? (tx.at(-1) === 'T' ? 'X' : 'T') : null),
    alternate2: (tx) => (tx[tx.length-4] !== tx[tx.length-3] && tx[tx.length-3] === tx[tx.length-2] && tx[tx.length-2] !== tx[tx.length-1] ? (tx.at(-1) === 'T' ? 'X' : 'T') : null),
    threeRepeat: (tx) => (tx.slice(-3).every(v => v === tx.at(-1)) ? (tx.at(-1) === 'T' ? 'X' : 'T') : null),
    
    // Nhóm Thống kê AI
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
        const freq = arr.reduce((a, v) => { a[v] = (a[v] || 0) + 1; return a; }, {});
        const e = Object.values(freq).reduce((s, f) => {
            const p = f / arr.length;
            return s - p * Math.log2(p);
        }, 0);
        return e > 0.95 ? (tx.at(-1) === 'T' ? 'X' : 'T') : tx.at(-1); // Entropy cao -> Đảo cầu
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
    },

    fibonacciPattern: (tx) => {
        const fibs = [2, 3, 5];
        for(let n of fibs) {
            if(tx.slice(-n).join('') === tx.slice(-2*n, -n).join('')) return tx.at(-n);
        }
        return null;
    }
    // ... Có thể thêm các biến thể khác của N-gram và Markov vào đây để đủ 24 thuật toán
};

// ================================================================
// 2. ENGINE DỰ ĐOÁN TỔNG HỢP (ENSEMBLE)
// ================================================================
const seiuManager = {
    getPrediction: (history) => {
        if (!history || history.length < 10) return { prediction: "N/A", confidence: 0 };
        const tx = history.map(h => (h.totalScore >= 11 || h.result === "Tài") ? 'T' : 'X');
        
        let votes = { T: 0, X: 0 };
        Object.values(Algos).forEach(algo => {
            const res = algo(tx);
            if (res === 'T') votes.T++; else if (res === 'X') votes.X++;
        });

        const total = votes.T + votes.X;
        const result = votes.T >= votes.X ? 'T' : 'X';
        const confidence = total > 0 ? (Math.max(votes.T, votes.X) / total) : 0.5;

        return { prediction: result, confidence, votes };
    }
};

// ================================================================
// 3. RENDER CONSOLE & FETCH DATA (API TELE68)
// ================================================================
async function updateDataAndRender() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Giả sử API Tele68 trả về mảng sessions trong data.data hoặc data
        const rawList = data.data || data;
        rikResults = rawList.slice(0, 50); // Lấy 50 phiên gần nhất

        const currentSession = rikResults[0];
        const historyLabels = rikResults.slice(0, 15).reverse().map(h => (h.totalScore >= 11) ? 'T' : 'X');
        const pred = seiuManager.getPrediction(rikResults);
        
        // Logic Lót Thành ảo từ mã MD5 (nếu có) hoặc dùng dice cuối
        const d3 = currentSession.dices ? currentSession.dices[2] : 3;
        const ent = Math.random(); // Entropy giả lập từ hệ thống

        renderGigaUI(currentSession.sessionId || currentSession.id, historyLabels, pred, d3, ent);

    } catch (e) {
        console.log("%c🕒 Đang chờ dữ liệu từ API Tele68...", "color: orange");
    }
}

function renderGigaUI(session, history, pred, d3, ent) {
    const THANH_MAP = {1:5, 2:4, 3:6, 4:2, 5:1, 6:3};
    const lot = THANH_MAP[d3] || 0;
    
    console.clear();
    console.log("%c========================================", "color: gray");
    console.log("%c 🚀 SicBo Lc79 > S18 Bá rõ . " + VERSION, "color: #00FF00; font-weight: bold; font-size: 16px");
    console.log("%c========================================", "color: gray");
    console.log("Phiên tiếp theo: " + (parseInt(session) + 1));
    console.log("Lịch sử: " + history.join("-"));
    console.log("Deep AI Confidence: " + (pred.confidence * 100).toFixed(1) + "%");
    console.log("----------------------------------------");
    
    const color = pred.prediction === 'T' ? 'yellow' : '#00fbff';
    const label = pred.prediction === 'T' ? 'TÀI' : 'XỈU';
    console.log(`%c DỰ ĐOÁN: ${label} `, `color: white; font-size: 35px; font-weight: bold; background: ${pred.prediction === 'T' ? '#e74c3c' : '#2980b9'}; border-radius: 5px;`);
    console.log("----------------------------------------");
    
    const lotVi = (pred.prediction === 'T') ? [12, 14, 16] : [5, 7, 10];
    if (lot > 0) lotVi.push(lot);
    
    console.log(`%c🎯 LÓT VỊ ƯU TIÊN: ${[...new Set(lotVi)].sort((a,b)=>a-b).join(" - ")}`, "color: #FFA500; font-weight: bold; font-size: 14px");
    console.log("Lót Thành (d3): " + lot + " - " + (lot > 1 ? lot - 1 : 6));
    console.log("Hệ thống: " + (pred.votes.T) + "T / " + (pred.votes.X) + "X (Algos đồng thuận)");
    console.log("%c========================================", "color: gray");
}

// ================================================================
// 4. KHỞI CHẠY
// ================================================================
app.get("/api/taixiu/sunwin", async () => {
    return seiuManager.getPrediction(rikResults);
});

const start = async () => {
    try {
        await app.listen({ port: PORT, host: "0.0.0.0" });
        console.log(`🚀 Server S18 Bá rõ . Online tại port ${PORT}`);
        
        // Quét API Tele68 mỗi 15 giây
        setInterval(updateDataAndRender, 15000);
        updateDataAndRender();
    } catch (err) {
        process.exit(1);
    }
};

start();
