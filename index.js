// 配置
const API_SECRET = "tB87#kPtkxqOS2";
const API_URL = "https://wos-giftcode-api.centurygame.com/api/player";

// 熔炉等级映射
const LEVEL_MAPPING = {
    31: "30-1", 32: "30-2", 33: "30-3", 34: "30-4",
    35: "FC 1", 36: "FC 1 - 1", 37: "FC 1 - 2", 38: "FC 1 - 3", 39: "FC 1 - 4",
    40: "FC 2", 41: "FC 2 - 1", 42: "FC 2 - 2", 43: "FC 2 - 3", 44: "FC 2 - 4",
    45: "FC 3", 46: "FC 3 - 1", 47: "FC 3 - 2", 48: "FC 3 - 3", 49: "FC 3 - 4",
    50: "FC 4", 51: "FC 4 - 1", 52: "FC 4 - 2", 53: "FC 4 - 3", 54: "FC 4 - 4",
    55: "FC 5", 56: "FC 5 - 1", 57: "FC 5 - 2", 58: "FC 5 - 3", 59: "FC 5 - 4",
    60: "FC 6", 61: "FC 6 - 1", 62: "FC 6 - 2", 63: "FC 6 - 3", 64: "FC 6 - 4",
    65: "FC 7", 66: "FC 7 - 1", 67: "FC 7 - 2", 68: "FC 7 - 3", 69: "FC 7 - 4",
    70: "FC 8", 71: "FC 8 - 1", 72: "FC 8 - 2", 73: "FC 8 - 3", 74: "FC 8 - 4",
    75: "FC 9", 76: "FC 9 - 1", 77: "FC 9 - 2", 78: "FC 9 - 3", 79: "FC 9 - 4",
    80: "FC 10", 81: "FC 10 - 1", 82: "FC 10 - 2", 83: "FC 10 - 3", 84: "FC 10 - 4"
};

// DOM 元素
const uidInput = document.getElementById('uidInput');
const searchBtn = document.getElementById('searchBtn');
const resultContainer = document.getElementById('resultContainer');
const loading = document.getElementById('loading');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const emptyHistory = document.getElementById('emptyHistory');
const notification = document.getElementById('notification');

// 从 localStorage 加载历史记录
let searchHistory = JSON.parse(localStorage.getItem('uidSearchHistory')) || [];
updateHistoryCount();

// 加载 MD5 库
function loadMD5() {
    return new Promise((resolve) => {
        if (typeof md5 === 'function') {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

// 生成 MD5 签名
function generateMD5(str) {
    return md5(str);
}

// 获取玩家数据（带重试机制）
async function fetchPlayerData(uid, retries = 3, delay = 1000) {
    await loadMD5(); // 确保 MD5 库已加载
    
    for (let i = 0; i < retries; i++) {
        try {
            const timestamp = Date.now();
            const form = `fid=${uid}&time=${timestamp}`;
            const sign = generateMD5(form + API_SECRET);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                body: new URLSearchParams({
                    fid: uid,
                    time: timestamp,
                    sign: sign
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            if (!response.ok) {
                if (response.status === 429 && i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`API错误: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.code !== 0 || !data.data) {
                throw new Error(data.msg || "无效的API响应");
            }
            
            return {
                nickname: data.data.nickname || "未知",
                stove_level: LEVEL_MAPPING[data.data.stove_lv] || `Level ${data.data.stove_lv}`,
                kid: data.data.kid || "未知",
                avatar: data.data.avatar_image || "",
                fid: data.data.fid || uid,
                timestamp: new Date().toLocaleString(),
                stove_lv_content: data.data.stove_lv_content || ""
            };
        } catch (error) {
            if (i === retries - 1) {
                console.error('API请求失败:', error);
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// 渲染历史记录
function renderHistory() {
    if (searchHistory.length === 0) {
        emptyHistory.style.display = 'block';
        historyList.innerHTML = '';
        historyList.appendChild(emptyHistory);
        return;
    }
    
    emptyHistory.style.display = 'none';
    historyList.innerHTML = '';
    
    // 按时间倒序排列
    const sortedHistory = [...searchHistory].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.index = index;
        
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-uid">${item.uid}</div>
                <div class="history-name">${item.nickname}</div>
                <div class="history-date">${item.timestamp}</div>
            </div>
            <div class="history-actions">
                <button class="history-action-btn view-btn" title="查看">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="history-action-btn delete-btn" title="删除">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        historyList.appendChild(historyItem);
        
        // 添加事件监听器
        const viewBtn = historyItem.querySelector('.view-btn');
        const deleteBtn = historyItem.querySelector('.delete-btn');
        
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            viewHistoryItem(index);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteHistoryItem(index);
        });
        
        historyItem.addEventListener('click', () => {
            viewHistoryItem(index);
        });
    });
}

// 查看历史记录
function viewHistoryItem(index) {
    const item = searchHistory[index];
    displayResult(item);
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// 删除历史记录
function deleteHistoryItem(index) {
    searchHistory.splice(index, 1);
    localStorage.setItem('uidSearchHistory', JSON.stringify(searchHistory));
    renderHistory();
    updateHistoryCount();
    showNotification('历史记录已删除', 'success');
}

// 清空历史记录
function clearHistory() {
    if (searchHistory.length > 0 && confirm('确定要清空所有历史记录吗？')) {
        searchHistory = [];
        localStorage.removeItem('uidSearchHistory');
        renderHistory();
        updateHistoryCount();
        showNotification('历史记录已清空', 'success');
    } else if (searchHistory.length === 0) {
        showNotification('没有可清除的历史记录', 'error');
    }
}

// 更新历史记录计数
function updateHistoryCount() {
    historyCount.textContent = searchHistory.length;
}

// 显示查询结果
function displayResult(data) {
    document.getElementById('userName').textContent = data.nickname;
    document.getElementById('userId').textContent = data.fid;
    
    // 显示熔炉等级和图标（如果有）
    const levelElement = document.getElementById('levelResult');
    levelElement.textContent = data.stove_level;
    if (data.stove_lv_content && data.stove_lv_content.startsWith('http')) {
        levelElement.innerHTML = `${data.stove_level} <img src="${data.stove_lv_content}" style="height:20px;vertical-align:middle">`;
    }
    
    document.getElementById('stateResult').textContent = data.kid;
    document.getElementById('avatarImg').src = data.avatar || 'https://via.placeholder.com/200';
    document.getElementById('avatarResult').textContent = data.avatar || "无头像";
    document.getElementById('lastUpdate').textContent = data.timestamp;
    
    resultContainer.style.display = 'block';
}

// 显示加载状态
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    searchBtn.disabled = show;
}

// 显示通知
function showNotification(message, type) {
    notification.querySelector('span').textContent = message;
    notification.className = 'notification show';
    notification.classList.toggle('error', type === 'error');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 添加查询历史
function addToHistory(data) {
    const existingIndex = searchHistory.findIndex(item => item.uid === data.fid);
    if (existingIndex !== -1) {
        searchHistory.splice(existingIndex, 1);
    }
    
    searchHistory.unshift({
        uid: data.fid,
        nickname: data.nickname,
        stove_level: data.stove_level,
        kid: data.kid,
        avatar: data.avatar,
        timestamp: data.timestamp,
        stove_lv_content: data.stove_lv_content
    });
    
    if (searchHistory.length > 20) {
        searchHistory = searchHistory.slice(0, 20);
    }
    
    localStorage.setItem('uidSearchHistory', JSON.stringify(searchHistory));
    renderHistory();
    updateHistoryCount();
}

// 复制文本功能
document.addEventListener('click', (e) => {
    if (e.target.closest('.copy-btn')) {
        const btn = e.target.closest('.copy-btn');
        const targetId = btn.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        const textToCopy = targetElement.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('已复制到剪贴板', 'success');
        }).catch(err => {
            showNotification('复制失败，请重试', 'error');
            console.error('复制错误:', err);
        });
    }
});

// 查询按钮点击事件
searchBtn.addEventListener('click', async () => {
    const uid = uidInput.value.trim();
    if (!uid) {
        showNotification('请输入有效的 UID', 'error');
        return;
    }
    
    showLoading(true);
    resultContainer.style.display = 'none';
    
    try {
        const result = await fetchPlayerData(uid);
        displayResult(result);
        addToHistory(result);
        showNotification('查询成功', 'success');
    } catch (error) {
        showNotification(`查询失败: ${error.message}`, 'error');
        console.error('查询错误:', error);
    } finally {
        showLoading(false);
    }
});

// 清空历史记录按钮
clearHistoryBtn.addEventListener('click', clearHistory);

// 回车键触发查询
uidInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// 初始化
renderHistory();
window.addEventListener('load', () => {
    if (searchHistory.length > 0) {
        displayResult(searchHistory[0]);
    }
});