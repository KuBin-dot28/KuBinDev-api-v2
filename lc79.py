# server.py
import asyncio
import websockets
import json
import threading
import time
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import signal
import sys
import os

# ==================== CẤU HÌNH ====================
PORT = 3637
HOST = '0.0.0.0'

# ==================== TOKEN DUY NHẤT CHO TẤT CẢ GAME ====================
TOKEN = "f12 lc79b.bet lấy token"

# ==================== URLS ====================
WS_URLS = {
    'txmd5': 'wss://wtxmd52.tele68.com/txmd5/?EIO=4&transport=websocket',
    'tx': 'wss://wtx.tele68.com/tx/?EIO=4&transport=websocket',
    'xocdia': 'wss://wcl.tele68.com/chanlefull/?EIO=4&transport=websocket'
}

# ==================== HÀM CHUYỂN ĐỔI ====================
def vietnamese_state(state):
    """Chuyển đổi trạng thái sang tiếng Việt"""
    state_map = {
        'BETTING': 'Đang cược',
        'REFUNDING': 'Chờ kết quả',
        'SHOW_RESULT': 'Kết quả',
        'AWARDING': 'Kết thúc phiên'
    }
    return state_map.get(state, state)

def translate_dice(dice):
    """Chuyển đổi xúc xắc xóc đĩa"""
    dice_map = {
        'do': 'Đỏ',
        'trang': 'Trắng'
    }
    return dice_map.get(dice, dice)

def translate_bet_type(bet_type):
    """Chuyển đổi loại cược xóc đĩa"""
    type_map = {
        'le': 'Lẻ',
        'chan': 'Chẵn',
        'three_do': '3 Đỏ',
        'three_trang': '3 Trắng',
        'four_do': '4 Đỏ',
        'four_trang': '4 Trắng'
    }
    return type_map.get(bet_type, bet_type)

def translate_result_detail(result):
    """Chuyển đổi kết quả chi tiết xóc đĩa"""
    result_map = {
        'le': 'Lẻ',
        'chan': 'Chẵn',
        'three_do': '3 Đỏ',
        'three_trang': '3 Trắng',
        'four_do': '4 Đỏ',
        'four_trang': '4 Trắng'
    }
    return result_map.get(result, result)

def get_vietnam_time():
    """Lấy thời gian Việt Nam (UTC+7)"""
    utc7_time = datetime.utcnow() + timedelta(hours=7)
    return utc7_time.strftime("%Y-%m-%d %H:%M:%S")

def format_currency(amount):
    """Định dạng tiền tệ"""
    if amount is None:
        return None
    try:
        return f"{amount:,.0f}".replace(",", ".")
    except:
        return str(amount)

# ==================== BIẾN LƯU KẾT QUẢ ====================
latest_results = {
    'txmd5': {
        'phien': None,
        'ket_qua': None,
        'xuc_xac_1': None,
        'xuc_xac_2': None,
        'xuc_xac_3': None,
        'tong': None,
        'md5_raw': None,
        'update_at': None
    },
    'tx': {
        'phien': None,
        'ket_qua': None,
        'xuc_xac_1': None,
        'xuc_xac_2': None,
        'xuc_xac_3': None,
        'tong': None,
        'update_at': None
    },
    'xocdia': {
        'phien': None,
        'xuc_xac': [],
        'ket_qua_truyen_thong': None,
        'ket_qua_chi_tiet': None,
        'jackpot_result': [],
        'md5_raw': None,
        'update_at': None
    }
}

latest_tick_updates = {
    'txmd5': {
        'id': None,
        'tick': None,
        'sub_tick': None,
        'state': None,
        'total_unique_users': None,
        'total_amount': None,
        'total_users_per_type': {'TAI': None, 'XIU': None},
        'total_amount_per_type': {'TAI': None, 'XIU': None},
        'timestamp': None,
        'update_at': None
    },
    'tx': {
        'id': None,
        'tick': None,
        'sub_tick': None,
        'state': None,
        'total_unique_users': None,
        'total_amount': None,
        'total_users_per_type': {'TAI': None, 'XIU': None},
        'total_amount_per_type': {'TAI': None, 'XIU': None},
        'jackpot': None,
        'settled_balance': None,
        'timestamp': None,
        'update_at': None
    },
    'xocdia': {
        'id': None,
        'tick': None,
        'sub_tick': None,
        'state': None,
        'total_unique_users': None,
        'total_amount': None,
        'total_users_per_type': {
            'le': None, 'chan': None, 'three_do': None, 
            'three_trang': None, 'four_do': None, 'four_trang': None
        },
        'total_amount_per_type': {
            'le': None, 'chan': None, 'three_do': None, 
            'three_trang': None, 'four_do': None, 'four_trang': None
        },
        'jackpot': None,
        'md5': None,
        'timestamp': None,
        'update_at': None
    }
}

# Lock cho thread safety
result_locks = {
    'txmd5': threading.Lock(),
    'tx': threading.Lock(),
    'xocdia': threading.Lock()
}

# ==================== WEBSOCKET HANDLER ====================
class WebSocketClient:
    def __init__(self, game):
        self.game = game
        self.ws = None
        self.running = True
        
    async def connect(self):
        """Kết nối WebSocket"""
        while self.running:
            try:
                print(f"🔄 Đang kết nối {self.game.upper()}...")
                self.ws = await websockets.connect(
                    WS_URLS[self.game],
                    ping_interval=20,
                    ping_timeout=20
                )
                
                print(f"✅ Đã kết nối {self.game.upper()}")
                
                # Gửi token xác thực
                namespace = 'chanlefull' if self.game == 'xocdia' else self.game
                auth_message = f"40/{namespace},{{\"token\":\"{TOKEN}\"}}"
                await self.ws.send(auth_message)
                print(f"📤 Đã gửi token xác thực cho {self.game} (Số dư: 100)")
                
                # Xử lý messages
                async for message in self.ws:
                    await self.handle_message(message)
                    
            except websockets.exceptions.ConnectionClosed:
                print(f"🔴 Mất kết nối {self.game.upper()}")
            except Exception as e:
                print(f"❌ Lỗi {self.game.upper()}: {e}")
            
            if self.running:
                print(f"🔄 Thử kết nối lại {self.game.upper()} sau 3 giây...")
                await asyncio.sleep(3)
    
    async def handle_message(self, message):
        """Xử lý message từ WebSocket"""
        print(f"📥 {self.game.upper()} nhận: {message}")
        
        # Xử lý ping-pong
        if message == '2':
            await self.ws.send('3')
            print(f"📤 {self.game.upper()} gửi pong")
            return
        
        # Xử lý SID
        if '40/' in message and '"sid":"' in message:
            try:
                import re
                sid_match = re.search(r'"sid":"([^"]+)"', message)
                if sid_match:
                    print(f"🆔 {self.game.upper()} đã nhận SID: {sid_match.group(1)}")
            except Exception as e:
                print(f"❌ Lỗi parse SID {self.game}: {e}")
        
        # Xử lý session-result
        if 'session-result' in message:
            try:
                json_str = message[message.index('['):]
                parsed = json.loads(json_str)
                
                if parsed[0] == 'session-result':
                    result = parsed[1]
                    
                    if self.game == 'xocdia':
                        # Xử lý xóc đĩa
                        with result_locks['xocdia']:
                            latest_results['xocdia'] = {
                                'phien': latest_tick_updates['xocdia']['id'] if latest_tick_updates['xocdia']['id'] else 'Chưa có dữ liệu',
                                'xuc_xac': result.get('dices', []),
                                'ket_qua_truyen_thong': result.get('resultTruyenThong'),
                                'ket_qua_chi_tiet': result.get('resultVi'),
                                'jackpot_result': result.get('jackpotResult', []),
                                'md5_raw': result.get('md5Raw'),
                                'update_at': get_vietnam_time()
                            }
                        
                        print("\n🎲 === KẾT QUẢ PHIÊN MỚI (XÓC ĐĨA) ===")
                        print(f"Phiên: {latest_results['xocdia']['phien']}")
                        print(f"Xúc xắc: {', '.join([translate_dice(d) for d in latest_results['xocdia']['xuc_xac']])}")
                        print(f"Kết quả truyền thống: {'Lẻ' if latest_results['xocdia']['ket_qua_truyen_thong'] == 'le' else 'Chẵn'}")
                        print(f"Kết quả chi tiết: {translate_result_detail(latest_results['xocdia']['ket_qua_chi_tiet'])}")
                        print("="*50 + "\n")
                    
                    else:
                        # Xử lý TX và TXMD5
                        dices = result.get('dices', [])
                        tong = sum(dices) if dices else 0
                        
                        with result_locks[self.game]:
                            if self.game == 'txmd5':
                                # Lấy phiên từ md5_raw
                                phien = None
                                if result.get('md5Raw'):
                                    md5_match = re.search(r'^(\d+):', result['md5Raw'])
                                    if md5_match:
                                        phien = md5_match.group(1)
                                
                                latest_results['txmd5'] = {
                                    'phien': phien,
                                    'ket_qua': 'Tài' if result.get('resultTruyenThong') == 'TAI' else 'Xỉu',
                                    'xuc_xac_1': dices[0] if len(dices) > 0 else None,
                                    'xuc_xac_2': dices[1] if len(dices) > 1 else None,
                                    'xuc_xac_3': dices[2] if len(dices) > 2 else None,
                                    'tong': tong,
                                    'md5_raw': result.get('md5Raw'),
                                    'update_at': get_vietnam_time()
                                }
                            else:
                                latest_results['tx'] = {
                                    'phien': latest_tick_updates['tx']['id'] if latest_tick_updates['tx']['id'] else 'Chưa có dữ liệu',
                                    'ket_qua': 'Tài' if result.get('resultTruyenThong') == 'TAI' else 'Xỉu',
                                    'xuc_xac_1': dices[0] if len(dices) > 0 else None,
                                    'xuc_xac_2': dices[1] if len(dices) > 1 else None,
                                    'xuc_xac_3': dices[2] if len(dices) > 2 else None,
                                    'tong': tong,
                                    'update_at': get_vietnam_time()
                                }
                        
                        print(f"\n🎲 === KẾT QUẢ PHIÊN MỚI ({self.game.upper()}) ===")
                        print(f"Phiên: {latest_results[self.game]['phien']}")
                        print(f"Xúc xắc: {dices[0] if len(dices) > 0 else '?'}, {dices[1] if len(dices) > 1 else '?'}, {dices[2] if len(dices) > 2 else '?'}")
                        print(f"Tổng: {tong}")
                        print(f"Kết quả: {'Tài' if result.get('resultTruyenThong') == 'TAI' else 'Xỉu'}")
                        print("="*50 + "\n")
                        
            except Exception as e:
                print(f"❌ Lỗi parse session-result {self.game}: {e}")
        
        # Xử lý tick-update
        if 'tick-update' in message:
            try:
                json_str = message[message.index('['):]
                parsed = json.loads(json_str)
                
                if parsed[0] == 'tick-update':
                    tick_data = parsed[1]
                    
                    with result_locks[self.game]:
                        if self.game == 'xocdia':
                            latest_tick_updates['xocdia'] = {
                                'id': tick_data.get('id'),
                                'tick': tick_data.get('tick'),
                                'sub_tick': tick_data.get('subTick'),
                                'state': tick_data.get('state'),
                                'total_unique_users': tick_data.get('data', {}).get('totalUniqueUsers'),
                                'total_amount': tick_data.get('data', {}).get('totalAmount'),
                                'total_users_per_type': {
                                    'le': tick_data.get('data', {}).get('totalUsersPerType', {}).get('le'),
                                    'chan': tick_data.get('data', {}).get('totalUsersPerType', {}).get('chan'),
                                    'three_do': tick_data.get('data', {}).get('totalUsersPerType', {}).get('three_do'),
                                    'three_trang': tick_data.get('data', {}).get('totalUsersPerType', {}).get('three_trang'),
                                    'four_do': tick_data.get('data', {}).get('totalUsersPerType', {}).get('four_do'),
                                    'four_trang': tick_data.get('data', {}).get('totalUsersPerType', {}).get('four_trang')
                                },
                                'total_amount_per_type': {
                                    'le': tick_data.get('data', {}).get('totalAmountPerType', {}).get('le'),
                                    'chan': tick_data.get('data', {}).get('totalAmountPerType', {}).get('chan'),
                                    'three_do': tick_data.get('data', {}).get('totalAmountPerType', {}).get('three_do'),
                                    'three_trang': tick_data.get('data', {}).get('totalAmountPerType', {}).get('three_trang'),
                                    'four_do': tick_data.get('data', {}).get('totalAmountPerType', {}).get('four_do'),
                                    'four_trang': tick_data.get('data', {}).get('totalAmountPerType', {}).get('four_trang')
                                },
                                'jackpot': tick_data.get('jackpot'),
                                'md5': tick_data.get('md5'),
                                'timestamp': tick_data.get('timestamp'),
                                'update_at': get_vietnam_time()
                            }
                        elif self.game == 'tx':
                            latest_tick_updates['tx'] = {
                                'id': tick_data.get('id'),
                                'tick': tick_data.get('tick'),
                                'sub_tick': tick_data.get('subTick'),
                                'state': tick_data.get('state'),
                                'total_unique_users': tick_data.get('data', {}).get('totalUniqueUsers'),
                                'total_amount': tick_data.get('data', {}).get('totalAmount'),
                                'total_users_per_type': {
                                    'TAI': tick_data.get('data', {}).get('totalUsersPerType', {}).get('TAI'),
                                    'XIU': tick_data.get('data', {}).get('totalUsersPerType', {}).get('XIU')
                                },
                                'total_amount_per_type': {
                                    'TAI': tick_data.get('data', {}).get('totalAmountPerType', {}).get('TAI'),
                                    'XIU': tick_data.get('data', {}).get('totalAmountPerType', {}).get('XIU')
                                },
                                'jackpot': tick_data.get('jackpot'),
                                'settled_balance': tick_data.get('settledBalance'),
                                'timestamp': tick_data.get('timestamp'),
                                'update_at': get_vietnam_time()
                            }
                        elif self.game == 'txmd5':
                            latest_tick_updates['txmd5'] = {
                                'id': tick_data.get('id'),
                                'tick': tick_data.get('tick'),
                                'sub_tick': tick_data.get('subTick'),
                                'state': tick_data.get('state'),
                                'total_unique_users': tick_data.get('data', {}).get('totalUniqueUsers'),
                                'total_amount': tick_data.get('data', {}).get('totalAmount'),
                                'total_users_per_type': {
                                    'TAI': tick_data.get('data', {}).get('totalUsersPerType', {}).get('TAI'),
                                    'XIU': tick_data.get('data', {}).get('totalUsersPerType', {}).get('XIU')
                                },
                                'total_amount_per_type': {
                                    'TAI': tick_data.get('data', {}).get('totalAmountPerType', {}).get('TAI'),
                                    'XIU': tick_data.get('data', {}).get('totalAmountPerType', {}).get('XIU')
                                },
                                'timestamp': tick_data.get('timestamp'),
                                'update_at': get_vietnam_time()
                            }
                    
                    print(f"\n📊 === CẬP NHẬT CƯỢC ({self.game.upper()}) ===")
                    print(f"Phiên cược: {latest_tick_updates[self.game]['id']}")
                    print(f"Tick: {latest_tick_updates[self.game]['tick']} | Đếm ngược: {latest_tick_updates[self.game]['sub_tick']}")
                    print(f"Trạng thái: {vietnamese_state(latest_tick_updates[self.game]['state'])}")
                    print(f"Tổng người cược: {latest_tick_updates[self.game]['total_unique_users']}")
                    print(f"Tổng tiền cược: {format_currency(latest_tick_updates[self.game]['total_amount'])}")
                    print("="*50 + "\n")
                    
            except Exception as e:
                print(f"❌ Lỗi parse tick-update {self.game}: {e}")
    
    def stop(self):
        """Dừng kết nối"""
        self.running = False

# ==================== FLASK APP ====================
app = Flask(__name__)
CORS(app)

@app.route('/api/txmd5', methods=['GET'])
def get_txmd5():
    """API lấy kết quả TXMD5"""
    with result_locks['txmd5']:
        tick = latest_tick_updates['txmd5']
        result = latest_results['txmd5']
        
        response = {
            'phien': result['phien'] or 'Chưa có dữ liệu',
            'ket_qua': result['ket_qua'],
            'xuc_xac_1': result['xuc_xac_1'],
            'xuc_xac_2': result['xuc_xac_2'],
            'xuc_xac_3': result['xuc_xac_3'],
            'tong': result['tong'],
            'md5_raw': result['md5_raw'],
            'betting_info': {
                'phien_cuoc': tick['id'],
                'tick': tick['tick'],
                'sub_tick': tick['sub_tick'],
                'trang_thai': vietnamese_state(tick['state']),
                'tong_nguoi_cuoc': tick['total_unique_users'],
                'tong_tien_cuoc': format_currency(tick['total_amount']),
                'nguoi_cuoc': {
                    'tai': tick['total_users_per_type']['TAI'],
                    'xiu': tick['total_users_per_type']['XIU']
                },
                'tien_cuoc': {
                    'tai': format_currency(tick['total_amount_per_type']['TAI']),
                    'xiu': format_currency(tick['total_amount_per_type']['XIU'])
                }
            },
            'update_at': result['update_at'] or get_vietnam_time(),
            'tick_update_at': tick['update_at']
        }
    return jsonify(response)

@app.route('/api/tx', methods=['GET'])
def get_tx():
    """API lấy kết quả TX"""
    with result_locks['tx']:
        tick = latest_tick_updates['tx']
        result = latest_results['tx']
        
        response = {
            'phien': result['phien'] or 'Chưa có dữ liệu',
            'ket_qua': result['ket_qua'],
            'xuc_xac_1': result['xuc_xac_1'],
            'xuc_xac_2': result['xuc_xac_2'],
            'xuc_xac_3': result['xuc_xac_3'],
            'tong': result['tong'],
            'betting_info': {
                'phien_cuoc': tick['id'],
                'tick': tick['tick'],
                'dem_nguoc': tick['sub_tick'],
                'trang_thai': vietnamese_state(tick['state']),
                'tong_nguoi_cuoc': tick['total_unique_users'],
                'tong_tien_cuoc': format_currency(tick['total_amount']),
                'nguoi_cuoc': {
                    'tai': tick['total_users_per_type']['TAI'],
                    'xiu': tick['total_users_per_type']['XIU']
                },
                'tien_cuoc': {
                    'tai': format_currency(tick['total_amount_per_type']['TAI']),
                    'xiu': format_currency(tick['total_amount_per_type']['XIU'])
                },
                'jackpot': format_currency(tick['jackpot']),
                'settled_balance': tick['settled_balance']
            },
            'update_at': result['update_at'] or get_vietnam_time(),
            'tick_update_at': tick['update_at']
        }
    return jsonify(response)

@app.route('/api/xocdia', methods=['GET'])
def get_xocdia():
    """API lấy kết quả Xóc Đĩa"""
    with result_locks['xocdia']:
        tick = latest_tick_updates['xocdia']
        result = latest_results['xocdia']
        
        xuc_xac_translated = [translate_dice(d) for d in result['xuc_xac']] if result['xuc_xac'] else []
        
        response = {
            'phien': result['phien'] or 'Chưa có dữ liệu',
            'xuc_xac': xuc_xac_translated,
            'xuc_xac_goc': result['xuc_xac'],
            'ket_qua_truyen_thong': 'Lẻ' if result['ket_qua_truyen_thong'] == 'le' else 'Chẵn' if result['ket_qua_truyen_thong'] == 'chan' else result['ket_qua_truyen_thong'],
            'ket_qua_chi_tiet': translate_result_detail(result['ket_qua_chi_tiet']),
            'ket_qua_chi_tiet_goc': result['ket_qua_chi_tiet'],
            'jackpot_result': [translate_bet_type(r) for r in result['jackpot_result']] if result['jackpot_result'] else [],
            'jackpot_result_goc': result['jackpot_result'],
            'md5_raw': result['md5_raw'],
            'betting_info': {
                'phien_cuoc': tick['id'],
                'tick': tick['tick'],
                'dem_nguoc': tick['sub_tick'],
                'trang_thai': vietnamese_state(tick['state']),
                'tong_nguoi_cuoc': tick['total_unique_users'],
                'tong_tien_cuoc': format_currency(tick['total_amount']),
                'jackpot': format_currency(tick['jackpot']),
                'md5': tick['md5'],
                'chi_tiet_cuoc': {
                    'le': {
                        'nguoi_cuoc': tick['total_users_per_type']['le'],
                        'tien_cuoc': format_currency(tick['total_amount_per_type']['le'])
                    },
                    'chan': {
                        'nguoi_cuoc': tick['total_users_per_type']['chan'],
                        'tien_cuoc': format_currency(tick['total_amount_per_type']['chan'])
                    },
                    'ba_do': {
                        'nguoi_cuoc': tick['total_users_per_type']['three_do'],
                        'tien_cuoc': format_currency(tick['total_amount_per_type']['three_do'])
                    },
                    'ba_trang': {
                        'nguoi_cuoc': tick['total_users_per_type']['three_trang'],
                        'tien_cuoc': format_currency(tick['total_amount_per_type']['three_trang'])
                    },
                    'bon_do': {
                        'nguoi_cuoc': tick['total_users_per_type']['four_do'],
                        'tien_cuoc': format_currency(tick['total_amount_per_type']['four_do'])
                    },
                    'bon_trang': {
                        'nguoi_cuoc': tick['total_users_per_type']['four_trang'],
                        'tien_cuoc': format_currency(tick['total_amount_per_type']['four_trang'])
                    }
                }
            },
            'update_at': result['update_at'] or get_vietnam_time(),
            'tick_update_at': tick['update_at']
        }
    return jsonify(response)

@app.route('/', methods=['GET'])
def index():
    """Trang chủ"""
    return jsonify({
        'name': 'Tài Xỉu & Xóc Đĩa Server',
        'version': '2.0',
        'nickname': 'Suckj',
        'so_du': 100,
        'endpoints': {
            '/api/txmd5': 'Kết quả Tài Xỉu MD5',
            '/api/tx': 'Kết quả Tài Xỉu',
            '/api/xocdia': 'Kết quả Xóc Đĩa'
        },
        'thoi_gian': get_vietnam_time()
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint không tồn tại',
        'available_endpoints': ['/api/txmd5', '/api/tx', '/api/xocdia']
    }), 404

# ==================== MAIN ====================
async def main():
    """Hàm chính"""
    # Tạo và chạy WebSocket clients
    clients = []
    for game in WS_URLS.keys():
        client = WebSocketClient(game)
        clients.append(client)
        asyncio.create_task(client.connect())
    
    # Giữ cho server chạy
    await asyncio.Event().wait()

def run_flask():
    """Chạy Flask server"""
    app.run(host=HOST, port=PORT, debug=False, use_reloader=False)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 TÀI XỈU & XÓC ĐĨA SERVER")
    print("="*60)
    print(f"📡 Server đang chạy tại: http://localhost:{PORT}")
    print(f"📌 API endpoints:")
    print(f"   - TXMD5: http://localhost:{PORT}/api/txmd5")
    print(f"   - TX: http://localhost:{PORT}/api/tx")
    print(f"   - Xóc Đĩa: http://localhost:{PORT}/api/xocdia")
    print(f"👤 Nickname: Suckj")
    print(f"💰 Số dư: 100")
    print("="*60)
    print("🔄 Đang kết nối WebSocket với token duy nhất...")
    print("="*60 + "\n")
    
    # Chạy Flask trong thread riêng
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    
    # Chạy asyncio event loop
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Đang tắt server...")
        sys.e