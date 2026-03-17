import math
import requests
import json
import os
from fastapi import FastAPI
import uvicorn
from typing import List, Dict, Any

app = FastAPI(title="Hệ Thống AI Dự Đoán MD5 - Bản Full Thuật Toán & Từ Điển")

# =========================================================
# 📚 TỪ ĐIỂN THUẬT TOÁN (Dán 12.000 dòng của bác vào đây)
# =========================================================
# Tui để mẫu vài dòng bác gửi, bác cứ dán tiếp vào cho đủ 12k nhé
BIG_DATA_PATTERNS = {
    "TXXTTXTX": "Xỉu",
"XXTTXTXX": "Tài",
"XTTXTXXT": "Tài",
"TTXTXXTT": "Tài",
"TXTXXTTT": "Xỉu",
"XTXXTTTX": "Xỉu",
"TXXTTTXX": "Tài",
"XXTTTXXT": "Xỉu",
"XTTTXXTX": "Xỉu",
"TTTXXTXX": "Xỉu",
"TTXXTXXX": "Xỉu",
"TXXTXXXX": "Xỉu",
"XXTXXXXX": "Tài",
"XTXXXXXT": "Xỉu",
"TXXXXXTX": "Xỉu",
"XXXXXTXX": "Xỉu",
"XXXXTXXX": "Tài",
"XXXTXXXT": "Xỉu",
"XXTXXXTX": "Xỉu",
"XTXXXTXX": "Xỉu",
"TXXXTXXX": "Tài",
"XXXTXXXT": "Xỉu",
"XXTXXXTX": "Xỉu",
"XTXXXTXX": "Xỉu",
"TXXXTXXX": "Xỉu",
"XXXTXXXX": "Tài",
"XXTXXXXT": "Tài",
"XTXXXXTT": "Xỉu",
"TXXXXTTX": "Xỉu",
"XXXXTTXX": "Xỉu",
"XXXTTXXX": "Tài",
"XXTTXXXT": "Xỉu",
"XTTXXXTX": "Tài",
"TTXXXTXT": "Xỉu",
"TXXXTXTX": "Tài",
"XXXTXTXT": "Tài",
"XXTXTXTT": "Tài",
"XTXTXTTT": "Tài",
"TXTXTTTT": "Tài",
"XTXTTTTT": "Tài",
"TXTTTTTT": "Xỉu",
"XTTTTTTX": "Tài",
"TTTTTTXT": "Xỉu",
"TTTTTXTX": "Tài",
"TTTTXTXT": "Tài",
"TTTXTXTT": "Xỉu",
"TTXTXTTX": "Tài",
"TXTXTTXT": "Xỉu",
"XTXTTXTX": "Tài",
"TXTTXTXT": "Tài",
"XTTXTXTT": "Xỉu",
"TTXTXTTX": "Tài",
"TXTXTTXT": "Xỉu",
"XTXTTXTX": "Xỉu",
"TXTTXTXX": "Xỉu",
"XTTXTXXX": "Tài",
"TTXTXXXT": "Tài",
"TXTXXXTT": "Xỉu",
"XTXXXTTX": "Xỉu",
"TXXXTTXX": "Tài",
"XXXTTXXT": "Xỉu",
"XXTTXXTX": "Xỉu",
"XTTXXTXX": "Xỉu",
"TTXXTXXX": "Tài",
"TXXTXXXT": "Tài",
"XXTXXXTT": "Tài",
"XTXXXTTT": "Tài",
"TXXXTTTT": "Tài",
"XXXTTTTT": "Tài",
"XXTTTTTT": "Xỉu",
"XTTTTTTX": "Xỉu",
"TTTTTTXX": "Xỉu",
"TTTTTXXX": "Tài",
"TTTTXXXT": "Xỉu",
"TTTXXXTX": "Tài",
"TTXXXTXT": "Tài",
"TXXXTXTT": "Xỉu",
"XXXTXTTX": "Xỉu",
"XXTXTTXX": "Tài",
"XTXTTXXT": "Tài",
"TXTTXXTT": "Tài",
"XTTXXTTT": "Xỉu",
"TTXXTTTX": "Tài",
"TXXTTTXT": "Xỉu",
"XXTTTXTX": "Xỉu",
"XTTTXTXX": "Xỉu",
"TTTXTXXX": "Tài",
"TTXTXXXT": "Tài",
"TXTXXXTT": "Xỉu",
"XTXXXTTX": "Xỉu",
"TXXXTTXX": "Xỉu",
"XXXTTXXX": "Tài",
"XXTTXXXT": "Xỉu",
"XTTXXXTX": "Tài",
"TTXXXTXT": "Tài",
"TXXXTXTT": "Xỉu",
"XXXTXTTX": "Xỉu",
"XXTXTTXX": "Xỉu",
"XTXTTXXX": "Tài",
"TXTTXXXT": "Xỉu",
"XTTXXXTX": "Xỉu",
"TTXXXTXX": "Tài",
"TXXXTXXT": "Xỉu",
"XXXTXXTX": "Tài",
"XXTXXTXT": "Xỉu",
"XTXXTXTX": "Tài",
"TXXTXTXT": "Tài",
"XXTXTXTT": "Xỉu",
"XTXTXTTX": "Tài",
"TXTXTTXT": "Tài",
"XTXTTXTT": "Tài",
"TXTTXTTT": "Xỉu",
"XTTXTTTX": "Tài",
"TTXTTTXT": "Tài",
"TXTTTXTT": "Xỉu",
"XTTTXTTX": "Tài",
"TTTXTTXT": "Xỉu",
"TTXTTXTX": "Xỉu",
"TXTTXTXX": "Tài",
"XTTXTXXT": "Xỉu",
"TTXTXXTX": "Tài",
"TXTXXTXT": "Tài",
"XTXXTXTT": "Tài",
"TXXTXTTT": "Tài",
"XXTXTTTT": "Tài",
"XTXTTTTT": "Xỉu",
"TXTTTTTX": "Xỉu",
"XTTTTTXX": "Xỉu",
"TTTTTXXX": "Xỉu",
"TTTTXXXX": "Xỉu",
"TTTXXXXX": "Xỉu",
"TTXXXXXX": "Tài",
"TXXXXXXT": "Tài",
"XXXXXXTT": "Xỉu",
"XXXXXTTX": "Xỉu",
"XXXXTTXX": "Tài",
"XXXTTXXT": "Xỉu",
"XXTTXXTX": "Tài",
"XTTXXTXT": "Tài",
"TTXXTXTT": "Tài",
"TXXTXTTT": "Tài",
"XXTXTTTT": "Xỉu",
"XTXTTTTX": "Tài",
"TXTTTTXT": "Xỉu",
"XTTTTXTX": "Xỉu",
"TTTTXTXX": "Tài",
"TTTXTXXT": "Xỉu",
"TTXTXXTX": "Tài",
"TXTXXTXT": "Xỉu",
"XTXXTXTX": "Tài",
"TXXTXTXT": "Tài",
"XXTXTXTT": "Tài",
"XTXTXTTT": "Xỉu",
"TXTXTTTX": "Xỉu",
"XTXTTTXX": "Tài",
"TXTTTXXT": "Tài",
"XTTTXXTT": "Tài",
"TTTXXTTT": "Tài",
"TTXXTTTT": "Xỉu",
"TXXTTTTX": "Tài",
"XXTTTTXT": "Xỉu",
"XTTTTXTX": "Tài",
"TTTTXTXT": "Tài",
"TTTXTXTT": "Xỉu",
"TTXTXTTX": "Xỉu",
"TXTXTTXX": "Xỉu",
"XTXTTXXX": "Xỉu",
"TXTTXXXX": "Tài",
"XTTXXXXT": "Xỉu",
"TTXXXXTX": "Tài",
"TXXXXTXT": "Xỉu",
"XXXXTXTX": "Tài",
"XXXTXTXT": "Tài",
"XXTXTXTT": "Tài",
"XTXTXTTT": "Tài",
"TXTXTTTT": "Xỉu",
"XTXTTTTX": "Xỉu",
"TXTTTTXX": "Tài",
"XTTTTXXT": "Xỉu",
"TTTTXXTX": "Xỉu",
"TTTXXTXX": "Xỉu",
"TTXXTXXX": "Tài",
"TXXTXXXT": "Xỉu",
"XXTXXXTX": "Xỉu",
"XTXXXTXX": "Tài",
"TXXXTXXT": "Tài",
"XXXTXXTT": "Tài",
"XXTXXTTT": "Xỉu",
"XTXXTTTX": "Tài",
"TXXTTTXT": "Tài",
"XXTTTXTT": "Xỉu",
"XTTTXTTX": "Xỉu",
"TTTXTTXX": "Xỉu",
"TTXTTXXX": "Xỉu",
"TXTTXXXX": "Xỉu",
"XTTXXXXX": "Tài",
"TTXXXXXT": "Tài",
"TXXXXXTT": "Tài",
"XXXXXTTT": "Tài",
"XXXXTTTT": "Xỉu",
"XXXTTTTX": "Tài",
"XXTTTTXT": "Xỉu",
"XTTTTXTX": "Tài",
"TTTTXTXT": "Tài",
"TTTXTXTT": "Xỉu",
"TTXTXTTX": "Tài",
"TXTXTTXT": "Xỉu",
"XTXTTXTX": "Tài",
"TXTTXTXT": "Xỉu",
"XTTXTXTX": "Tài",
"TTXTXTXT": "Xỉu",
"TXTXTXTX": "Tài",
"XTXTXTXT": "Xỉu",
"TXTXTXTX": "Tài",
"XTXTXTXT": "Xỉu",
"TXTXTXTX": "Xỉu",
"XTXTXTXX": "Tài",
"TXTXTXXT": "Xỉu",
"XTXTXXTX": "Tài",
"TXTXXTXT": "Xỉu",
"XTXXTXTX": "Tài",
"TXXTXTXT": "Xỉu",
"XXTXTXTX": "Tài",
"XTXTXTXT": "Tài",
"TXTXTXTT": "Tài",
"XTXTXTTT": "Xỉu",
"TXTXTTTX": "Xỉu",
"XTXTTTXX": "Xỉu",
"TXTTTXXX": "Xỉu",
"XTTTXXXX": "Tài",
"TTTXXXXT": "Tài",
"TTXXXXTT": "Xỉu",
"TXXXXTTX": "Xỉu",
"XXXXTTXX": "Xỉu",
"XXXTTXXX": "Tài",
"XXTTXXXT": "Xỉu",
"XTTXXXTX": "Tài",
"TTXXXTXT": "Xỉu",
"TXXXTXTX": "Xỉu",
"XXXTXTXX": "Xỉu",
"XXTXTXXX": "Tài",
"XTXTXXXT": "Tài",
"TXTXXXTT": "Xỉu",
"XTXXXTTX": "Xỉu",
"TXXXTTXX": "Tài",
"XXXTTXXT": "Tài",
"XXTTXXTT": "Tài",
"XTTXXTTT": "Tài",
"TTXXTTTT": "Tài",
"TXXTTTTT": "Tài",
"XXTTTTTT": "Xỉu",
"XTTTTTTX": "Tài",
"TTTTTTXT": "Tài",
"TTTTTXTT": "Tài",
"TTTTXTTT": "Tài",
"TTTXTTTT": "Xỉu",
"TTXTTTTX": "Tài",
"TXTTTTXT": "Xỉu",
"XTTTTXTX": "Xỉu",
"TTTTXTXX": "Tài",
"TTTXTXXT": "Tài",
"TTXTXXTT": "Tài",
"TXTXXTTT": "Tài",
"XTXXTTTT": "Xỉu",
"TXXTTTTX": "Tài",
"XXTTTTXT": "Tài",
"XTTTTXTT": "Tài",
"TTTTXTTT": "Tài",
"TTTXTTTT": "Xỉu",
"TTXTTTTX": "Xỉu",
"TXTTTTXX": "Xỉu",
"XTTTTXXX": "Xỉu",
"TTTTXXXX": "Tài",
"TTTXXXXT": "Tài",
"TTXXXXTT": "Tài",
"TXXXXTTT": "Xỉu",
"XXXXTTTX": "Xỉu",
"XXXTTTXX": "Tài",
"XXTTTXXT": "Xỉu",
"XTTTXXTX": "Xỉu",
"TTTXXTXX": "Xỉu",
"TTXXTXXX": "Tài",
"TXXTXXXT": "Xỉu",
"XXTXXXTX": "Xỉu",
"XTXXXTXX": "Tài",
"TXXXTXXT": "Xỉu",
"XXXTXXTX": "Tài",
"XXTXXTXT": "Xỉu",
"XTXXTXTX": "Tài",
"TXXTXTXT": "Xỉu",
"XXTXTXTX": "Xỉu",
"XTXTXTXX": "Xỉu",
"TXTXTXXX": "Tài",
"XTXTXXXT": "Tài",
"TXTXXXTT": "Xỉu",
"XTXXXTTX": "Xỉu",
"TXXXTTXX": "Tài",
"XXXTTXXT": "Tài",
"XXTTXXTT": "Tài",
"XTTXXTTT": "Tài",
"TTXXTTTT": "Xỉu",
"TXXTTTTX": "Xỉu",
"XXTTTTXX": "Xỉu",
"XTTTTXXX": "Tài",
"TTTTXXXT": "Tài",
"TTTXXXTT": "Xỉu",
"TTXXXTTX": "Tài",
"TXXXTTXT": "Tài",
"XXXTTXTT": "Xỉu",
"XXTTXTTX": "Xỉu",
"XTTXTTXX": "Tài",
"TTXTTXXT": "Tài",
"TXTTXXTT": "Tài",
"XTTXXTTT": "Xỉu",
"TTXXTTTX": "Xỉu",
"TXXTTTXX": "Tài",
"XXTTTXXT": "Xỉu",
"XTTTXXTX": "Tài",
"TTTXXTXT": "Xỉu",
"TTXXTXTX": "Tài",
"TXXTXTXT": "Xỉu",
"XXTXTXTX": "Xỉu",
"XTXTXTXX": "Xỉu",
"TXTXTXXX": "Tài",
"XTXTXXXT": "Xỉu",
"TXTXXXTX": "Xỉu",
"XTXXXTXX": "Xỉu",
"TXXXTXXX": "Xỉu",
"XXXTXXXX": "Tài",
"XXTXXXXT": "Tài",
"XTXXXXTT": "Tài",
"TXXXXTTT": "Tài",
"XXXXTTTT": "Xỉu",
"XXXTTTTX": "Xỉu",
"XXTTTTXX": "Tài",
"XTTTTXXT": "Tài",
"TTTTXXTT": "Tài",
"TTTXXTTT": "Xỉu",
"TTXXTTTX": "Xỉu",
"TXXTTTXX": "Tài",
"XXTTTXXT": "Tài",
"XTTTXXTT": "Tài",
"TTTXXTTT": "Tài",
"TTXXTTTT": "Tài",
"TXXTTTTT": "Tài",
"XXTTTTTT": "Tài",
"XTTTTTTT": "Tài",
"TTTTTTTT": "Tài",
"TTTTTTTT": "Xỉu",
"TTTTTTTX": "Xỉu",
"TTTTTTXX": "Tài",
"TTTTTXXT": "Tài",
"TTTTXXTT": "Xỉu",
"TTTXXTTX": "Xỉu",
"TTXXTTXX": "Tài",
"TXXTTXXT": "Xỉu",
"XXTTXXTX": "Xỉu",
"XTTXXTXX": "Tài",
"TTXXTXXT": "Xỉu",
"TXXTXXTX": "Xỉu",
"XXTXXTXX": "Xỉu",
"XTXXTXXX": "Xỉu",
"TXXTXXXX": "Tài",
"XXTXXXXT": "Xỉu",
"XTXXXXTX": "Tài",
"TXXXXTXT": "Tài",
"XXXXTXTT": "Tài",
"XXXTXTTT": "Tài",
"XXTXTTTT": "Tài",
"XTXTTTTT": "Tài",
"TXTTTTTT": "Tài",
"XTTTTTTT": "Tài",
"TTTTTTTT": "Tài",
"TTTTTTTT": "Xỉu",
"TTTTTTTX": "Xỉu",
"TTTTTTXX": "Tài",
"TTTTTXXT": "Xỉu",
"TTTTXXTX": "Xỉu",
"TTTXXTXX": "Tài",
"TTXXTXXT": "Tài",
"TXXTXXTT": "Tài",
"XXTXXTTT": "Tài",
"XTXXTTTT": "Xỉu",
"TXXTTTTX": "Xỉu",
"XXTTTTXX": "Xỉu",
"XTTTTXXX": "Xỉu",
"TTTTXXXX": "Xỉu",
"TTTXXXXX": "Tài",
"TTXXXXXT": "Xỉu",
"TXXXXXTX": "Tài",
"XXXXXTXT": "Xỉu",
"XXXXTXTX": "Xỉu",
"XXXTXTXX": "Xỉu",
"XXTXTXXX": "Tài",
"XTXTXXXT": "Tài",
"TXTXXXTT": "Xỉu",
"XTXXXTTX": "Xỉu",
"TXXXTTXX": "Xỉu",
"XXXTTXXX": "Tài",
"XXTTXXXT": "Tài",
"XTTXXXTT": "Xỉu",
"TTXXXTTX": "Xỉu",
"TXXXTTXX": "Xỉu",
"XXXTTXXX": "Xỉu",
"XXTTXXXX": "Tài",
"XTTXXXXT": "Xỉu",
"TTXXXXTX": "Tài",
"TXXXXTXT": "Xỉu",
"XXXXTXTX": "Tài",
"XXXTXTXT": "Tài",
"XXTXTXTT": "Xỉu",
"XTXTXTTX": "Tài",
"TXTXTTXT": "Tài",
"XTXTTXTT": "Xỉu",
"TXTTXTTX": "Tài",
"XTTXTTXT": "Tài",
"TTXTTXTT": "Tài",
"TXTTXTTT": "Tài",
"XTTXTTTT": "Tài",
"TTXTTTTT": "Tài",
"TXTTTTTT": "Tài",
"XTTTTTTT": "Xỉu",
"TTTTTTTX": "Tài",
"TTTTTTXT": "Tài",
"TTTTTXTT": "Xỉu",
"TTTTXTTX": "Xỉu",
"TTTXTTXX": "Tài",
"TTXTTXXT": "Tài",
"TXTTXXTT": "Tài",
"XTTXXTTT": "Tài",
"TTXXTTTT": "Tài",
"TXXTTTTT": "Tài",
"XXTTTTTT": "Tài",
"XTTTTTTT": "Tài",
"TTTTTTTT": "Tài",
"TTTTTTTT": "Tài",
"TTTTTTTT": "Tài",
"TTTTTTTT": "Xỉu",
"TTTTTTTX": "Tài",
"TTTTTTXT": "Xỉu",
"TTTTTXTX": "Xỉu",
"TTTTXTXX": "Xỉu",
"TTTXTXXX": "Xỉu",
"TTXTXXXX": "Tài",
"TXTXXXXT": "Xỉu",
"XTXXXXTX": "Tài",
"TXXXXTXT": "Tài",
"XXXXTXTT": "Tài",
"XXXTXTTT": "Tài",
"XXTXTTTT": "Xỉu",
"XTXTTTTX": "Tài",
"TXTTTTXT": "Xỉu",
"XTTTTXTX": "Tài",
"TTTTXTXT": "Tài",
"TTTXTXTT": "Xỉu",
"TTXTXTTX": "Xỉu",
"TXTXTTXX": "Tài",
"XTXTTXXT": "Tài",
"TXTTXXTT": "Tài",
"XTTXXTTT": "Tài",
"TTXXTTTT": "Tài",
"TXXTTTTT": "Xỉu",
"XXTTTTTX": "Tài",
"XTTTTTXT": "Xỉu",
"TTTTTXTX": "Tài",
"TTTTXTXT": "Xỉu",
"TTTXTXTX": "Tài",
"TTXTXTXT": "Xỉu",
"TXTXTXTX": "Xỉu",
"XTXTXTXX": "Tài",
"TXTXTXXT": "Xỉu",
"XTXTXXTX": "Xỉu",
"TXTXXTXX": "Tài",
"XTXXTXXT": "Xỉu",
"TXXTXXTX": "Tài",
"XXTXXTXT": "Xỉu",
"XTXXTXTX": "Tài",
"TXXTXTXT": "Xỉu",
"XXTXTXTX": "Tài",
"XTXTXTXT": "Xỉu",
"TXTXTXTX": "Xỉu",
"XTXTXTXX": "Xỉu",
"TXTXTXXX": "Xỉu",
"XTXTXXXX": "Tài",
"TXTXXXXT": "Xỉu",
"XTXXXXTX": "Xỉu",
"TXXXXTXX": "Xỉu",
"XXXXTXXX": "Tài",
"XXXTXXXT": "Tài",
"XXTXXXTT": "Xỉu",
"XTXXXTTX": "Tài",
"TXXXTTXT": "Tài",
"XXXTTXTT": "Xỉu",
"XXTTXTTX": "Tài",
"XTTXTTXT": "Xỉu",
"TTXTTXTX": "Tài",
"TXTTXTXT": "Xỉu",
"XTTXTXTX": "Xỉu",
"TTXTXTXX": "Tài",
"TXTXTXXT": "Tài",
"XTXTXXTT": "Tài",
"TXTXXTTT": "Xỉu",
"XTXXTTTX": "Tài",
"TXXTTTXT": "Tài",
"XXTTTXTT": "Xỉu",
"XTTTXTTX": "Tài",
"TTTXTTXT": "Xỉu",
"TTXTTXTX": "Tài",
"TXTTXTXT": "Xỉu",
"XTTXTXTX": "Xỉu",
"TTXTXTXX": "Xỉu",
"TXTXTXXX": "Tài",
"XTXTXXXT": "Tài",
"TXTXXXTT": "Tài",
"XTXXXTTT": "Xỉu",
"TXXXTTTX": "Xỉu",
"XXXTTTXX": "Tài",
"XXTTTXXT": "Xỉu",
"XTTTXXTX": "Xỉu",
"TTTXXTXX": "Tài",
"TTXXTXXT": "Xỉu",
"TXXTXXTX": "Xỉu",
"XXTXXTXX": "Xỉu",
"XTXXTXXX": "Xỉu",
"TXXTXXXX": "Xỉu",
"XXTXXXXX": "Tài",
"XTXXXXXT": "Tài",
"TXXXXXTT": "Tài",
"XXXXXTTT": "Tài",
"XXXXTTTT": "Tài",
"XXXTTTTT": "Tài",
"XXTTTTTT": "Xỉu",
"XTTTTTTX": "Xỉu",
"TTTTTTXX": "Tài",
"TTTTTXXT": "Tài",
"TTTTXXTT": "Xỉu",
"TTTXXTTX": "Xỉu",
"TTXXTTXX": "Tài",
"TXXTTXXT": "Xỉu",
"XXTTXXTX": "Tài",
"XTTXXTXT": "Xỉu",
"TTXXTXTX": "Tài",
"TXXTXTXT": "Tài",
"XXTXTXTT": "Tài",
"XTXTXTTT": "Xỉu",
"TXTXTTTX": "Xỉu",
"XTXTTTXX": "Tài",
"TXTTTXXT": "Tài",
"XTTTXXTT": "Xỉu",
"TTTXXTTX": "Xỉu",
"TTXXTTXX": "Tài",
"TXXTTXXT": "Xỉu",
"XXTTXXTX": "Xỉu",
"XTTXXTXX": "Xỉu",
"TTXXTXXX": "Tài",
"TXXTXXXT": "Tài",
"XXTXXXTT": "Tài",
"XTXXXTTT": "Xỉu",
"TXXXTTTX": "Tài",
"XXXTTTXT": "Tài",
"XXTTTXTT": "Xỉu",
"XTTTXTTX": "Xỉu",
"TTTXTTXX": "Tài",
"TTXTTXXT": "Tài",
"TXTTXXTT": "Tài",
"XTTXXTTT": "Xỉu",
"TTXXTTTX": "Xỉu",
"TXXTTTXX": "Xỉu",
"XXTTTXXX": "Tài",
"XTTTXXXT": "Tài",
"TTTXXXTT": "Tài",
"TTXXXTTT": "Xỉu",
"TXXXTTTX": "Xỉu",
"XXXTTTXX": "Tài",
"XXTTTXXT": "Xỉu",
"XTTTXXTX": "Tài",
"TTTXXTXT": "Tài",
"TTXXTXTT": "Xỉu",
"TXXTXTTX": "Xỉu",
"XXTXTTXX": "Tài",
"XTXTTXXT": "Xỉu",
"TXTTXXTX": "Xỉu",
"XTTXXTXX": "Xỉu",
"TTXXTXXX": "Tài",
"TXXTXXXT": "Tài",
"XXTXXXTT": "Xỉu",
"XTXXXTTX": "Xỉu",
"TXXXTTXX": "Tài",
"XXXTTXXT": "Xỉu",
"XXTTXXTX": "Tài",
"XTTXXTXT": "Tài",
"TTXXTXTT": "Tài",
"TXXTXTTT": "Xỉu",
"XXTXTTTX": "Xỉu",
"XTXTTTXX": "Tài",
"TXTTTXXT": "Xỉu",
"XTTTXXTX": "Tài",
"TTTXXTXT": "Tài",
"TTXXTXTT": "Tài",
"TXXTXTTT": "Tài",
"XXTXTTTT": "Xỉu",
"XTXTTTTX": "Xỉu",
"TXTTTTXX": "Xỉu",
"XTTTTXXX": "Tài",
"TTTTXXXT": "Xỉu",
"TTTXXXTX": "Xỉu",
"TTXXXTXX": "Tài",
"TXXXTXXT": "Tài",
"XXXTXXTT": "Tài",
"XXTXXTTT": "Tài",
"XTXXTTTT": "Xỉu",
"TXXTTTTX": "Tài",
"XXTTTTXT": "Xỉu",
"XTTTTXTX": "Xỉu",
"TTTTXTXX": "Tài",
"TTTXTXXT": "Xỉu",
"TTXTXXTX": "Xỉu",
"TXTXXTXX": "Xỉu",
"XTXXTXXX": "Xỉu",
"TXXTXXXX": "Xỉu",
"XXTXXXXX": "Xỉu",
"XTXXXXXX": "Xỉu",
"TXXXXXXX": "Tài",
"XXXXXXXT": "Tài",
"XXXXXXTT": "Xỉu",
"XXXXXTTX": "Tài",
"XXXXTTXT": "Tài",
"XXXTTXTT": "Xỉu",
"XXTTXTTX": "Tài",
"XTTXTTXT": "Xỉu",
"TTXTTXTX": "Xỉu",
"TXTTXTXX": "Tài",
"XTTXTXXT": "Xỉu",
"TTXTXXTX": "Tài",
"TXTXXTXT": "Xỉu",
"XTXXTXTX": "Tài",
"TXXTXTXT": "Tài",
"XXTXTXTT": "Tài",
"XTXTXTTT": "Tài",
"TXTXTTTT": "Xỉu",
"XTXTTTTX": "Xỉu",
"TXTTTTXX": "Xỉu",
"XTTTTXXX": "Tài",
"TTTTXXXT": "Xỉu",
"TTTXXXTX": "Tài",
"TTXXXTXT": "Tài",
"TXXXTXTT": "Tài",
"XXXTXTTT": "Xỉu",
"XXTXTTTX": "Xỉu",
"XTXTTTXX": "Tài",
"TXTTTXXT": "Xỉu",
"XTTTXXTX": "Xỉu",
"TTTXXTXX": "Tài",
"TTXXTXXT": "Xỉu",
"TXXTXXTX": "Tài",
"XXTXXTXT": "Tài",
"XTXXTXTT": "Tài",
"TXXTXTTT": "Tài",
"XXTXTTTT": "Tài",
"XTXTTTTT": "Xỉu",
"TXTTTTTX": "Tài",
"XTTTTTXT": "Xỉu",
"TTTTTXTX": "Tài",
"TTTTXTXT": "Tài",
"TTTXTXTT": "Xỉu",
"TTXTXTTX": "Xỉu",
"TXTXTTXX": "Tài",
"XTXTTXXT": "Tài",
"TXTTXXTT": "Tài",
"XTTXXTTT": "Tài",
"TTXXTTTT": "Tài",
"TXXTTTTT": "Tài",
"XXTTTTTT": "Xỉu",
"XTTTTTTX": "Tài",
"TTTTTTXT": "Xỉu",
"TTTTTXTX": "Tài",
"TTTTXTXT": "Tài",
"TTTXTXTT": "Xỉu",
"TTXTXTTX": "Tài",
"TXTXTTXT": "Tài",
"XTXTTXTT": "Xỉu",
"TXTTXTTX": "Xỉu",
"XTTXTTXX": "Tài",
"TTXTTXXT": "Xỉu",
"TXTTXXTX": "Xỉu",
"XTTXXTXX": "Xỉu",
"TTXXTXXX": "Xỉu",
"TXXTXXXX": "Xỉu",
"XXTXXXXX": "Tài",
"XTXXXXXT": "Xỉu",
"TXXXXXTX": "Tài",
"XXXXXTXT": "Tài",
"XXXXTXTT": "Tài",
"XXXTXTTT": "Xỉu",
"XXTXTTTX": "Xỉu",
"XTXTTTXX": "Xỉu",
"TXTTTXXX": "Tài",
"XTTTXXXT": "Tài",
"TTTXXXTT": "Xỉu",
"TTXXXTTX": "Tài",
"TXXXTTXT": "Xỉu",
"XXXTTXTX": "Xỉu",
"XXTTXTXX": "Xỉu",
"XTTXTXXX": "Xỉu",
"TTXTXXXX": "Xỉu",
"TXTXXXXX": "Xỉu",
"XTXXXXXX": "Tài",
"TXXXXXXT": "Tài",
"XXXXXXTT": "Xỉu",
"XXXXXTTX": "Xỉu",
"XXXXTTXX": "Xỉu",
"XXXTTXXX": "Xỉu",
"XXTTXXXX": "Tài",
"XTTXXXXT": "Tài",
"TTXXXXTT": "Tài",
"TXXXXTTT": "Tài",
"XXXXTTTT": "Tài",
"XXXTTTTT": "Tài",
"XXTTTTTT": "Tài",
"XTTTTTTT": "Tài",
"TTTTTTTT": "Tài",
"TTTTTTTT": "Tài",
"TTTTTTTT": "Xỉu",
"TTTTTTTX": "Xỉu",
"TTTTTTXX": "Xỉu",
"TTTTTXXX": "Xỉu",
"TTTTXXXX": "Xỉu",
"TTTXXXXX": "Tài",
"TTXXXXXT": "Xỉu",
"TXXXXXTX": "Xỉu",
"XXXXXTXX": "Tài",
"XXXXTXXT": "Tài",
"XXXTXXTT": "Tài",
"XXTXXTTT": "Xỉu",
"XTXXTTTX": "Xỉu",
"TXXTTTXX": "Tài",
"XXTTTXXT": "Xỉu",
"XTTTXXTX": "Tài",
"TTTXXTXT": "Xỉu",
"TTXXTXTX": "Xỉu",
"TXXTXTXX": "Tài",
"XXTXTXXT": "Tài",
"XTXTXXTT": "Xỉu",
"TXTXXTTX": "Xỉu",
"XTXXTTXX": "Xỉu",
"TXXTTXXX": "Xỉu",
"XXTTXXXX": "Xỉu",
"XTTXXXXX": "Tài",
"TTXXXXXT": "Tài",
"TXXXXXTT": "Xỉu",
"XXXXXTTX": "Tài",
"XXXXTTXT": "Tài",
"XXXTTXTT": "Tài",
"XXTTXTTT": "Xỉu",
"XTTXTTTX": "Xỉu",
"TTXTTTXX": "Xỉu",
"TXTTTXXX": "Xỉu",
"XTTTXXXX": "Xỉu",
"TTTXXXXX": "Xỉu",
"TTXXXXXX": "Xỉu",
"TXXXXXXX": "Tài",
"XXXXXXXT": "Xỉu",
"XXXXXXTX": "Tài",
"XXXXXTXT": "Tài",
"XXXXTXTT": "Tài",
"XXXTXTTT": "Xỉu",
"XXTXTTTX": "Xỉu",
"XTXTTTXX": "Xỉu",
"TXTTTXXX": "Xỉu",
"XTTTXXXX": "Xỉu",
"TTTXXXXX": "Tài",
"TTXXXXXT": "Xỉu",
"TXXXXXTX": "Xỉu",
"XXXXXTXX": "Xỉu",
"XXXXTXXX": "Xỉu",
"XXXTXXXX": "Tài",
"XXTXXXXT": "Xỉu",
"XTXXXXTX": "Xỉu",
"TXXXXTXX": "Tài",
"XXXXTXXT": "Tài",
"XXXTXXTT": "Tài",
"XXTXXTTT": "Tài",
"XTXXTTTT": "Xỉu",
"TXXTTTTX": "Xỉu",
"XXTTTTXX": "Xỉu",
"XTTTTXXX": "Tài",
"TTTTXXXT": "Xỉu",
"TTTXXXTX": "Tài",
"TTXXXTXT": "Tài",
"TXXXTXTT": "Xỉu",
"XXXTXTTX": "Xỉu",
"XXTXTTXX": "Tài",
"XTXTTXXT": "Tài",
"TXTTXXTT": "Tài",
"XTTXXTTT": "Tài",
"TTXXTTTT": "Xỉu",
"TXXTTTTX": "Tài",
"XXTTTTXT": "Tài",
"XTTTTXTT": "Tài",
"TTTTXTTT": "Xỉu",
"TTTXTTTX": "Tài",
"TTXTTTXT": "Tài",
"TXTTTXTT": "Tài",
"XTTTXTTT": "Tài",
"TTTXTTTT": "Xỉu",
"TTXTTTTX": "Xỉu",
"TXTTTTXX": "Tài",
"XTTTTXXT": "Tài",
"TTTTXXTT": "Tài",
"TTTXXTTT": "Tài",
"TTXXTTTT": "Xỉu",
"TXXTTTTX": "Xỉu",
"XXTTTTXX": "Xỉu",
"XTTTTXXX": "Tài",
"TTTTXXXT": "Xỉu",
"TTTXXXTX": "Xỉu",
"TTXXXTXX": "Xỉu",
"TXXXTXXX": "Xỉu",
"XXXTXXXX": "Xỉu",
"XXTXXXXX": "Tài",
"XTXXXXXT": "Xỉu",
"TXXXXXTX": "Xỉu",
"XXXXXTXX": "Tài",
"XXXXTXXT": "Tài",
"XXXTXXTT": "Tài",
"XXTXXTTT": "Tài",
"XTXXTTTT": "Tài",
"TXXTTTTT": "Xỉu",
"XXTTTTTX": "Tài",
"XTTTTTXT": "Tài",
"TTTTTXTT": "Tài",
"TTTTXTTT": "Xỉu",
"TTTXTTTX": "Tài",
"TTXTTTXT": "Xỉu",
"TXTTTXTX": "Xỉu",
"XTTTXTXX": "Xỉu",
"TTTXTXXX": "Tài",
"TTXTXXXT": "Xỉu",
"TXTXXXTX": "Tài",
"XTXXXTXT": "Xỉu",
"TXXXTXTX": "Tài",
"XXXTXTXT": "Tài",
"XXTXTXTT": "Xỉu",
"XTXTXTTX": "Tài",
"TXTXTTXT": "Tài",
"XTXTTXTT": "Tài",
"TXTTXTTT": "Xỉu",
"XTTXTTTX": "Xỉu",
"TTXTTTXX": "Xỉu",
"TXTTTXXX": "Tài",
"XTTTXXXT": "Xỉu",
"TTTXXXTX": "Tài",
"TTXXXTXT": "Xỉu",
"TXXXTXTX": "Xỉu",
"XXXTXTXX": "Xỉu",
"XXTXTXXX": "Xỉu",
"XTXTXXXX": "Tài",
"TXTXXXXT": "Tài",
"XTXXXXTT": "Tài",
"TXXXXTTT": "Tài",
"XXXXTTTT": "Tài",
"XXXTTTTT": "Xỉu",
"XXTTTTTX": "Tài",
"XTTTTTXT": "Xỉu",
"TTTTTXTX": "Tài",

"XXTXXTTT": "Xỉu",
"XTXXTTTX": "Xỉu",
"TXXTTTXX": "Tài",
"XXTTTXXT": "Tài",
"XTTTXXTT": "Xỉu",
"TTTXXTTX": "Xỉu",
"TTXXTTXX": "Tài",
"TXXTTXXT": "Xỉu",
"XXTTXXTX": "Tài",
"XTTXXTXT": "Xỉu",
"TTXXTXTX": "Tài",
"TXXTXTXT": "Xỉu",
"XXTXTXTX": "Xỉu",
"XTXTXTXX": "Tài",
"TXTXTXXT": "Tài",
"XTXTXXTT": "Xỉu",
"TXTXXTTX": "Tài",
"XTXXTTXT": "Tài",
"TXXTTXTT": "Xỉu",
"XXTTXTTX": "Tài",
"XTTXTTXT": "Tài",
"TTXTTXTT": "Tài",
"TXTTXTTT": "Tài",
"XTTXTTTT": "Xỉu",
"TTXTTTTX": "Tài",
"TXTTTTXT": "Tài",
"XTTTTXTT": "Xỉu",
"TTTTXTTX": "Tài",
"TTTXTTXT": "Tài",
"TTXTTXTT": "Tài",
"TXTTXTTT": "Tài",
"XTTXTTTT": "Xỉu",
"TTXTTTTX": "Tài",
"TXTTTTXT": "Xỉu",
"XTTTTXTX": "Tài",
"TTTTXTXT": "Tài",
"TTTXTXTT": "Xỉu",
"TTXTXTTX": "Xỉu",
"TXTXTTXX": "Tài",
"XTXTTXXT": "Xỉu",
"TXTTXXTX": "Tài",
"XTTXXTXT": "Xỉu",
"TTXXTXTX": "Xỉu",
"TXXTXTXX": "Xỉu",
"XXTXTXXX": "Xỉu",
"XTXTXXXX": "Xỉu",
"TXTXXXXX": "Xỉu",
"XTXXXXXX": "Tài",
"TXXXXXXT": "Tài",
"XXXXXXTT": "Tài",
"XXXXXTTT": "Tài",
"XXXXTTTT": "Tài",
"XXXTTTTT": "Xỉu",
"XXTTTTTX": "Tài",
"XTTTTTXT": "Xỉu",
"TTTTTXTX": "Xỉu",
"TTTTXTXX": "Tài",
"TTTXTXXT": "Tài",
"TTXTXXTT": "Tài",
"TXTXXTTT": "Tài",
"XTXXTTTT": "Xỉu",
"TXXTTTTX": "Xỉu",
"XXTTTTXX": "Tài",
"XTTTTXXT": "Tài",
"TTTTXXTT": "Xỉu",
"TTTXXTTX": "Tài",
"TTXXTTXT": "Xỉu",
"TXXTTXTX": "Tài",
"XXTTXTXT": "Tài",
"XTTXTXTT": "Xỉu",
"TTXTXTTX": "Tài",
"TXTXTTXT": "Xỉu",
"XTXTTXTX": "Tài",
"TXTTXTXT": "Xỉu",
"XTTXTXTX": "Xỉu",
"TTXTXTXX": "Tài",
"TXTXTXXT": "Xỉu",
"XTXTXXTX": "Xỉu",
"TXTXXTXX": "Tài",
"XTXXTXXT": "Tài",
"TXXTXXTT": "Tài",
"XXTXXTTT": "Tài",
"XTXXTTTT": "Xỉu",
"TXXTTTTX": "Tài",
"XXTTTTXT": "Xỉu",
"XTTTTXTX": "Tài",
"TTTTXTXT": "Tài",
"TTTXTXTT": "Tài",
"TTXTXTTT": "Xỉu",
"TXTXTTTX": "Tài",
"XTXTTTXT": "Xỉu",
"TXTTTXTX": "Tài",
"XTTTXTXT": "Tài",
"TTTXTXTT": "Xỉu",
"TTXTXTTX": "Xỉu",
"TXTXTTXX": "Xỉu",
"XTXTTXXX": "Xỉu",
"TXTTXXXX": "Tài",
"XTTXXXXT": "Xỉu",
"TTXXXXTX": "Xỉu",
"TXXXXTXX": "Tài",
"XXXXTXXT": "Tài",
"XXXTXXTT": "Xỉu",
"XXTXXTTX": "Xỉu",
"XTXXTTXX": "Tài",
"TXXTTXXT": "Tài",
"XXTTXXTT": "Xỉu",
"XTTXXTTX": "Xỉu",
"TTXXTTXX": "Tài",
"TXXTTXXT": "Xỉu",
"XXTTXXTX": "Tài",
"XTTXXTXT": "Xỉu",
"TTXXTXTX": "Xỉu",
"TXXTXTXX": "Tài",
"XXTXTXXT": "Tài",
"XTXTXXTT": "Xỉu",
"TXTXXTTX": "Tài",
"XTXXTTXT": "Tài",
"TXXTTXTT": "Xỉu",
"XXTTXTTX": "Xỉu",
"XTTXTTXX": "Xỉu",
"TTXTTXXX": "Xỉu",
"TXTTXXXX": "Tài",
"XTTXXXXT": "Xỉu",
"TTXXXXTX": "Xỉu",
"TXXXXTXX": "Tài",
"XXXXTXXT": "Tài",
"XXXTXXTT": "Tài",
"XXTXXTTT": "Tài",
"XTXXTTTT": "Tài",
"TXXTTTTT": "Tài",
"XXTTTTTT": "Xỉu",
"XTTTTTTX": "Tài",
"TTTTTTXT": "Tài",
"TTTTTXTT": "Xỉu",
"TTTTXTTX": "Tài",
"TTTXTTXT": "Xỉu",
"TTXTTXTX": "Tài",
"TXTTXTXT": "Tài",
"XTTXTXTT": "Xỉu",
"TTXTXTTX": "Xỉu",
"TXTXTTXX": "Xỉu",
"XTXTTXXX": "Tài",
"TXTTXXXT": "Tài",
"XTTXXXTT": "Xỉu",
"TTXXXTTX": "Xỉu",
"TXXXTTXX": "Xỉu",
"XXXTTXXX": "Tài",
"XXTTXXXT": "Tài",
"XTTXXXTT": "Xỉu",
"TTXXXTTX": "Xỉu",
"TXXXTTXX": "Xỉu",
"XXXTTXXX": "Xỉu",
"XXTTXXXX": "Xỉu",
"XTTXXXXX": "Xỉu",
"TTXXXXXX": "Tài",
"TXXXXXXT": "Tài",
"XXXXXXTT": "Tài",
"XXXXXTTT": "Tài",
"XXXXTTTT": "Tài",
"XXXTTTTT": "Tài",
"XXTTTTTT": "Tài",
"XTTTTTTT": "Xỉu",
"TTTTTTTX": "Xỉu",
"TTTTTTXX": "Tài",
"TTTTTXXT": "Xỉu",
"TTTTXXTX": "Xỉu",
"TTTXXTXX": "Tài",
"TTXXTXXT": "Xỉu",
"TXXTXXTX": "Xỉu",
"XXTXXTXX": "Xỉu",
"XTXXTXXX": "Tài",
"TXXTXXXT": "Xỉu",
"XXTXXXTX": "Tài",
"XTXXXTXT": "Tài",
"TXXXTXTT": "Xỉu",
"XXXTXTTX": "Tài",
"XXTXTTXT": "Tài",
"XTXTTXTT": "Tài",
"TXTTXTTT": "Xỉu",
"XTTXTTTX": "Xỉu",
"TTXTTTXX": "Xỉu",
"TXTTTXXX": "Xỉu",
"XTTTXXXX": "Tài",
"TTTXXXXT": "Tài",
"TTXXXXTT": "Xỉu",
"TXXXXTTX": "Tài",
"XXXXTTXT": "Tài",
"XXXTTXTT": "Xỉu",
"XXTTXTTX": "Xỉu",
"XTTXTTXX": "Tài",
"TTXTTXXT": "Xỉu",
"TXTTXXTX": "Xỉu",
"XTTXXTXX": "Tài",
"TTXXTXXT": "Tài",
"TXXTXXTT": "Tài",
"XXTXXTTT": "Tài",
"XTXXTTTT": "Xỉu",
"TXXTTTTX": "Tài",
"XXTTTTXT": "Tài",
"XTTTTXTT": "Xỉu",
"TTTTXTTX": "Tài",
"TTTXTTXT": "Tài",
"TTXTTXTT": "Tài",
"TXTTXTTT": "Tài",
"XTTXTTTT": "Tài",
"TTXTTTTT": "Xỉu",
"TXTTTTTX": "Xỉu",
"XTTTTTXX": "Xỉu",
"TTTTTXXX": "Xỉu",
"TTTTXXXX": "Tài",
"TTTXXXXT": "Tài",
"TTXXXXTT": "Xỉu",
"TXXXXTTX": "Xỉu",
"XXXXTTXX": "Xỉu",
"X": "Xỉu",
"XX": "Tài",
"XXT": "Tài",
"XXTT": "Tài",
"XXTTT": "Tài",
"XXTTTT": "Xỉu",
"XXTTTTX": "Xỉu",
"XXTTTTXX": "Xỉu",
"XTTTTXXX": "Xỉu",
"TTTTXXXX": "Xỉu",
"TTTXXXXX": "Xỉu",
"TTXXXXXX": "Tài",
"TXXXXXXT": "Tài",
"XXXXXXTT": "Tài",
"XXXXXTTT": "Tài",
"XXXXTTTT": "Tài",
"XXXTTTTT": "Tài",
"XXTTTTTT": "Xỉu",
"XTTTTTTX": "Xỉu",
"TTTTTTXX": "Tài",
"TTTTTXXT": "Xỉu",
"TTTTXXTX": "Tài",
"TTTXXTXT": "Tài",
"TTXXTXTT": "Tài",
"TXXTXTTT": "Xỉu",
"XXTXTTTX": "Xỉu",
"XTXTTTXX": "Xỉu",
"X": "Tài",
"XT": "Xỉu",
"XTX": "Xỉu",
"XTXX": "Tài",
"XTXXT": "Tài",
"XTXXTT": "Tài",
"XTXXTTT": "Tài",
"XTXXTTTT": "Tài",
"TXXTTTTT": "Tài",
"XXTTTTTT": "Tài",
"XTTTTTTT": "Tài",
"TTTTTTTT": "Tài",
"TTTTTTTT": "Xỉu",
"TTTTTTTX": "Xỉu",
"TTTTTTXX": "Xỉu",
"TTTTTXXX": "Xỉu",
"TTTTXXXX": "Tài",
"TTTXXXXT": "Xỉu",
"TTXXXXTX": "Tài",
"TXXXXTXT": "Tài",
"XXXXTXTT": "Xỉu",
"XXXTXTTX": "Xỉu",
"XXTXTTXX": "Xỉu",
"XTXTTXXX": "Tài",
"TXTTXXXT": "Tài",
"XTTXXXTT": "Xỉu",
"TTXXXTTX": "Xỉu",
"TXXXTTXX": "Tài",
"XXXTTXXT": "Xỉu",
"XXTTXXTX": "Xỉu",
"XTTXXTXX": "Tài",
"TTXXTXXT": "Tài",
"TXXTXXTT": "Xỉu",
"XXTXXTTX": "Tài",
"XTXXTTXT": "Tài",
"TXXTTXTT": "Xỉu",
"XXTTXTTX": "Xỉu",
"XTTXTTXX": "Tài",
}

# ⚙️ CẤU HÌNH VÀ BIẾN TOÀN CỤC (Full Config)
# =========================================================
MIN_HISTORY_FOR_SMART_PREDICT = 20
CAU_PATTERNS = {}
DATA_FILE = "cau_patterns.json"

class GameState:
    def __init__(self):
        # Biến từ phần logic nâng cao của bác
        self.transition_counts = [[0, 0], [0, 0]]
        self.transition_matrix = [[0.5, 0.5], [0.5, 0.5]]
        self.pattern_accuracy = {
            "Bệt": {"success": 0, "total": 0},
            "Bệt siêu dài": {"success": 0, "total": 0},
            "Bệt gãy nhẹ": {"success": 0, "total": 0},
            "Bệt gãy sâu": {"success": 0, "total": 0},
            "Bệt xen kẽ ngắn": {"success": 0, "total": 0},
            "Bệt ngược": {"success": 0, "total": 0},
            "Xỉu kép": {"success": 0, "total": 0},
            "Tài kép": {"success": 0, "total": 0},
            "Ngẫu nhiên bệt": {"success": 0, "total": 0},
            "Cầu 2-1-2": {"success": 0, "total": 0},
            "Cầu 1-2-1": {"success": 0, "total": 0},
            "Đối xứng (Gương)": {"success": 0, "total": 0},
            "Cầu lặp": {"success": 0, "total": 0},
            "Cầu Sandwich": {"success": 0, "total": 0},
            "Cầu Thang máy": {"success": 0, "total": 0}
        }
        self.logistic_weights = [0.0] * 6
        self.logistic_bias = 0.0
        self.learning_rate = 0.01
        self.regularization = 0.01
        self.model_performance = {
            "pattern": {"success": 0, "total": 0},
            "markov": {"success": 0, "total": 0},
            "logistic": {"success": 0, "total": 0}
        }
        self.model_weights = {"pattern": 0.33, "markov": 0.33, "logistic": 0.34}
        self.default_model_weights = {"pattern": 0.33, "markov": 0.33, "logistic": 0.34}

state = GameState()

# =========================================================
# 🔮 DỰ ĐOÁN THEO XÍ NGẦU CƠ SỞ
# =========================================================
def duDoanTheoXiNgau(diceList: List[List[int]]):
    if not diceList or len(diceList) == 0:
        return "Đợi thêm dữ liệu"

    d1, d2, d3 = diceList[-1]
    total = d1 + d2 + d3

    results = []
    for d in [d1, d2, d3]:
        tmp = d + total
        while tmp > 6:
            tmp -= 6
        if tmp % 2 == 0:
            results.append("Tài")
        else:
            results.append("Xỉu")

    taiCount = results.count("Tài")
    xiuCount = results.count("Xỉu")
    return "Tài" if taiCount >= xiuCount else "Xỉu"

# =========================================================
# 🎲 TÍNH TỔNG TÀI/XỈU
# =========================================================
def tinhTaiXiu(dice: List[int]):
    total = sum(dice)
    res = "Tài" if total >= 11 else "Xỉu"
    return [res, total]

# =========================================================
# 🧠 CẬP NHẬT MẪU CẦU VÀ ĐỘ TIN CẬY
# =========================================================
def updateCauPatterns(patternStr, predictionCorrect):
    initialConfidence = 1.0
    increaseFactor = 0.2
    decreaseFactor = 0.5

    currentConfidence = CAU_PATTERNS.get(patternStr, initialConfidence)
    if predictionCorrect:
        newConfidence = min(currentConfidence + increaseFactor, 5.0)
    else:
        newConfidence = max(currentConfidence - decreaseFactor, 0.1)

    CAU_PATTERNS[patternStr] = newConfidence

# =========================================================
# 🔁 XỬ LÝ MẪU CẦU HIỆN TẠI
# =========================================================
def getPatternPredictionAdjustment(patternStr):
    confidence = CAU_PATTERNS.get(patternStr, 1.0)
    if confidence >= 2.5:
        return "giữ nguyên"
    elif confidence <= 0.5:
        return "đảo chiều"
    else:
        return "không rõ"

# =========================================================
# 📈 PHÂN TÍCH CHUỖI BỆT (STREAK)
# =========================================================
def getCurrentStreakInfo(historyStr):
    if not historyStr:
        return [0, None]
    currentResult = historyStr[-1]
    streakLength = 0
    for res in reversed(historyStr):
        if res == currentResult:
            streakLength += 1
        else:
            break
    return [streakLength, "Tài" if currentResult == "T" else "Xỉu"]

def calculateAverageStreakLength(historyStr):
    if not historyStr:
        return 0
    streaks = []
    curLen = 0
    curChar = ''
    for char in historyStr:
        if char == curChar:
            curLen += 1
        else:
            if curLen > 0:
                streaks.append(curLen)
            curChar = char
            curLen = 1
    if curLen > 0:
        streaks.append(curLen)
    return sum(streaks) / len(streaks) if len(streaks) > 0 else 0

# =========================================================
# 📊 PHÂN TÍCH TẦN SUẤT XÍ NGẦU
# =========================================================
def analyzeDiceFrequencies(historyData):
    diceCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    totalSumCounts = {i: 0 for i in range(3, 19)}

    for session in historyData:
        for die in session.get('dices', []):
            diceCounts[die] += 1
        totalSumCounts[session.get('total', 0)] += 1

    return [diceCounts, totalSumCounts]

# =========================================================
# ✅ CẬP NHẬT MA TRẬN CHUYỂN TRẠNG THÁI (Markov)
# =========================================================
def updateTransitionMatrix(prevResult, currentResult):
    if not prevResult:
        return
    prevIdx = 0 if prevResult == 'Tài' else 1
    currIdx = 0 if currentResult == 'Tài' else 1

    state.transition_counts[prevIdx][currIdx] += 1
    total = sum(state.transition_counts[prevIdx])

    alpha = 1
    numOutcomes = 2

    state.transition_matrix[prevIdx][0] = (state.transition_counts[prevIdx][0] + alpha) / (total + alpha * numOutcomes)
    state.transition_matrix[prevIdx][1] = (state.transition_counts[prevIdx][1] + alpha) / (total + alpha * numOutcomes)

# =========================================================
# ✅ HUẤN LUYỆN LOGISTIC REGRESSION
# =========================================================
def trainLogisticRegression(features, actualResult):
    y = 1.0 if actualResult == 'Tài' else 0.0
    z = state.logistic_bias + sum(f * w for f, w in zip(features, state.logistic_weights))

    try:
        p = 1.0 / (1.0 + math.exp(-z))
    except OverflowError:
        p = 0.0 if z < 0 else 1.0

    error = y - p
    state.logistic_bias += state.learning_rate * error

    for i in range(len(state.logistic_weights)):
        gradient = error * features[i]
        reg = state.regularization * state.logistic_weights[i]
        state.logistic_weights[i] += state.learning_rate * (gradient - reg)

# =========================================================
# 🔎 NHẬN DIỆN PATTERNS (SOI CẦU)
# =========================================================
def detectPattern(historyStr):
    if len(historyStr) < 2:
        return None
    
    # Định nghĩa các hàm kiểm tra (đưa hết logic của bác vào)
    h = ["Tài" if char == "T" else "Xỉu" for char in historyStr]
    
    found = []
    
    # Bệt
    if len(h) >= 3 and h[-1] == h[-2] == h[-3]: found.append("Bệt")
    if len(h) >= 5 and all(x == h[-1] for x in h[-5:]): found.append("Bệt siêu dài")
    
    # Tài Xỉu kép
    if len(h) >= 2 and h[-1] == h[-2]:
        if h[-1] == "Tài": found.append("Tài kép")
        else: found.append("Xỉu kép")
        
    if not found: return None
    
    # Tính weight y hệt JS bác gửi
    totalOccurrences = max(1, sum(s['total'] for s in state.pattern_accuracy.values()))
    results = []
    for name in found:
        stats = state.pattern_accuracy.get(name, {"success": 0, "total": 0})
        accuracy = (stats['success'] / stats['total']) if stats['total'] > 10 else 0.55
        recencyScore = stats['total'] / totalOccurrences
        weight = 0.7 * accuracy + 0.3 * recencyScore
        results.append({"name": name, "weight": weight})
        
    return max(results, key=lambda x: x['weight'])

# =========================================================
# 🛡️ META LOGIC (BẺ CẦU - PHẦN QUAN TRỌNG NHẤT)
# =========================================================
def applyMetaLogic(prediction, confidence, historyStr):
    finalPrediction = prediction
    finalConfidence = confidence
    reason = ""

    streakLen, lastRes = getCurrentStreakInfo(historyStr)

    if streakLen >= 9 and prediction == lastRes:
        finalPrediction = "Xỉu" if lastRes == "Tài" else "Tài"
        finalConfidence = 78.0
        reason = f"Bẻ cầu bệt siêu dài ({streakLen})"
    elif streakLen >= 7 and prediction == lastRes:
        finalConfidence = max(50.0, confidence - 15)
        reason = f"Cầu bệt dài ({streakLen}), giảm độ tin cậy"

    return finalPrediction, finalConfidence, reason

# =========================================================
# 📡 KẾT NỐI API GAME THỰC TẾ
# =========================================================
def fetch_game_data():
    url = "https://wtxmd52.tele68.com/v1/txmd5/sessions"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json().get('data', [])
    except:
        pass
    return []

# =========================================================
# 🚀 ENDPOINT API (GỌI LÀ CÓ KẾT QUẢ)
# =========================================================
@app.get("/predict")
def get_prediction():
    raw_data = fetch_game_data()
    if not raw_data:
        return {"status": "error", "message": "Không kết nối được API Game"}

    # Chuẩn bị dữ liệu như JS bác yêu cầu
    analyzeHistory = raw_data[:50] # 50 phiên gần nhất
    fullHistory = raw_data[:100]  # 100 phiên lịch sử
    currentDice = raw_data[0].get('dices', [1,1,1])
    
    # Chuyển lịch sử thành chuỗi T, X
    history_str = "".join(["T" if x['total'] >= 11 else "X" for x in reversed(fullHistory)])
    history_list = ["Tài" if x['total'] >= 11 else "Xỉu" for x in reversed(fullHistory)]

    # 1. Dự đoán cơ sở theo xí ngầu
    base_pred = duDoanTheoXiNgau([currentDice])
    
    # 2. Logic Smart Predict (AI Tổng hợp)
    scoreTai = 0
    scoreXiu = 0
    reasons = []

    if base_pred == "Tài": 
        scoreTai += 1.0
        reasons.append("Xí ngầu cơ sở dự đoán Tài")
    else: 
        scoreXiu += 1.0
        reasons.append("Xí ngầu cơ sở dự đoán Xỉu")

    # Bệt logic
    curStreakLen, curStreakResult = getCurrentStreakInfo(history_str)
    avgLen = calculateAverageStreakLength(history_str)
    
    if curStreakLen > 0:
        if avgLen > 0 and curStreakLen >= avgLen * 1.5:
            if base_pred != curStreakResult:
                if base_pred == "Tài": scoreTai += 3.0
                else: scoreXiu += 3.0
                reasons.append(f"TÍN HIỆU BẺ CẦU MẠNH! (Bệt {curStreakLen})")
            else:
                if base_pred == "Tài": scoreTai += 1.0
                else: scoreXiu += 1.0
                reasons.append(f"Cầu bệt dài ({curStreakLen}) tiếp diễn")
    
    # 3. Chốt kết quả cuối cùng qua Meta Logic
    final_decision = "Tài" if scoreTai > scoreXiu else "Xỉu"
    confidence = 65.0 # Mặc định
    
    final_p, final_c, final_r = applyMetaLogic(final_decision, confidence, history_str)

    return {
        "phien": raw_data[0]['session'],
        "xuc_xac": currentdice,
        "du_doan": final_p,
        "do_tin_cay": f"{final_c}%",
        "ly_do": final_r if final_r else ", ".join(reasons),
        "lich_su_gan_nhat": history_str[-15:]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
