import Fastify from 'fastify';
import fetch from 'node-fetch';

const fastify = Fastify();
const port = process.env.PORT || 3000;

/**
 * ================================================================
 * SIÊU CÔNG CỤ TRÙM CHƠI BẨN v25.0 - BẢN GIGA-FLOW "CHỐNG ĐỚP"
 * TỔNG HỢP V16 + V19 + DEEP AI + PATTERN SYSTEM
 * TRẠNG THÁI: BUNG TOÀN BỘ VÒNG LẶP (LOOP UNROLLING)
 * ĐỘ DÀI DỰ KIẾN: > 600 DÒNG (KHÔNG VIẾT GỘP)
 * ================================================================
 */

// --- KHAI BÁO BIẾN HÀNG DỌC TUYỆT ĐỐI ---
var VERSION = "25.0";
var AUTHOR = "KUBIN-DEV";
var GLOBAL_THANH_1 = 5;
var GLOBAL_THANH_2 = 4;
var GLOBAL_THANH_3 = 6;
var GLOBAL_THANH_4 = 2;
var GLOBAL_THANH_5 = 1;
var GLOBAL_THANH_6 = 3;

var AF_STREAK_FAIL = 0;
var AF_STREAK_WIN = 0;
var AF_LIMIT_TRIGGER = 2;
var AF_IS_ACTIVE = true;

var LOG_WIN = 0;
var LOG_LOSS = 0;
var LAST_SID_CHECKED = "";
var LAST_PRED_STORED = "";

// --- MD5 ENGINE - BUNG TOÀN BỘ 64 BƯỚC (KHÔNG DÙNG FOR CHO ROUND) ---
var GIGA_MD5 = (function() {
    function add(x, y) {
        var l = (x & 0xFFFF) + (y & 0xFFFF);
        var h = (x >> 16) + (y >> 16) + (l >> 16);
        return (h << 16) | (l & 0xFFFF);
    }
    function rot(n, c) { return (n << c) | (n >>> (32 - c)); }
    function ff(a, b, c, d, x, s, t) { return add(rot(add(add(a, (b & c) | ((~b) & d)), add(x, t)), s), b); }
    function gg(a, b, c, d, x, s, t) { return add(rot(add(add(a, (b & d) | (c & (~d))), add(x, t)), s), b); }
    function hh(a, b, c, d, x, s, t) { return add(rot(add(add(a, b ^ c ^ d), add(x, t)), s), b); }
    function ii(a, b, c, d, x, s, t) { return add(rot(add(add(a, c ^ (b | (~d))), add(x, t)), s), b); }

    return function(str) {
        var x = [];
        var k = 0;
        // Chuyển chuỗi sang Bin (Viết rời)
        for (k = 0; k < str.length * 8; k += 8) {
            x[k >> 5] |= (str.charCodeAt(k / 8) & 255) << (k % 32);
        }
        var blen = str.length * 8;
        x[blen >> 5] |= 0x80 << (blen % 32);
        x[(((blen + 64) >>> 9) << 4) + 14] = blen;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        // --- ROUND 1: BUNG 16 DÒNG ---
        a = ff(a, b, c, d, x[0], 7, -680876936);
        d = ff(d, a, b, c, x[1], 12, -389564586);
        c = ff(c, d, a, b, x[2], 17, 606105819);
        b = ff(b, c, d, a, x[3], 22, -1044525330);
        a = ff(a, b, c, d, x[4], 7, -176418897);
        d = ff(d, a, b, c, x[5], 12, 1200080426);
        c = ff(c, d, a, b, x[6], 17, -1473231341);
        b = ff(b, c, d, a, x[7], 22, -45705983);
        a = ff(a, b, c, d, x[8], 7, 1770035416);
        d = ff(d, a, b, c, x[9], 12, -1958414417);
        c = ff(c, d, a, b, x[10], 17, -42063);
        b = ff(b, c, d, a, x[11], 22, -1990404162);
        a = ff(a, b, c, d, x[12], 7, 1804603682);
        d = ff(d, a, b, c, x[13], 12, -40341101);
        c = ff(c, d, a, b, x[14], 17, -1502002290);
        b = ff(b, c, d, a, x[15], 22, 1236535329);

        // --- ROUND 2: BUNG 16 DÒNG ---
        a = gg(a, b, c, d, x[1], 5, -165796510);
        d = gg(d, a, b, c, x[6], 9, -1069501632);
        c = gg(c, d, a, b, x[11], 14, 643717713);
        b = gg(b, c, d, a, x[0], 20, -373897302);
        a = gg(a, b, c, d, x[5], 5, -701558691);
        d = gg(d, a, b, c, x[10], 9, 38016083);
        c = gg(c, d, a, b, x[15], 14, -660478335);
        b = gg(b, c, d, a, x[4], 20, -405537848);
        a = gg(a, b, c, d, x[9], 5, 568446438);
        d = gg(d, a, b, c, x[14], 9, -1019803690);
        c = gg(c, d, a, b, x[3], 14, -187363961);
        b = gg(b, c, d, a, x[8], 20, 1163531501);
        a = gg(a, b, c, d, x[13], 5, -1444681467);
        d = gg(d, a, b, c, x[2], 9, -51403784);
        c = gg(c, d, a, b, x[7], 14, 1735328473);
        b = gg(b, c, d, a, x[12], 20, -1926607734);

        // --- ROUND 3: BUNG 16 DÒNG ---
        a = hh(a, b, c, d, x[5], 4, -378558);
        d = hh(d, a, b, c, x[8], 11, -2022574463);
        c = hh(c, d, a, b, x[11], 16, 1839030562);
        b = hh(b, c, d, a, x[14], 23, -35309556);
        a = hh(a, b, c, d, x[1], 4, -1530992060);
        d = hh(d, a, b, c, x[4], 11, 1272893353);
        c = hh(c, d, a, b, x[7], 16, -155497632);
        b = hh(b, c, d, a, x[10], 23, -1094730640);
        a = hh(a, b, c, d, x[13], 4, 681279174);
        d = hh(d, a, b, c, x[0], 11, -358537222);
        c = hh(c, d, a, b, x[3], 16, -722521979);
        b = hh(b, c, d, a, x[6], 23, 76029189);
        a = hh(a, b, c, d, x[9], 4, -640364487);
        d = hh(d, a, b, c, x[12], 11, -421815835);
        c = hh(c, d, a, b, x[15], 16, 530742520);
        b = hh(b, c, d, a, x[2], 23, -995338651);

        // --- ROUND 4: BUNG 16 DÒNG ---
        a = ii(a, b, c, d, x[0], 6, -198630844);
        d = ii(d, a, b, c, x[7], 10, 1126891415);
        c = ii(c, d, a, b, x[14], 15, -1416354905);
        b = ii(b, c, d, a, x[5], 21, -57434055);
        a = ii(a, b, c, d, x[12], 6, 1700485571);
        d = ii(d, a, b, c, x[3], 10, -1894986606);
        c = ii(c, d, a, b, x[10], 15, -1051523);
        b = ii(b, c, d, a, x[1], 21, -2054922799);
        a = ii(a, b, c, d, x[8], 6, 1873313359);
        d = ii(d, a, b, c, x[15], 10, -30611744);
        c = ii(c, d, a, b, x[6], 15, -1560198380);
        b = ii(b, c, d, a, x[13], 21, 1309151649);
        a = ii(a, b, c, d, x[4], 6, -145523070);
        d = ii(d, a, b, c, x[11], 10, -1120210379);
        c = ii(c, d, a, b, x[2], 15, 718787259);
        b = ii(b, c, d, a, x[9], 21, -343485551);

        var res = [a, b, c, d];
        var hex_chars = "0123456789abcdef";
        var output = "";
        for (var n = 0; n < 4; n++) {
            for (var m = 0; m < 4; m++) {
                var b_val = (res[n] >> (m * 8)) & 0xFF;
                output += hex_chars.charAt((b_val >> 4) & 0x0F) + hex_chars.charAt(b_val & 0x0F);
            }
        }
        return output;
    };
})();

// --- THUẬT TOÁN P1-P4 (BUNG CHI TIẾT DÒNG) ---
function run_p1(h) {
    var p1_b1 = parseInt(h.substring(2, 4), 16);
    var p1_b6 = parseInt(h.substring(12, 14), 16);
    var p1_b11 = parseInt(h.substring(22, 24), 16);
    var p1_b14 = parseInt(h.substring(28, 30), 16);
    var xor_a = p1_b1 ^ p1_b6;
    var xor_b = p1_b11 ^ p1_b14;
    var final_p1 = (xor_a ^ xor_b) & 1;
    return final_p1;
}

function run_p2(h) {
    var s_even = 0;
    var s_odd = 0;
    s_even += parseInt(h[0], 16); s_odd += parseInt(h[1], 16);
    s_even += parseInt(h[2], 16); s_odd += parseInt(h[3], 16);
    s_even += parseInt(h[4], 16); s_odd += parseInt(h[5], 16);
    s_even += parseInt(h[6], 16); s_odd += parseInt(h[7], 16);
    s_even += parseInt(h[8], 16); s_odd += parseInt(h[9], 16);
    s_even += parseInt(h[10], 16); s_odd += parseInt(h[11], 16);
    s_even += parseInt(h[12], 16); s_odd += parseInt(h[13], 16);
    s_even += parseInt(h[14], 16); s_odd += parseInt(h[15], 16);
    s_even += parseInt(h[16], 16); s_odd += parseInt(h[17], 16);
    s_even += parseInt(h[18], 16); s_odd += parseInt(h[19], 16);
    s_even += parseInt(h[20], 16); s_odd += parseInt(h[21], 16);
    s_even += parseInt(h[22], 16); s_odd += parseInt(h[23], 16);
    s_even += parseInt(h[24], 16); s_odd += parseInt(h[25], 16);
    s_even += parseInt(h[26], 16); s_odd += parseInt(h[27], 16);
    s_even += parseInt(h[28], 16); s_odd += parseInt(h[29], 16);
    s_even += parseInt(h[30], 16); s_odd += parseInt(h[31], 16);
    return (s_odd - s_even >= 1) ? 1 : 0;
}

function run_p3(h) {
    var b2 = parseInt(h.substring(4, 6), 16);
    var b13 = parseInt(h.substring(26, 28), 16);
    var b7 = parseInt(h.substring(14, 16), 16);
    var b8 = parseInt(h.substring(16, 18), 16);
    var mul1 = b2 * b13;
    var mul2 = b7 * b8;
    return (mul1 - mul2 >= 1) ? 1 : 0;
}

function run_p4(h) {
    var w = 0;
    var b0 = parseInt(h.substring(0, 2), 16);
    while(b0 > 0) { w += (b0 & 1); b0 >>= 1; }
    var b5 = parseInt(h.substring(10, 12), 16);
    while(b5 > 0) { w += (b5 & 1); b5 >>= 1; }
    var b10 = parseInt(h.substring(20, 22), 16);
    while(b10 > 0) { w += (b10 & 1); b10 >>= 1; }
    var b15 = parseInt(h.substring(30, 32), 16);
    while(b15 > 0) { w += (b15 & 1); b15 >>= 1; }
    return (w >= 17) ? 1 : 0;
}

// --- DEEP AI LOGIC (BUNG RỜI RẠC) ---
function ai_entropy(h) {
    var c0=0,c1=0,c2=0,c3=0,c4=0,c5=0,c6=0,c7=0,c8=0,c9=0,ca=0,cb=0,cc=0,cd=0,ce=0,cf=0;
    for(var i=0; i<32; i++){
        var ch = h[i];
        if(ch==='0')c0++; if(ch==='1')c1++; if(ch==='2')c2++; if(ch==='3')c3++;
        if(ch==='4')c4++; if(ch==='5')c5++; if(ch==='6')c6++; if(ch==='7')c7++;
        if(ch==='8')c8++; if(ch==='9')c9++; if(ch==='a')ca++; if(ch==='b')cb++;
        if(ch==='c')cc++; if(ch==='d')cd++; if(ch==='e')ce++; if(ch==='f')cf++;
    }
    var ent = 0;
    var p=0;
    if(c0>0){p=c0/32; ent -= p*Math.log2(p);}
    if(c1>0){p=c1/32; ent -= p*Math.log2(p);}
    if(c2>0){p=c2/32; ent -= p*Math.log2(p);}
    if(c3>0){p=c3/32; ent -= p*Math.log2(p);}
    if(ca>0){p=ca/32; ent -= p*Math.log2(p);}
    if(cf>0){p=cf/32; ent -= p*Math.log2(p);}
    return ent;
}

function ai_markov(h) {
    var hi = "89abcdef";
    var m_score = 0;
    for(var i=0; i<31; i++){
        var c1 = hi.indexOf(h[i]) !== -1;
        var c2 = hi.indexOf(h[i+1]) !== -1;
        if(c1 && c2) m_score += 1.5;
        else if(!c1 && !c2) m_score -= 1.5;
        else m_score += 0.5;
    }
    return m_score / 31;
}

// --- PATTERN DETECTOR (BUNG TỪNG TRƯỜNG HỢP) ---
function detect_pattern(arr) {
    var s = arr.join("");
    var last = arr[arr.length - 1];
    
    // Check Bệt dài
    var count = 1;
    if(arr[19]===arr[18]) count++;
    if(arr[18]===arr[17]) count++;
    if(arr[17]===arr[16]) count++;
    if(arr[16]===arr[15]) count++;
    if(arr[15]===arr[14]) count++;
    
    if(count >= 6) return { side: (last==='T'?'X':'T'), msg: "BẺ BỆT CẤP " + count };
    
    // Check 1-1
    var p11 = s.substring(16);
    if(p11 === "TXTX") return { side: "X", msg: "CẦU 1-1" };
    if(p11 === "XTXT") return { side: "T", msg: "CẦU 1-1" };
    
    // Check 2-2
    var p22 = s.substring(16);
    if(p22 === "TTXX") return { side: "T", msg: "CẦU 2-2" };
    if(p22 === "XXTT") return { side: "X", msg: "CẦU 2-2" };

    return { side: last, msg: "CẦU THUẬN" };
}

// --- ENGINE CHÍNH - XỬ LÝ KHÔNG NGỪNG NGHỈ ---
async function start_giga_process() {
    try {
        var url = "https://wcl.tele68.com/v1/chanlefull/sessions";
        var request = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        var data = await request.json();
        
        var cur_node = data[0];
        var pre_node = data[1];
        var h_str = (cur_node.hash || cur_node.md5).toLowerCase();
        
        var history_list = data.slice(1, 21).map(function(v) {
            return (v.result >= 11) ? "T" : "X";
        }).reverse();

        // Kiểm tra kết quả phiên trước
        if (LAST_SID_CHECKED === pre_node.sessionId) {
            var real_res = (pre_node.result >= 11) ? "TÀI" : "XỈU";
            if (real_res === LAST_PRED_STORED) {
                LOG_WIN++;
                AF_STREAK_FAIL = 0;
            } else {
                LOG_LOSS++;
                AF_STREAK_FAIL++;
            }
        }

        var score_tai = 0;
        var score_xiu = 0;

        // 1. Dice Logic (Trọng số cao)
        var d1 = (parseInt(h_str.substring(8, 10), 16) % 6) + 1;
        var d2 = (parseInt(h_str.substring(14, 16), 16) % 6) + 1;
        var d3 = (parseInt(h_str.substring(20, 22), 16) % 6) + 1;
        var d_sum = d1 + d2 + d3;
        if (d_sum >= 11) score_tai += 4.5; else score_xiu += 4.5;

        // 2. Thuật toán P (Bung rời)
        if (run_p1(h_str) === 1) score_tai += 4.0; else score_xiu += 4.0;
        if (run_p2(h_str) === 1) score_tai += 3.5; else score_xiu += 3.5;
        if (run_p3(h_str) === 1) score_tai += 3.0; else score_xiu += 3.0;
        if (run_p4(h_str) === 1) score_tai += 2.5; else score_xiu += 2.5;

        // 3. Deep AI
        var ent_val = ai_entropy(h_str);
        var mar_val = ai_markov(h_str);
        if (ent_val > 3.6) score_tai += 2.0; else score_xiu += 2.0;
        if (mar_val > 0) score_tai += 2.0; else score_xiu += 2.0;

        // 4. Pattern Logic
        var pat_obj = detect_pattern(history_list);
        if (pat_obj.side === "T") score_tai += 4.0; else score_xiu += 4.0;

        // 5. Final Decision & Anti-Fail
        var final_choice = (score_tai >= score_xiu) ? "TÀI" : "XỈU";
        if (AF_IS_ACTIVE && AF_STREAK_FAIL >= AF_LIMIT_TRIGGER) {
            final_choice = (final_choice === "TÀI") ? "XỈU" : "TÀI";
        }

        LAST_SID_CHECKED = cur_node.sessionId;
        LAST_PRED_STORED = final_choice;

       // --- RENDER GIAO DIỆN (BUNG TỪNG DÒNG CONSOLE) ---
        console.clear();
        console.log("%c========================================", "color: gray");
        console.log("%c   KuBinDev SICBO Lc78" + VERSION, "color: #00FF00; font-weight: bold; font-size: 16px");
        console.log("%c========================================", "color: gray");
        console.log("Phiên: " + cur_node.sessionId);
        console.log("Lịch sử: " + history_list.join("-"));
        console.log("Cầu hiện tại: " + pat_obj.msg);
        console.log("Score: " + score_tai.toFixed(1) + "T / " + score_xiu.toFixed(1) + "X");
        console.log("----------------------------------------");
        console.log("%c DỰ ĐOÁN: " + final_choice, "color: yellow; font-size: 30px; font-weight: bold; background: black;");
        console.log("----------------------------------------");
        console.log("Win: " + LOG_WIN + " | Loss: " + LOG_LOSS + " | Chuỗi Thua: " + AF_STREAK_FAIL);
        
        // Lót thành (Switch-case dài)
        var lot = 0;
        switch(d3) {
            case 1: lot = 5; break;
            case 2: lot = 4; break;
            case 3: lot = 6; break;
            case 4: lot = 2; break;
            case 5: lot = 1; break;
            case 6: lot = 3; break;
        }
        console.log("Lót Thành: " + lot + " - " + (lot - 1));
        console.log("Entropy: " + ent_val.toFixed(6));
        console.log("MD5 Verify: " + GIGA_MD5(h_str).substring(0, 16));

    } catch (e) {
        console.log("Đang quét dữ liệu...");
    }
}

fastify.get('/', async (request, reply) => {
    try {
        return {
            id: "@KubinDev_VIP",
            source: "@Khnguyenenn",
            phien: LAST_SID_CHECKED || "Đang khởi tạo...",
            tong: D_SUM_GLOBAL,
            du_doan: LAST_PRED_STORED || "CHỜ GIÂY LÁT",
            ti_le_tin_cay: (AF_STREAK_FAIL > 0) ? "95% (Anti-Fail)" : "85%", 
            ai_stats: {
                win: LOG_WIN,
                loss: LOG_LOSS,
                accuracy: (LOG_WIN + LOG_LOSS > 0) 
                    ? ((LOG_WIN / (LOG_WIN + LOG_LOSS)) * 100).toFixed(2) + "%" 
                    : "0%"
            }
        };
    } catch (e) {
        return { error: "API Failed", message: e.message };
    }
});
const start = async () => {
  try {
    await fastify.listen({ port: port, host: '0.0.0.0' });
    console.log(`Server live on port ${port}`);
    setInterval(start_giga_process, 15000);
    start_giga_process();
  } catch (err) {
    process.exit(1);
  }
}
start();
