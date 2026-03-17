'use strict';
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

/* ==========================================================
   PHẦN 1: KUBIN MATHEMATICAL LOGIC (NON-RANDOM)
   ========================================================== */
class KuBinMathEngine {
    constructor() {}

    // Công thức tính tổng điểm phiên tới dựa trên biến thiên (Trend)
    calculateNextPoint(history) {
        if (!history || history.length < 5) return 10;

        // Lấy danh sách điểm 5 phiên gần nhất (P0 là mới nhất)
        const P = history.slice(0, 5).map(x => x.diem);

        // 1. Tính Trung bình trượt 5 phiên (SMA5)
        const sma = P.reduce((a, b) => a + b, 0) / 5;

        // 2. Tính Nhịp Độ Biến Thiên (Trend)
        // Công thức: Trend = ((P0 - P1) + (P1 - P2) + (P2 - P3)) / 3
        const trend = ((P[0] - P[1]) + (P[1] - P[2]) + (P[2] - P[3])) / 3;

        // 3. Dự đoán điểm phiên tới: Điểm trung bình cộng với xu hướng nhịp
        let predicted = sma + (trend * 0.8);

        // Chặn biên vật lý xúc xắc (Min 3 - Max 18)
        return Math.max(3, Math.min(18, Math.round(predicted)));
    }

    // Nhận diện trạng thái cầu thực tế
    detectBridgeType(history) {
        const h = history.slice(0, 4).map(x => x.ket_qua);
        if (h[0] === h[1] && h[1] === h[2] && h[2] === h[3]) return `BỆT ${h[0]}`;
        if (h[0] !== h[1] && h[1] !== h[2] && h[2] !== h[3]) return "CẦU ĐẢO 1-1";
        return "CẦU BIẾN ĐỘNG";
    }

    getAnalysis(history) {
        const top = history[0];
        const nextPoint = this.calculateNextPoint(history);
        const prediction = nextPoint >= 11 ? "TÀI" : "XỈU";
        
        // Tính độ tin cậy bằng khoảng cách tới điểm cân bằng 10.5
        // Càng xa 10.5 (về 3 hoặc 18) thì tỉ lệ nổ càng cao
        const gap = Math.abs(nextPoint - 10.5);
        const confidence = 50 + (gap * 8.5); 

        return {
            id_tiep_theo: top.phien + 1,
            lenh_danh: prediction,
            diem_du_toan: nextPoint,
            do_tin_cay: `${Math.min(99, confidence).toFixed(1)}%`,
            trang_thai_cau: this.detectBridgeType(history),
            chuoi_10: history.slice(0, 10).map(x => x.ket_qua[0]).join('-')
        };
    }
}

const engine = new KuBinMathEngine();

/* ==========================================================
   PHẦN 2: KẾT NỐI API & XỬ LÝ DỮ LIỆU
   ========================================================== */
async function fetchGameData() {
    try {
        const res = await axios.get('https://wtxmd52.tele68.com/v1/txmd5/sessions', { timeout: 6000 });
        if (!res.data || !Array.isArray(res.data)) return null;
        
        return res.data.map(d => ({
            phien: d.session,
            ket_qua: d.total >= 11 ? "TÀI" : "XỈU",
            diem: d.total,
            dice: `${d.dice1}-${d.dice2}-${d.dice3}`
        }));
    } catch (e) {
        console.error("Lỗi kết nối API:", e.message);
        return null;
    }
}

app.get('/analyze', async (req, res) => {
    const history = await fetchGameData();
    if (!history) return res.status(500).json({ error: "Không thể lấy dữ liệu từ Server Game" });

    const analysis = engine.getAnalysis(history);

    // --- TRẢ VỀ JSON FORMAT @KUBINDEV (KHÔNG RANDOM) ---
    res.json({
        "author": "@KuBinDev .",
        "phien_vua_xong": {
            "id": history[0].phien,
            "ket_qua": history[0].ket_qua,
            "tong_diem": history[0].diem,
            "dice_chi_tiet": history[0].dice
        },
        "du_doan_phien_moi": {
            "id_tiep_theo": analysis.id_tiep_theo,
            "lenh_danh": analysis.lenh_danh,
            "du_toan_diem": analysis.diem_du_toan, // Điểm số tính toán từ 3-18
            "do_tin_cay": analysis.do_tin_cay
        },
        "phan_tich_ky_thuat": {
            "trang_thai_cau": analysis.trang_thai_cau,
            "cong_thuc": "SMA-Trend Regression (Non-Random)",
            "chuoi_10_phien": analysis.chuoi_10
        },
        "chien_thuat": analysis.diem_du_toan >= 15 || analysis.diem_du_toan <= 6 ? "VÀO TIỀN MẠNH" : "VÀO TIỀN ĐỀU TAY"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 KuBin Math-Engine 5.0 Online - Port ${PORT}`));
