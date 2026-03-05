// api/player.js
const crypto = require('crypto');

export default async function handler(req, res) {
    // 允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 从请求体获取 UID
    const { fid } = req.body;
    if (!fid) {
        return res.status(400).json({ code: -1, msg: "缺少 UID 参数" });
    }

    const API_SECRET = "tB87#kPtkxqOS2"; //
    const API_URL = "https://wos-giftcode-api.centurygame.com/api/player"; //
    const timestamp = Date.now();
    
    // 生成签名
    const sign = crypto.createHash('md5')
        .update(`fid=${fid}&time=${timestamp}${API_SECRET}`)
        .digest('hex');

    try {
        // 后端发起请求，伪装 Referer 和 Origin 以绕过校验
        const apiRes = await fetch(API_URL, {
            method: 'POST',
            body: new URLSearchParams({ fid, time: timestamp, sign: sign }),
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://wos-giftcode.centurygame.com/',
                'Origin': 'https://wos-giftcode.centurygame.com'
            }
        });

        const data = await apiRes.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ code: -1, msg: "代理请求失败: " + e.message });
    }
}
