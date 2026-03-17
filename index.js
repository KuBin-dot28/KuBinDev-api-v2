'use strict';
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();

// Sử dụng CORS để tránh lỗi trình duyệt
app.use(cors());

/* ==========================================================
   PHẦN 1: CÔNG THỨC TOÁN HỌC (FIXED SMA)
   ========================================================== */
const getPoint = (history) => {
    if (!history || history.length < 3) return 10;
    const p = history.map(x => x.total);
    const sma = (p[0] + p[1] + p[2]) / 3;
    const trend = (p[0] - p[1]); 
    let next = Math.round(sma + (trend * 0.5));
    return Math.max(3, Math.min(18, next));
};

/* ==========================================================
   PHẦN 2: ROUTE TRANG CHỦ - GỌI TRỰC TIẾP GIẢ LẬP
   ========================================================== */
app.get('/', async (req, res) => {
    const url = 'http://wtxmd52.tele68.com/v1/txmd5/sessions';
    
    try {
        // Giả lập Headers như một trình duyệt thực thụ để tránh bị 502/403
        const response = await axios.get(url, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'http://tele68.com/',
                'Origin': 'http://tele68.com'
            }
        });

        const data = response.data;
        if (!data || !Array.isArray(data)) throw new Error("Data Format Error");

        const history = data.slice(0, 15).map(d => ({
            session: d.session,
            total: d.total,
            result: d.total >= 11 ? "TÀI" : "XỈU",
            dice: `${d.dice1}-${d.dice2}-${d.dice3}`
        }));

        const nextP = getPoint(history);

        res.status(200).json({
            "author": "@KuBinDev .",
            "status": "LIVE - ĐÃ KẾT NỐI TRỰC TIẾP",
            "phien_vua_xong": {
                "id": history[0].session,
                "ket_qua": history[0].result,
                "diem": history[0].total,
                "dice": history[0].dice
            },
            "du_doan_phien_moi": {
                "id_tiep_theo": history[0].session + 1,
                "lenh_danh": nextP >= 11 ? "TÀI" : "XỈU",
                "du_toan_diem": nextP,
                "do_tin_cay": `${(55 + Math.abs(nextP - 10.5) * 8).toFixed(1)}%`
            },
            "phan_tich": "TOÁN HỌC SMA-TREND (NON-RANDOM)"
        });

    } catch (e) {
        // Nếu lỗi, trả về dữ liệu mẫu để App không bao giờ bị 502
        res.status(200).json({
            "author": "@KuBinDev .",
            "status": "SERVER GAME ĐANG BẬN",
            "huong_dan": "Vui lòng F5 lại trang sau 5 giây.",
            "loi": e.message
        });
    }
});

// Render yêu cầu listen trên 0.0.0.0
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 KuBin v7 Online - Port ${PORT}`);
});
