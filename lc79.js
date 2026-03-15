const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require('express');
const app = express();
const PORT = 8000;

const API_URL = 'https://wtxmd52.tele68.com/v1/txmd5/sessions';

// Lưu trữ trạng thái hệ thống để đối soát thắng thua
let STORAGE = {
    lastPhien: 0,
    currentPred: null,
    winLog: []
};

class BinUltimateEngine {
    analyze(list) {
        if (!list || list.length < 30) return null;

        const last = list[0]; 
        const results = list.map(h => h.resultTruyenThong === "TAI" ? "T" : "X");
        const dices = [...last.dices].sort().join('');
        
        let pred = ""; 
        let logic = ""; 
        let conf = 75;

        // Đếm dây bệt hiện tại
        let streak = 1;
        for(let i=0; i<10; i++) if(results[i] === results[i+1]) streak++; else break;

        // ============================================================
        // HỆ THỐNG PHÂN TÍCH 4 LỚP (KHÔNG BỎ PHIÊN)
        // ============================================================

        // LỚP 1: CẢNH BÁO NGHỈ (Kép 10-11 liên tục)
        if ((last.point === 10 || last.point === 11) && (list[1].point === 10 || list[1].point === 11)) {
            return { phien: last.id, du_doan: "NGHỈ", logic: "Kép liên tục -> Nghỉ 3 tay test cầu", conf: 0, dices: last.dices, tong: last.point, ket_qua: (last.resultTruyenThong === "TAI" ? "Tài" : "Xỉu") };
        }

        // LỚP 2: ĐIỂM TỦ ĐẶC BIỆT (Ưu tiên cao nhất)
        if (last.point === 10 && last.resultTruyenThong === "XIU") {
            if (dices === '244') { pred = "Tài"; logic = "X10(442) rớt Tài"; conf = 95; }
            else { pred = "Xỉu"; logic = "X10 thường -> Rớt Xỉu cao"; conf = 80; }
        }
        else if (last.point === 11 && last.resultTruyenThong === "TAI") {
            if (dices === '155' || dices === '245') { pred = "Tài"; logic = "T11(551/542) bám Tài"; conf = 95; }
            else if (streak >= 4) { pred = "Tài"; logic = "Bệt Tài rớt 11 -> Thêm 1 con Tài rồi mới bẻ"; conf = 85; }
            else { pred = "Xỉu"; logic = "T11 thường -> Rớt Xỉu"; conf = 80; }
        }
        else if (last.point === 7) { pred = "Xỉu"; logic = "Xỉu 7 rớt Xỉu cao"; conf = 85; }
        else if (last.point === 6) {
            pred = (streak >= 3) ? "Xỉu" : (results[1] === "T" ? "Xỉu" : "Tài");
            logic = "Xỉu 6 -> Bắt theo nhịp cầu bệt/1-1"; conf = 80;
        }

        // LỚP 3: THẾ CẦU KINH ĐIỂN (Nếu không có điểm đặc biệt)
        if (!pred) {
            const s6 = results.slice(0, 6).join('');
            // Hậu bệt rớt cặp -> 1212
            if (results[0] === results[1] && results[1] !== results[2] && results[2] === results[3]) {
                pred = (results[0] === "T" ? "Xỉu" : "Tài"); logic = "Hậu bệt rớt cặp -> Bắt 1212"; conf = 90;
            }
            // Cầu 321 sang 322
            else if (s6 === "TXXXXT" || s6 === "XTTTTX") {
                pred = (last.resultTruyenThong === "TAI" ? "Tài" : "Xỉu"); logic = "Hết 321 -> Lên 322"; conf = 85;
            }
            // Bệt dài
            else if (streak >= 4) {
                pred = (last.resultTruyenThong === "TAI" ? "Tài" : "Xỉu"); logic = `Bệt ${streak} tay -> Đu tiếp`; conf = 85;
            }
            // Cầu 2-3 / 3-2
            else {
                const tCount = results.slice(0, 5).filter(x => x === "T").length;
                if (tCount === 2 || tCount === 3) {
                    pred = (last.resultTruyenThong === "TAI" ? "Xỉu" : "Tài"); logic = "Cầu 2-3/3-2 -> Đánh đảo"; conf = 85;
                }
            }
        }

        // LỚP 4: TRỊ CẦU LOẠN / TÙM LUM
        if (!pred) {
            pred = (last.resultTruyenThong === "TAI" ? "Xỉu" : "Tài");
            logic = "Cầu loạn -> Ép nhịp nghịch 1-1"; conf = 60;
        }

        return {
            phien: last.id, dices: last.dices, tong: last.point,
            ket_qua: last.resultTruyenThong === "TAI" ? "Tài" : "Xỉu",
            du_doan: pred, pattern: results.slice(0, 20).join(''), logic: logic, conf: conf
        };
    }
}

const engine = new BinUltimateEngine();

app.get('/predict', async (req, res) => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const analysis = engine.analyze(data.list);

        let checkStatus = "Đang phân tích...";
        if (STORAGE.currentPred && STORAGE.currentPred.target === analysis.phien) {
            const isWin = STORAGE.currentPred.value === analysis.ket_qua;
            STORAGE.winLog.push(isWin);
            if (STORAGE.winLog.length > 20) STORAGE.winLog.shift();
            checkStatus = `Dự đoán: ${STORAGE.currentPred.value} | Kết quả: ${isWin ? "✅ ĐÚNG" : "❌ SAI"}`;
        }

        if (STORAGE.lastPhien !== analysis.phien) {
            STORAGE.currentPred = { target: analysis.phien + 1, value: analysis.du_doan };
            STORAGE.lastPhien = analysis.phien;
        }

        // Xuất JSON chuẩn y hệt mẫu ông Bin yêu cầu
        res.json({
            id: "@KubinDev_VIP",
            phien: analysis.phien,
            xuc_xac_1: analysis.dices[0],
            xuc_xac_2: analysis.dices[1],
            xuc_xac_3: analysis.dices[2],
            tong: analysis.tong,
            ket_qua: analysis.ket_qua,
            du_doan: analysis.du_doan,
            pattern: analysis.pattern,
            so_sanh: checkStatus,
            phan_tich: analysis.logic,
            ti_le_tin_cay: analysis.conf + "%"
        });

    } catch (e) { res.json({ error: "Kết nối sàn thất bại" }); }
});

app.listen(PORT, () => console.log(`🚀 BIN VIP ENGINE LIVE: http://localhost:${PORT}/predict`));
