const crypto = require('crypto');

// 配置信息
const API_SECRET = "tB87#kPtkxqOS2";
const API_URL = "https://wos-giftcode-api.centurygame.com/api/player";
const UID = "684062866"; // 你要测试的 ID

function generateSign(fid, time) {
    // 签名拼接规则: fid=xxx&time=xxx + API_SECRET
    const str = `fid=${fid}&time=${time}${API_SECRET}`;
    return crypto.createHash('md5').update(str).digest('hex');
}

async function testQuery() {
    const timestamp = Date.now();
    const sign = generateSign(UID, timestamp);

    console.log(`\x1b[36m正在请求 UID:\x1b[0m ${UID}`);
    console.log(`\x1b[36m时间戳:\x1b[0m ${timestamp}`);
    console.log(`\x1b[36m生成签名:\x1b[0m ${sign}\n`);

    const params = new URLSearchParams();
    params.append('fid', UID);
    params.append('time', timestamp);
    params.append('sign', sign);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const data = await response.json();
        console.log("\x1b[32m--- 原始返回结果 ---\x1b[0m");
        console.log(JSON.stringify(data, null, 2));
        
        if(data.data && data.data.stove_lv) {
            console.log(`\n\x1b[33m提示: 该玩家熔炉等级为 ${data.data.stove_lv}\x1b[0m`);
        }
    } catch (error) {
        console.error("\x1b[31m请求发生错误:\x1b[0m", error.message);
    }
}

testQuery();
