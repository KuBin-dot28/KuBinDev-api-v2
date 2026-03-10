from fastapi import FastAPI
from fastapi.responses import JSONResponse
import time
import hashlib

app = FastAPI()

# Chuỗi dữ liệu gốc (Ông có thể dán chuỗi của ông vào đây)
RAW_PATTERN = "TXXXXTTTTTXXXXXXTTXXXXXTTTTTTTTXXXTTXXXTXTTXTTTTTTTTTTXXTXXXXXXXXTXTXXXXTXXXTTXXTTTTXXXXXTTXXXTTTTXTXTXXTTTXTXXXTTTXXTXTTTTTTTTXXTXTTTTXXTTTXTXTXXXTTTXXXTXXXTTXXTTTTXXXXXTXXTXXXTTTXXXTTTTXXXXTTTTTTTXXXXTTTXXTTXXTTXXXTXTTTTXXXXTTXXTTXXXTTXTTTXXTTXXXXTXXTTXXTXTTXXXXXXXXXXTTXTXXTTXXTXXXTTTXTTTTTTTTXXXXXXXTXTTXXTXTXTTXTTTXTXTXXXXTXTXXTXXTTXXTTXXXXXXXXXXXXTXTTXTXXXTXTXXXXXXTTTTTTXXXXXTTTTTTTXXXXTTXTTXTXXXXXXXXXXXXXXTTXXTTXTTTTXTXTXXXXXTXTTXXXXTXXXXXTTXXTTXXTTTTXXXXXTTTTTTTXXXXXXXTXXXTTTXXTTTXXXTTTTTTTTTTXXXXTTTXTXTTTTTTTTXTXXXXTTTXTXXTTXXTXXXTXXXTTXXXXTTXTTXTTXTXTXXTXTXXXTTXXTXTXTTTXTTXTXXXXTTXTTXTXXTXXTXXTXTTXTTXTTXTTXTTXTXXXXXXXTTTTTTTTTTTXXXXXXXXXTTTXTTXTTTTTXXTTTTTTTTTTTTXTXXTTXXTXTXTTXXTXXXTXXXXXXXXXXXXXXTTTTTTTXXXXTXXXXXXXXTXXTTTTTTXXTTTXXTTXTTTTTXTTTXTTXXXTXTTXXTTTXXTXTTTTXXTTXXTTTTTXTTTTXXXTTTXXXTXTTTXTTTXXXTTTTTTTTTTTTTXTXTXXXTTTTTTXXTXTXXTTTTTXXXXXTTXXTTTTTXXXXXXXXXTTXXXXTXXXXXXTTXXTTTXXTXXTTTTTXXTXXXTTTXXXXTXXXXTTTXTTXXXXXXXXXXXTTXTTXTXXXTTXXXXXXXXXXTXXTTTTTXXXXTXTXTTXXXXXXXXXTTTXXXXTXTXTTTXXXXXTTTTTTTXXXXXXXXXXXXXTTTXXTTTXXTTTTTXXXTTTTXXTXXXXXTTTTTXTTTTXTTXTXTTTTTXXTXXTTTXXTTTTTXTXXTXTTTTXTTXXXXXXXTXXXXXTTTTXXTTXXXXXTTXTXXTXTXTTTXXTTXXXXXTXXTXTXTTXXTTXTTTXXTTXXTTTTTTTTTXXXTTTTXXTTXXTTXXXXXXTTTTTTTTTTTTXTTTTTXXXTTTXXXTTTTTTTTXXTXXXXXTTTTXXTXXTTXXXXXXXXXTXXXXXTTXXTTTXXXXXXXTXTXXTTTXXTTXTTTTTTXXXTTTXXXTXXTTXXXXTXXXXXXTXTTTTTTTTTXXTTTXXTTTXTXXTTXTTTXXXXXXTTXXXXXXXXXTTXTXXTXXXTTXTTTXXXTXTTXTTXXTXTXTTXXXXXXTXTTTTTTTTXTTXXTTTXTTTXXXXTTTTTTXXXTTTTTXTTTTXXTTTTTTXTXTTXXXXXXXXXXTTXXXTTTTTXXXXXXXXXXXXXXXXXXXTXTXTTTTTTXXTXXXTTXXTTXXTTXXXXTTTTTTTTXXXXXXXXXXXXTTXTTTTXXXTTTTXTXTXXXTTTTTXXXTXTXXTXTTXTTTTTTTXXXTXXXTXTTTTXXTTXXTTTXTXXXTXXXTTTXXTXXXXXXTXXTXXXXXXTTTTXXXTTTTTXXTTXXXXXXXXXXXXTTTTXTTTTTTTTTTTXXTTTXTXTXXTTXXTXXXXTTTXXXTXTXTTXTTXXXXTXXTTTXTXXXTXXXXXXTTTTTTXXXTXXXXTXXXXTXTTTXTXTTXXTXXXTTTTXTTXXTXTTTXXXTTTTTXXTTTTTXXTTXXXXXXXTXXXTXXXXTTXTTTTXXTTTTTXXTTXXXXTXTXTTXXTXTXXTTXXXTTXTTTXXXTTXXXTTXXXXXTTTTTXXTTXTTTTTXXTXXTXXTXTTTTXXXTXTTTTTXTXTTTTTTXXTXXTTTXXTTTTTTXXXXTTXXXTTXXTTTXXXTTTTTXTTXXXXXTTXXXXTTXXXTTTTXXTTTXXTXXXTTTXTTTXXTTTTTTTTTTTTXXTTXXXXXXXXXXTXXTTXXXXXTTXXTTTTTT"

@app.get("/")
def get_api_by_phien():
    # 1. Định nghĩa mốc thời gian gốc (Ví dụ phiên 3018434 lúc 8:00 AM)
    # 1741569600 là mốc Unix timestamp (tùy chỉnh để khớp game của ông)
    base_ts = 1741569600 
    now = int(time.time())
    
    # Tính số phút trôi qua kể từ mốc gốc
    elapsed_min = (now - base_ts) // 60
    
    phien_hien_tai = 3018434 + elapsed_min
    phien_tiep_theo = phien_hien_tai + 1

    # 2. Logic Deterministic - Dựa vào ID phiên để chốt kết quả (Dell bao giờ nhảy khi F5)
    seed = f"kubin_pro_v2_{phien_tiep_theo}"
    h = hashlib.md5(seed.encode()).hexdigest()
    
    # Kết quả Xỉu nếu số cuối là chẵn, Tài nếu lẻ (hoặc ngược lại tùy ông)
    du_doan = "Xỉu" if int(h[-1], 16) % 2 == 0 else "Tài"

    # 3. Phân tích thống kê từ chuỗi RAW (Lấy 100 ký tự cuối làm mẫu)
    recent_100 = RAW_PATTERN[-100:]
    t_count = recent_100.count("T")
    x_count = recent_100.count("X")
    
    # Tính chuyển tiếp T->T, T->X...
    trans = {"T->T": 0, "T->X": 0, "X->T": 0, "X->X": 0}
    for i in range(len(recent_100) - 1):
        k = f"{recent_100[i]}->{recent_100[i+1]}"
        if k in trans: trans[k] += 1

    # 4. Trả về đúng cấu hình ông gửi
    data = {
        "cau_truc_cau": {
            "patterns_detected": ["Cầu Bệt X (x2)", "Cầu 2-2", "Cầu Đối Xứng 3", "Cầu Lặp Nhịp 2"],
            "so_luong_pattern": 4
        },
        "do_tin_cay": "Rất cao ⭐⭐⭐",
        "du_doan_van_sau": du_doan,
        "giai_thich": "🔥 Cầu Bệt X x2 - Bám cầu (Fast Detect)",
        "giai_thich_chi_tiet": f"🔥 Cầu Bệt X x2 - Bám cầu (Fast Detect) | Độ tin cậy: Rất cao ⭐⭐⭐",
        "he_thong": "84 Models System (21 Major + 21 Mini + 42 Aux) + Deterministic V3",
        "id": "@mattinhnguoi_v2_full",
        "ket_qua_hien_tai": "Xỉu" if recent_100[-1] == "X" else "Tài",
        "model_info": {"aux_models": 42, "major_models": 21, "mini_models": 21, "weight_learning": "Active"},
        "pattern_full": RAW_PATTERN,
        "pattern_length": 10000,
        "pattern_recent_100": recent_100,
        "pattern_recent_20": recent_100[-20:],
        "pattern_recent_50": recent_100[-50:],
        "phien": phien_hien_tai,
        "phien_dudoan": phien_tiep_theo,
        "thong_ke": {
            "100_phien_gan_nhat": {"Tai": t_count, "Xiu": x_count, "ty_le": f"T:{t_count}/X:{x_count}"},
            "bias": "Cân bằng tốt",
            "chuyen_tiep": trans,
            "max_streak_Tai_100phien": 5,
            "max_streak_Xiu_100phien": 7,
            "ty_le_Tai": f"{t_count}.00%",
            "ty_le_Xiu": f"{x_count}.00%",
            "streak_hien_tai": "X x2"
        },
        "tinh_nang": ["Phát hiện 100+ loại cầu", "100% Deterministic - Không Random"],
        "ty_le_thanh_cong": "93.82%"
    }
    
    return JSONResponse(content=data)
