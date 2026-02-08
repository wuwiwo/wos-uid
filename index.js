// index.js
const API_SECRET = "tB87#kPtkxqOS2";
const API_URL = "https://wos-giftcode-api.centurygame.com/api/player";

                  
let currentLang = localStorage.getItem('appLang') || 
                  (I18N_CONFIG[navigator.language] ? navigator.language : 
                  (navigator.language.startsWith('zh') ? 'zh' : 
                   navigator.language.startsWith('ja') ? 'ja' :
                   navigator.language.startsWith('ko') ? 'ko' :
                   navigator.language.startsWith('ar') ? 'ar' : 'en'));
                  

const LEVEL_MAPPING = {
    30:"30", 31: "30-1", 32: "30-2", 33: "30-3", 34: "30-4",
    35: "FC 1", 36: "FC 1 - 1", 37: "FC 1 - 2", 38: "FC 1 - 3", 39: "FC 1 - 4",
    40: "FC 2", 41: "FC 2 - 1", 42: "FC 2 - 2", 43: "FC 2 - 3", 44: "FC 2 - 4",
    45: "FC 3", 46: "FC 3 - 1", 47: "FC 3 - 2", 48: "FC 3 - 3", 49: "FC 3 - 4",
    50: "FC 4", 51: "FC 4 - 1", 52: "FC 4 - 2", 53: "FC 4 - 3", 54: "FC 4 - 4",
    55: "FC 5", 56: "FC 5 - 1", 57: "FC 5 - 2", 58: "FC 5 - 3", 59: "FC 5 - 4",
    60: "FC 6", 61: "FC 6 - 1", 62: "FC 6 - 2", 63: "FC 6 - 3", 64: "FC 6 - 4",
    65: "FC 7", 66: "FC 7 - 1", 67: "FC 7 - 2", 68: "FC 7 - 3", 69: "FC 7 - 4",
    70: "FC 8", 71: "FC 8 - 1", 72: "FC 8 - 2", 73: "FC 8 - 3", 74: "FC 8 - 4",
    75: "FC 9", 76: "FC 9 - 1", 77: "FC 9 - 2", 78: "FC 9 - 3", 79: "FC 9 - 4",
    80: "FC 10", 81: "FC 10 - 1", 82: "FC 10 - 2", 83: "FC 10 - 3", 84: "FC 极寒"
};

// DOM 元素引用
const elements = {
    uidInput: document.getElementById('uidInput'),
    searchBtn: document.getElementById('searchBtn'),
    langSelect: document.getElementById('langSelect'),
    resultContainer: document.getElementById('resultContainer'),
    loading: document.getElementById('loading'),
    historyList: document.getElementById('historyList'),
    notification: document.getElementById('notification')
};

// 更新所有界面文本
function updateUILanguage() {
    const t = I18N_CONFIG[currentLang];
    // 更新 DOM 逻辑
    document.querySelector('.lang-title').textContent = t.title;
    document.querySelector('.lang-subtitle').textContent = t.subtitle;
    document.getElementById('uidInput').placeholder = t.placeholder;
    document.querySelector('.lang-searchBtn').textContent = t.searchBtn;
    document.querySelector('.lang-historyTitle').textContent = t.historyTitle;
    document.querySelector('.lang-clearBtn').textContent = t.clearBtn;
    document.querySelector('.lang-levelLabel').textContent = t.levelLabel;
    document.querySelector('.lang-stateLabel').textContent = t.stateLabel;
    document.querySelector('.lang-timeLabel').textContent = t.timeLabel;

    document.body.dir = (currentLang === 'ar') ? "rtl" : "ltr";
    document.getElementById('langSelect').value = currentLang;
    renderHistory();
}

window.changeLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    updateUILanguage();
};

// 切换语言函数
window.changeLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    updateUILanguage();
};

// 渲染历史记录 (修复记录丢失 Bug)
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('uidSearchHistory')) || [];
    elements.historyList.innerHTML = '';
    const t = I18N_CONFIG[currentLang];

    if (history.length === 0) {
        elements.historyList.innerHTML = `<div class="empty-state">${t.emptyHistory}</div>`;
        return;
    }

    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <img src="${item.avatar || 'https://via.placeholder.com/40'}" class="h-avatar" onerror="this.src='https://via.placeholder.com/40'">
            <div class="h-info">
                <div class="h-name">${item.nickname}</div>
                <div class="h-uid">UID: ${item.uid}</div>
            </div>
        `;
        div.onclick = () => {
            elements.uidInput.value = item.uid;
            handleSearch(item.uid);
        };
        elements.historyList.appendChild(div);
    });
}

// 获取玩家数据逻辑
async function fetchPlayerData(uid) {
    const timestamp = Date.now();
    const sign = md5(`fid=${uid}&time=${timestamp}${API_SECRET}`);
    
    const response = await fetch(API_URL, {
        method: 'POST',
        body: new URLSearchParams({ fid: uid, time: timestamp, sign: sign }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const data = await response.json();
    if (data.code !== 0 || !data.data) throw new Error(data.msg || "Error");
    
    const rawLv = data.data.stove_lv;
    return {
        nickname: data.data.nickname || I18N_CONFIG[currentLang].unknown,
        stove_level: LEVEL_MAPPING[rawLv] || `${I18N_CONFIG[currentLang].levelPrefix} ${rawLv}`,
        kid: data.data.kid || I18N_CONFIG[currentLang].unknown,
        avatar: data.data.avatar_image || "",
        fid: data.data.fid || uid,
        timestamp: new Date().toLocaleString(),
        stove_lv_content: data.data.stove_lv_content
    };
}

// 执行搜索
async function handleSearch(uid) {
    if (!uid) return showToast(I18N_CONFIG[currentLang].errorUid, 'error');

    elements.loading.style.display = 'block';
    elements.resultContainer.style.display = 'none';

    try {
        const result = await fetchPlayerData(uid);
        
        // 更新 UI 结果
        document.getElementById('userName').textContent = result.nickname;
        document.getElementById('userId').textContent = result.fid;
        document.getElementById('stateResult').textContent = result.kid;
        document.getElementById('lastUpdate').textContent = result.timestamp;
        document.getElementById('avatarImg').src = result.avatar || 'https://via.placeholder.com/200/3b82f6/ffffff?text=WOS';
        
        const levelEl = document.getElementById('levelResult');
        const lvContent = String(result.stove_lv_content || "");
        levelEl.innerHTML = lvContent.startsWith('http') ? 
            `${result.stove_level} <img src="${lvContent}" style="height:22px;">` : result.stove_level;

        elements.resultContainer.style.display = 'block';
        
        // 保存并刷新历史 (防止丢失)
        let history = JSON.parse(localStorage.getItem('uidSearchHistory')) || [];
        history = history.filter(h => h.uid != result.fid);
        history.unshift({ uid: result.fid, nickname: result.nickname, avatar: result.avatar });
        if (history.length > 20) history.pop();
        localStorage.setItem('uidSearchHistory', JSON.stringify(history));
        renderHistory();
        
        showToast(I18N_CONFIG[currentLang].querySuccess, 'success');
    } catch (e) {
        showToast(e.message, 'error');
    } finally {
        elements.loading.style.display = 'none';
    }
}

// 事件绑定
document.addEventListener('DOMContentLoaded', updateUILanguage);
elements.searchBtn.onclick = () => handleSearch(elements.uidInput.value.trim());
elements.uidInput.onkeypress = (e) => e.key === 'Enter' && elements.searchBtn.click();
document.getElementById('clearInputBtn').onclick = () => elements.uidInput.value = '';
document.getElementById('clearHistoryBtn').onclick = () => {
    if(confirm(I18N_CONFIG[currentLang].confirmClear)) {
        localStorage.removeItem('uidSearchHistory');
        renderHistory();
    }
};

function showToast(msg, type) {
    elements.notification.textContent = msg;
    elements.notification.className = `toast show ${type}`;
    setTimeout(() => elements.notification.className = 'toast', 3000);
}
