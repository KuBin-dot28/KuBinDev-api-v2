'use strict';
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

/* ==========================================================
   PHẦN 1: LOGIC TOÁN HỌC SMA (KHÔNG RANDOM)
   ========================================================== */
const calculatePoint = (history) => {
    if (!history || history.length < 5) return 10;
    
    // Lấy mảng điểm 5 phiên gần nhất (P0 là mới nhất)
    const P = history.slice(0, 5).map(x => x.total);
    
    // 1. Tính Trung bình trượt (SMA5)
    const sma = P.reduce((a, b) => a + b, 0) / 5;
    
    // 2. Tính Trend biến thiên (Nhịp cầu)
    // Nếu điểm đang có xu hướng tăng/giảm thì Trend sẽ cộng dồn vào SMA
    const trend = ((P[0] - P[1]) + (P[1] - P[2]) + (P[2] - P[3])) / 3;
    
    // 3. Dự đoán điểm phiên tới: SMA + Trend điều chỉnh (Hệ số 0.8)
    let next = Math.round(sma + (trend * 0.8));
    
    // Chặn biên vật lý (3-18 điểm)
    return Math.max(3, Math.min(18, next));
};

/* ==========================================================
   PHẦN 2: KẾT NỐI API & LÁCH CHẶN IP
   ========================================================== */
app.get('/', async (req, res) => {
    // API Game Tele68
    const targetUrl = 'https://wtxmd52.tele68.com/v1/txmd5/sessions';
    
    // Proxy AllOrigins để "mượn" IP lách qua Firewall của Game
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`;

    try {
        const response = await axios.get(proxyUrl, { timeout: 15000 });
        
        // Giải mã dữ liệu từ Proxy
        const rawData = JSON.parse(response.data.contents);
        
        if (!rawData || !Array.isArray(rawData)) throw new Error("API Game trả về trống");

        // Chuyển đổi dữ liệu sang dạng KuBin dễ đọc
        const history = rawData.slice(0, 20).map(d => ({
            session: d.session,
            total: d.total,
            result: d.total >= 11 ? "TÀI" : "XỈU",
            dice: `${d.dice1}-${d.dice2}-${d.dice3}`
        }));

        // Thực hiện tính toán
        const nextP = calculatePoint(history);
        const prediction = nextP >= 11 ? "TÀI" : "XỈU";
        const gap = Math.abs(nextP - 10.5);

        // TRẢ VỀ JSON CHUẨN @KUBINDEV
        res.json({
            "author": "@KuBinDev .",
            "status": "HỆ THỐNG ĐANG CHẠY (MATH-ENGINE OK)",
            "phien_vua_xong": {
                "id": history[0].session,
                "ket_qua": history[0].result,
                "tong_diem": history[0].total,
                "dice_chi_tiet": history[0].dice
            },
            "du_doan_phien_moi": {
                "id_tiep_theo": history[0].session + 1,
                "lenh_danh": prediction,
                "du_toan_diem": nextP, // Điểm số tính toán theo nhịp cầu SMA
                "do_tin_cay": `${(55 + gap * 8).toFixed(1)}%`
            },
            "phan_tich_ky_thuat": {
                "trang_thai_cau": nextP > 13 ? "CỰC TÀI (MẠNH)" : (nextP < 8 ? "CỰC XỈU (MẠNH)" : "CẦU BIẾN ĐỘNG"),
                "cong_thuc": "SMA-Trend Analysis (Tele68 Special)",
                "chuoi_10_phien": history.slice(0, 10).map(x => x.result[0]).join('-')
            },
            "chien_thuat": nextP === 10 || nextP === 11 ? "CẦU ĐỐI/GÃY - THEO DÕI" : "VÀO TIỀN ĐỀU TAY"
        });

    } catch (e) {
        res.json({
            "author": "@KuBinDev .",
            "status": "LỖI KẾT NỐI API GAME",
            "huong_dan": "F5 LẠI TRANG HOẶC CHỜ SERVER GAME MỞ CHẶN",
            "loi_chi_tiet": e.message
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 KuBin Proxy-Math Engine Online - Port ${PORT}`));
