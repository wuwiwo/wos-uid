// index.js - 最终修复优化版 v1.6
// 修复所有错误并优化性能
// 修改为 Vercel 部署，以应对官方封禁问题

// ============== 全局变量 ==============
let currentLang = 'zh'; // 默认语言

const API_SECRET = "tB87#kPtkxqOS2";
//const API_URL = "https://wos-giftcode-api.centurygame.com/api/player";
const API_URL = "/api/player"; 

// 等级映射
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

// ============== DOM 缓存 ==============
const dom = {
    uidInput: null,
    searchBtn: null,
    langSelect: null,
    resultContainer: null,
    loading: null,
    historyList: null,
    notification: null,
    clearInputBtn: null,
    clearHistoryBtn: null
};

// 数据缓存
const cache = {
    history: [],
    api: new Map(),
    lastSearchTime: 0
};

// ============== 工具函数 ==============

/**
 * 显示Toast通知
 */
function showToast(message, type = 'info') {
    const toast = dom.notification;
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // 触发重绘
    void toast.offsetWidth;
    
    toast.classList.add('show');
    
    // 清除之前的定时器
    if (toast.hideTimer) clearTimeout(toast.hideTimer);
    
    toast.hideTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * 显示/隐藏加载动画
 */
function setLoading(show) {
    if (!dom.loading || !dom.resultContainer) return;
    
    if (show) {
        dom.loading.style.display = 'block';
        dom.resultContainer.style.display = 'none';
    } else {
        dom.loading.style.display = 'none';
    }
}

// ============== 初始化函数 ==============

/**
 * 初始化应用
 */
function initApp() {
    try {
        cacheDOM();
        initLanguage();
        setupEvents();
        renderHistory();
    } catch (error) {
        console.error('初始化失败:', error);
    }
}

/**
 * 缓存DOM元素
 */
function cacheDOM() {
    dom.uidInput = document.getElementById('uidInput');
    dom.searchBtn = document.getElementById('searchBtn');
    dom.langSelect = document.getElementById('langSelect');
    dom.resultContainer = document.getElementById('resultContainer');
    dom.loading = document.getElementById('loading');
    dom.historyList = document.getElementById('historyList');
    dom.notification = document.getElementById('notification');
    dom.clearInputBtn = document.getElementById('clearInputBtn');
    dom.clearHistoryBtn = document.getElementById('clearHistoryBtn');
}

/**
 * 初始化语言
 */
function initLanguage() {
    // 1. 尝试从本地存储获取
    const storedLang = localStorage.getItem('appLang');
    if (storedLang && I18N_CONFIG[storedLang]) {
        currentLang = storedLang;
        updateUI();
        return;
    }
    
    // 2. 根据浏览器语言检测
    const browserLang = navigator.language || 'en';
    
    // 检查完整语言代码
    if (I18N_CONFIG[browserLang]) {
        currentLang = browserLang;
    } else {
        // 检查语言前缀
        const langPrefix = browserLang.split('-')[0];
        switch (langPrefix) {
            case 'zh':
                currentLang = browserLang.includes('TW') ? 'zh-TW' : 'zh';
                break;
            case 'ja':
                currentLang = 'ja';
                break;
            case 'ko':
                currentLang = 'ko';
                break;
            case 'ar':
                currentLang = 'ar';
                break;
            default:
                currentLang = 'en';
        }
    }
    
    // 保存并更新UI
    localStorage.setItem('appLang', currentLang);
    updateUI();
}

/**
 * 更新UI文本
 */
function updateUI() {
    const t = I18N_CONFIG[currentLang];
    if (!t) return;
    
    // 更新文本元素
    const elements = {
        '.lang-title': t.title,
        '.lang-subtitle': t.subtitle,
        '.lang-searchBtn': t.searchBtn,
        '.lang-historyTitle': t.historyTitle,
        '.lang-clearBtn': t.clearBtn,
        '.lang-levelLabel': t.levelLabel,
        '.lang-stateLabel': t.stateLabel,
        '.lang-timeLabel': t.timeLabel
    };
    
    Object.entries(elements).forEach(([selector, text]) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    });
    
    // 更新输入框placeholder
    if (dom.uidInput) {
        dom.uidInput.placeholder = t.placeholder;
    }
    
    // 更新语言选择器
    if (dom.langSelect) {
        dom.langSelect.value = currentLang;
    }
    
    // 设置文本方向
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}

/**
 * 设置事件监听
 */
function setupEvents() {
    // 搜索按钮
    if (dom.searchBtn) {
        dom.searchBtn.addEventListener('click', () => {
            const uid = dom.uidInput?.value.trim();
            if (uid) performSearch(uid);
        });
    }
    
    // 回车搜索
    if (dom.uidInput) {
        dom.uidInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const uid = dom.uidInput.value.trim();
                if (uid) performSearch(uid);
            }
        });
    }
    
    // 清除输入
    if (dom.clearInputBtn) {
        dom.clearInputBtn.addEventListener('click', () => {
            if (dom.uidInput) {
                dom.uidInput.value = '';
                dom.uidInput.focus();
            }
        });
    }
    
    // 清除历史
    if (dom.clearHistoryBtn) {
        dom.clearHistoryBtn.addEventListener('click', () => {
            const t = I18N_CONFIG[currentLang];
            if (confirm(t.confirmClear)) {
                clearHistory();
            }
        });
    }
    
    // 历史记录点击（事件委托）
    if (dom.historyList) {
        dom.historyList.addEventListener('click', (e) => {
            const historyItem = e.target.closest('.history-item');
            if (historyItem && historyItem.dataset.uid) {
                if (dom.uidInput) {
                    dom.uidInput.value = historyItem.dataset.uid;
                }
                performSearch(historyItem.dataset.uid);
            }
        });
    }
}

// ============== 历史记录功能 ==============

/**
 * 渲染历史记录
 */
function renderHistory() {
    // 加载历史记录
    if (cache.history.length === 0) {
        try {
            const stored = localStorage.getItem('uidSearchHistory');
            if (stored) {
                cache.history = JSON.parse(stored);
            }
        } catch (e) {
            console.error('加载历史记录失败:', e);
            cache.history = [];
        }
    }
    
    const t = I18N_CONFIG[currentLang];
    
    if (!dom.historyList) return;
    
    // 空状态
    if (cache.history.length === 0) {
        dom.historyList.innerHTML = `<div class="empty-state">${t.emptyHistory}</div>`;
        return;
    }
    
    // 构建历史列表
    const fragment = document.createDocumentFragment();
    
    cache.history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.dataset.uid = item.uid;
        div.innerHTML = `
            <img src="${item.avatar || 'https://via.placeholder.com/40'}" 
                 class="h-avatar" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/40'"
                 alt="${item.nickname || '玩家'}">
            <div class="h-info">
                <div class="h-name">${item.nickname || '未知玩家'}</div>
                <div class="h-uid">UID: ${item.uid}</div>
            </div>
        `;
        fragment.appendChild(div);
    });
    
    dom.historyList.innerHTML = '';
    dom.historyList.appendChild(fragment);
}

/**
 * 更新历史记录
 */
function updateHistory(uid, nickname, avatar) {
    // 移除重复项
    const index = cache.history.findIndex(item => item.uid === uid);
    if (index !== -1) {
        cache.history.splice(index, 1);
    }
    
    // 添加到开头
    cache.history.unshift({
        uid,
        nickname,
        avatar
    });
    
    // 限制长度
    if (cache.history.length > 20) {
        cache.history = cache.history.slice(0, 20);
    }
    
    // 保存到本地存储
    try {
        localStorage.setItem('uidSearchHistory', JSON.stringify(cache.history));
    } catch (e) {
        console.error('保存历史记录失败:', e);
    }
    
    // 更新UI
    renderHistory();
}

/**
 * 清除历史记录
 */
function clearHistory() {
    cache.history = [];
    localStorage.removeItem('uidSearchHistory');
    
    // 清除相关API缓存
    for (const [key] of cache.api) {
        if (key.startsWith('uid_')) {
            cache.api.delete(key);
        }
    }
    
    renderHistory();
    showToast('历史记录已清空', 'success');
}

// ============== API 功能 ==============

/**
 * 执行搜索
 */
async function performSearch(uid) {
    // 验证UID
    if (!uid || !/^\d+$/.test(uid)) {
        showToast(I18N_CONFIG[currentLang].errorUid, 'error');
        return;
    }
    
    // 请求节流（1秒内只允许一次）
    const now = Date.now();
    if (now - cache.lastSearchTime < 1000) {
        return;
    }
    cache.lastSearchTime = now;
    
    // 检查缓存（5分钟有效期）
    const cacheKey = `uid_${uid}`;
    const cached = cache.api.get(cacheKey);
    if (cached && (now - cached.timestamp < 5 * 60 * 1000)) {
        displayResults(cached.data);
        updateHistory(uid, cached.data.nickname, cached.data.avatar);
        showToast(I18N_CONFIG[currentLang].querySuccess, 'success');
        return;
    }
    
    // 显示加载
    setLoading(true);
    
    try {
        const data = await fetchPlayerData(uid);
        
        // 缓存结果
        cache.api.set(cacheKey, {
            data,
            timestamp: now
        });
        
        // 显示结果
        displayResults(data);
        
        // 更新历史记录
        updateHistory(uid, data.nickname, data.avatar);
        
        showToast(I18N_CONFIG[currentLang].querySuccess, 'success');
    } catch (error) {
        console.error('搜索失败:', error);
        showToast(error.message || I18N_CONFIG[currentLang].unknown, 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * 获取玩家数据 (Vercel 适配版)
 * 前端不再处理签名，全部交给 /api/player 处理
 */
async function fetchPlayerData(uid) {
    // 已经在开头定义：const API_URL = "/api/player"; 
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // 前端只需发送 fid (即 uid)
            body: JSON.stringify({ fid: uid }), 
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // 尝试解析 JSON 结果
        const result = await response.json();
        
        if (!response.ok) {
            // 如果后端返回 Unauthorized，result.msg 会包含具体错误
            throw new Error(result.msg || `HTTP Error: ${response.status}`);
        }
        
        // 处理官方 API 返回的 code
        if (result.code !== 0 || !result.data) {
            throw new Error(result.msg || I18N_CONFIG[currentLang].unknown);
        }
        
        const data = result.data;
        const rawLevel = data.stove_lv;
        
        // 修复：确保 stove_lv_content 是字符串
        const stoveLvContent = data.stove_lv_content != null ? String(data.stove_lv_content) : '';
        
        return {
            nickname: data.nickname || I18N_CONFIG[currentLang].unknown,
            stove_level: LEVEL_MAPPING[rawLevel] || 
                        `${I18N_CONFIG[currentLang].levelPrefix} ${rawLevel}`,
            kid: data.kid || I18N_CONFIG[currentLang].unknown,
            avatar: data.avatar_image || 
                   'https://via.placeholder.com/200/3b82f6/ffffff?text=WOS',
            fid: data.fid || uid,
            timestamp: new Date().toLocaleString(),
            stove_lv_content: stoveLvContent 
        };
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('请求超时，请稍后重试');
        }
        // 如果后端崩溃或返回非 JSON，会进入这里
        if (error instanceof SyntaxError) {
            throw new Error('服务器响应格式异常，请检查 api/player.js 是否部署成功');
        }
        throw error;
    }
}



/**
 * 显示搜索结果
 */
function displayResults(data) {
    if (!dom.resultContainer) return;
    
    // 更新DOM
    const update = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    
    update('userName', data.nickname);
    update('userId', data.fid);
    update('stateResult', data.kid);
    update('lastUpdate', data.timestamp);
    
    // 更新头像
    const avatarImg = document.getElementById('avatarImg');
    if (avatarImg) {
        avatarImg.src = data.avatar;
        avatarImg.alt = data.nickname;
    }
    
    // 修复：安全地检查stove_lv_content
    const levelEl = document.getElementById('levelResult');
    if (levelEl) {
        // 确保stove_lv_content是字符串且不为空
        const lvContent = data.stove_lv_content || '';
        
        // 检查是否是URL
        if (typeof lvContent === 'string' && 
            lvContent.trim() !== '' && 
            (lvContent.startsWith('http://') || lvContent.startsWith('https://'))) {
            levelEl.innerHTML = `${data.stove_level} <img src="${lvContent}" loading="lazy" style="height:22px;">`;
        } else {
            levelEl.textContent = data.stove_level;
        }
    }
    
    // 显示结果容器
    dom.resultContainer.style.display = 'block';
}

/**
 * 显示搜索结果
 */
function displayResults(data) {
    if (!dom.resultContainer) return;
    
    // 更新DOM
    const update = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    
    update('userName', data.nickname);
    update('userId', data.fid);
    update('stateResult', data.kid);
    update('lastUpdate', data.timestamp);
    
    // 更新头像
    const avatarImg = document.getElementById('avatarImg');
    if (avatarImg) {
        avatarImg.src = data.avatar;
        avatarImg.alt = data.nickname;
    }
    
    // 更新等级
    const levelEl = document.getElementById('levelResult');
    if (levelEl) {
        if (data.stove_lv_content && data.stove_lv_content.startsWith('http')) {
            levelEl.innerHTML = `${data.stove_level} <img src="${data.stove_lv_content}" loading="lazy" style="height:22px;">`;
        } else {
            levelEl.textContent = data.stove_level;
        }
    }
    
    // 显示结果容器
    dom.resultContainer.style.display = 'block';
}

// ============== 全局函数 ==============

/**
 * 切换语言
 */
window.changeLanguage = (lang) => {
    if (I18N_CONFIG[lang]) {
        currentLang = lang;
        localStorage.setItem('appLang', lang);
        updateUI();
    }
};

/**
 * 复制文本
 */
window.copyText = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        const text = element.textContent || element.innerText;
        navigator.clipboard.writeText(text).then(() => {
            showToast(I18N_CONFIG[currentLang].copySuccess, 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败', 'error');
        });
    }
};

// ============== 启动应用 ==============

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);