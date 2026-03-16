import fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";
import fs from "node:fs";

// ============================================================
// HỆ THỐNG SIÊU MÁY TÍNH DỰ ĐOÁN LC79 - BẢN FULL KHÔNG RÚT GỌN
// ============================================================
const app = fastify({ logger: false });
const PORT = 3000;
const PATH_MEMORY = './AIlc79.json';
const API_URL = 'https://wtxmd52.tele68.com/v1/txmd5/sessions';

await app.register(cors, { origin: "*" });

class LC79ComprehensiveEngine {
    constructor() {
        this.predictionStats = { totalCorrect: 0, totalIncorrect: 0 };
        this.lastPrediction = null;
        this.memory = {
            diemTu: { trongSo: 2.5, count: 0 },
            xacSuat: { trongSo: 1.5, count: 0 },
            chuoiPattern: { trongSo: 1.2, count: 0 }
        };
        this.loadMemory();
    }

    loadMemory() {
        try {
            if (fs.existsSync(PATH_MEMORY)) {
                const saved = JSON.parse(fs.readFileSync(PATH_MEMORY, 'utf8'));
                this.memory = saved;
                this.predictionStats.totalCorrect = saved.totalCorrect || 0;
                this.predictionStats.totalIncorrect = saved.totalIncorrect || 0;
            }
        } catch (e) {
            console.log("Khởi tạo bộ nhớ mới...");
        }
    }

    saveMemory() {
        try {
            const dataToSave = {
                ...this.memory,
                totalCorrect: this.predictionStats.totalCorrect,
                totalIncorrect: this.predictionStats.totalIncorrect
            };
            fs.writeFileSync(PATH_MEMORY, JSON.stringify(dataToSave, null, 2));
        } catch (e) {
            // Lỗi lưu file
        }
    }

    // ============================================================
    // PHẦN 1: CÁC HÀM TIỀN XỬ LÝ TOÁN HỌC (BÊ NGUYÊN TỪ CODE 1)
    // ============================================================
    
    unique(arr) {
        return Array.from(new Set(arr));
    }

    avg(nums) {
        if (!nums.length) return 0;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    sum(nums) {
        return nums.reduce((a, b) => a + b, 0);
    }

    entropy(arr) {
        if (!arr.length) return 0;
        const freq = arr.reduce((a, v) => {
            a[v] = (a[v] || 0) + 1;
            return a;
        }, {});
        const n = arr.length;
        let e = 0;
        for (const k in freq) {
            const p = freq[k] / n;
            e -= p * Math.log2(p);
        }
        return e;
    }

    similarity(a, b) {
        if (a.length !== b.length) return 0;
        let m = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] === b[i]) m++;
        }
        return m / a.length;
    }

    extractFeatures(history) {
        const tx = history.map(h => h.tx);
        const totals = history.map(h => h.total);
        const freq = tx.reduce((a, v) => {
            a[v] = (a[v] || 0) + 1;
            return a;
        }, {});
        
        let runs = [], cur = tx[0], len = 1;
        for (let i = 1; i < tx.length; i++) {
            if (tx[i] === cur) {
                len++;
            } else {
                runs.push({ val: cur, len });
                cur = tx[i];
                len = 1;
            }
        }
        runs.push({ val: cur, len });

        const meanTotal = this.avg(totals);
        const stdTotal = Math.sqrt(this.avg(totals.map(t => Math.pow(t - meanTotal, 2))));

        return { 
            tx, 
            totals, 
            freq, 
            runs, 
            meanTotal, 
            stdTotal, 
            entropy: this.entropy(tx) 
        };
    }

    // ============================================================
    // PHẦN 2: TẤT CẢ THUẬT TOÁN DỰ ĐOÁN (GIỮ NGUYÊN ĐỘ DÀI)
    // ============================================================

    algo1_cycle3(tx) {
        if (tx.length < 6) return null;
        if (tx.slice(-6, -3).join('') === tx.slice(-3).join(null)) {
             return null;
        }
        if (tx.slice(-6, -3).join('') === tx.slice(-3).join('')) {
            return tx.at(-1) === 'T' ? 'X' : 'T';
        }
        return null;
    }

    algo2_alternate(tx) {
        if (tx.length < 4) return null;
        const last4 = tx.slice(-4);
        if (last4[0] !== last4[1] && last4[1] === last4[2] && last4[2] !== last4[3]) {
            return last4[3] === 'T' ? 'X' : 'T';
        }
        return null;
    }

    algo3_triple(tx) {
        const last3 = tx.slice(-3);
        if (last3.length === 3 && last3[0] === last3[1] && last3[1] === last3[2]) {
            return last3[0] === 'T' ? 'X' : 'T';
        }
        return null;
    }

    algo4_pattern22(tx) {
        const last4 = tx.slice(-4);
        if (last4.length === 4 && last4[0] === last4[1] && last4[2] === last4[3] && last4[0] !== last4[2]) {
            return last4[3] === 'T' ? 'X' : 'T';
        }
        return null;
    }

    algo5_imbalance(f) {
        if ((f.freq['T'] || 0) > (f.freq['X'] || 0) + 2) {
            return 'X';
        }
        if ((f.freq['X'] || 0) > (f.freq['T'] || 0) + 2) {
            return 'T';
        }
        return null;
    }

    algoA_markovChain(tx) {
        const order = 3; 
        if (tx.length < order + 1) return null;
        const transitions = {};
        for (let i = 0; i <= tx.length - order - 1; i++) {
            const key = tx.slice(i, i + order).join('');
            const next = tx[i + order];
            transitions[key] = transitions[key] || { T: 0, X: 0 };
            transitions[key][next]++;
        }
        const currentKey = tx.slice(-order).join('');
        const counts = transitions[currentKey];
        if (!counts || counts.T === counts.X) return null;
        return counts.T > counts.X ? 'T' : 'X';
    }

    algoB_ngramModel(tx) {
        const k = 4; 
        if (tx.length < k + 1) return null;
        const lastGram = tx.slice(-k).join('');
        let counts = { T: 0, X: 0 };
        for (let i = 0; i <= tx.length - k - 1; i++) {
            if (tx.slice(i, i + k).join('') === lastGram) {
                counts[tx[i + k]]++;
            }
        }
        if (counts.T === counts.X) return null;
        return counts.T > counts.X ? 'T' : 'X';
    }

    algoC_FibonacciCheck(tx) {
        if (tx.length < 2) return null;
        const last = tx.at(-1);
        const last2 = tx.at(-2);
        if (last === last2) {
            return last === 'T' ? 'X' : 'T';
        }
        return last;
    }

    algoD_WindowSimilarity(tx) {
        const win = 6; 
        if (tx.length < win * 2) return null;
        const target = tx.slice(-win);
        let counts = { T: 0, X: 0 };
        for (let i = 0; i <= tx.length - win - 1; i++) {
            if (this.similarity(tx.slice(i, i + win), target) > 0.6) {
                counts[tx[i + win]]++;
            }
        }
        if (counts.T === counts.X) return null;
        return counts.T > counts.X ? 'T' : 'X';
    }

    algoE_AdaptiveNgram(tx) {
        let best = null;
        let maxCount = -1;
        for (let k = 3; k <= 5; k++) {
            if (tx.length < k + 1) continue;
            const gram = tx.slice(-k).join('');
            let c = { T: 0, X: 0 };
            for (let i = 0; i < tx.length - k; i++) {
                if (tx.slice(i, i + k).join('') === gram) {
                    c[tx[i + k]]++;
                }
            }
            if (Math.max(c.T, c.X) > maxCount && c.T !== c.X) {
                maxCount = Math.max(c.T, c.X);
                best = c.T > c.X ? 'T' : 'X';
            }
        }
        return best;
    }

    // ============================================================
    // PHẦN 3: LOGIC ĐIỂM TỦ & BỆT SÀN LC79
    // ============================================================

    check_lc79_special_logic(list) {
        const last = list[0];
        const dices = [...last.dices].sort();
        const results = list.map(h => h.resultTruyenThong === "TAI" ? "T" : "X");

        if (dices[0] === dices[1] && dices[1] === dices[2]) {
            return { 
                pred: "NGHỈ", 
                logic: "⚠️ Tam Quý (Bão)", 
                conf: "100%" 
            };
        }

        if (last.point === 10) {
            if (dices.join('') === '244') {
                return { pred: "T", logic: "Cầu tủ 10(2-4-4)", conf: "95%" };
            }
            return { pred: "X", logic: "Cầu tủ 10 rớt Xỉu", conf: "90%" };
        }

        let streak = 1;
        for (let i = 0; i < 10; i++) {
            if (results[i] === results[i + 1]) {
                streak++;
            } else {
                break;
            }
        }
        if (streak >= 4) {
            return { 
                pred: results[0], 
                logic: `Bệt ${streak} tay -> Đu tiếp`, 
                conf: "85%" 
            };
        }

        return null;
    }

    predict(dataList) {
        if (!dataList || dataList.length < 30) {
            return { du_doan: "NGHỈ", logic: "Thiếu dữ liệu", conf: "0%" };
        }

        const history = dataList.map(item => ({
            total: item.point,
            tx: item.resultTruyenThong === "TAI" ? "T" : "X"
        })).reverse();
        
        const txArray = history.map(h => h.tx);
        const features = this.extractFeatures(history);

        const special = this.check_lc79_special_logic(dataList);
        if (special) {
            return { du_doan: special.pred, logic: special.logic, conf: special.conf };
        }

        const votes = [
            this.algo1_cycle3(txArray),
            this.algo2_alternate(txArray),
            this.algo3_triple(txArray),
            this.algo4_pattern22(txArray),
            this.algo5_imbalance(features),
            this.algoA_markovChain(txArray),
            this.algoB_ngramModel(txArray),
            this.algoC_FibonacciCheck(txArray),
            this.algoD_WindowSimilarity(txArray),
            this.algoE_AdaptiveNgram(txArray)
        ].filter(v => v !== null);

        if (votes.length === 0) {
            return { du_doan: txArray.at(-1) === 'T' ? 'X' : 'T', logic: "Phân tích đảo", conf: "60%" };
        }

        const counts = votes.reduce((a, v) => {
            a[v] = (a[v] || 0) + 1;
            return a;
        }, {});

        const final = (counts['T'] || 0) >= (counts['X'] || 0) ? 'T' : 'X';
        const winVotes = Math.max(counts['T'] || 0, counts['X'] || 0);
        const confidence = Math.round((winVotes / votes.length) * 100);

        this.lastPrediction = { 
            session: dataList[0].id + 1, 
            pred: final
        };

        return {
            du_doan: final,
            logic: `Biểu quyết: ${counts['T'] || 0}T / ${counts['X'] || 0}X`,
            conf: confidence + "%"
        };
    }

    updateStats(currentSession, currentResult) {
        if (this.lastPrediction && this.lastPrediction.session === currentSession) {
            if (this.lastPrediction.pred === currentResult) {
                this.predictionStats.totalCorrect++;
            } else {
                this.predictionStats.totalIncorrect++;
            }
            this.saveMemory();
        }
    }
}

const engine = new LC79ComprehensiveEngine();

// ============================================================
// PHẦN 5: API SERVER (ĐỊNH DẠNG VIP FINAL)
// ============================================================

app.get("/api/taixiu/lc79", async (req, res) => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const last = data.list[0];
        
        const prediction = engine.predict(data.list);
        const realResult = last.resultTruyenThong === "TAI" ? "T" : "X";
        const patternString = data.list.slice(0, 20).map(item => item.resultTruyenThong === "TAI" ? "T" : "X").join('');

        engine.updateStats(last.id, realResult);

        return {
            id: "@KubinDev_VIP",
            source: "@Khnguyenenn",
            phien: last.id,
            xuc_xac_1: last.dices[0],
            xuc_xac_2: last.dices[1],
            xuc_xac_3: last.dices[2],
            tong: last.point,
            ket_qua: realResult === "T" ? "Tài" : "Xỉu",
            du_doan: prediction.du_doan === "T" ? "Tài" : (prediction.du_doan === "X" ? "Xỉu" : "Nghỉ"),
            pattern: patternString,
            so_sanh: "Đang phân tích...",
            phan_tich: prediction.logic,
            ti_le_tin_cay: prediction.conf,
            ai_stats: {
                win: engine.predictionStats.totalCorrect,
                loss: engine.predictionStats.totalIncorrect,
                accuracy: (engine.predictionStats.totalCorrect / (engine.predictionStats.totalCorrect + engine.predictionStats.totalIncorrect) * 100 || 0).toFixed(2) + "%"
            }
        };
    } catch (e) {
        return { error: "API Failed", message: e.message };
    }
});

app.listen({ port: PORT, host: "0.0.0.0" }, () => {
    console.log(`
    ======================================================
    🔥 LC79 GIGA ENGINE - BẢN FULL DÀI 100% LIVE!
    ➜ Xem dự đoán: http://localhost:${PORT}/api/taixiu/lc79
    ======================================================
    `);
});
