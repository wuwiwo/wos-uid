# WOS UID 查询工具 / WOS UID Query Tool

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## 🌐 WOS UID Query Tool (English)

A web-based tool for querying player information in the game "寒霜启示录" (Frost Apocalypse) using UID (User ID).

### ✨ Features

- **Player Information Query**: Retrieve player details by entering their UID
- **Comprehensive Data Display**: 
  - Player nickname and UID
  - Furnace level with special mapping
  - State/Region information
  - Player avatar image
  - Last update timestamp
- **Query History**: Automatically saves recent queries with quick access
- **Copy Functionality**: One-click copy for any displayed information
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Retry Mechanism**: Automatic retry on API failures

### 🚀 Quick Start

1. **Access the Tool**: Open the tool at [https://wuwiwo.github.io/wos-uid/](https://wuwiwo.github.io/wos-uid/)
2. **Enter UID**: Input the player's UID in the search box (e.g., `251097717`)
3. **Query**: Click the search button or press Enter
4. **View Results**: Player information will be displayed below

### 🛠️ Technical Details

#### File Structure
- `index.html` - Main HTML file
- `index.css` - Stylesheets  
- `index.js` - JavaScript functionality

#### API Integration
- **Endpoint**: `https://wos-giftcode-api.centurygame.com/api/player`
- **Authentication**: MD5-based signature with timestamp
- **Request Method**: POST with form data
- **Response Format**: JSON

#### Key Functions
- `fetchPlayerData(uid)` - Main API call function with retry logic
- `displayResult(data)` - Renders player information
- `addToHistory(data)` - Manages query history
- `generateMD5(str)` - Creates API signatures

### 🔧 Configuration

Modify the following constants in index.js if needed:
- API_SECRET = "tB87#kPtkxqOS2"
- API_URL = "https://wos-giftcode-api.centurygame.com/api/player"

### 🌟 Special Features

#### Furnace Level Mapping
The tool includes a comprehensive mapping system for furnace levels beyond 30, displaying special tier names like "FC 1", "FC 2", etc.

#### History Management
- Stores up to 20 recent queries
- Persistent storage using localStorage
- Quick view and delete functionality

#### User Experience
- Loading indicators during API calls
- Success/error notifications
- Keyboard shortcuts (Enter to search)
- Responsive design for all screen sizes

### 📱 Browser Compatibility

Works on all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 🔒 Privacy & Data

- No user data is sent to external servers except the game API
- Query history is stored locally in your browser
- API requests include only the necessary UID and authentication data

---

<a name="中文"></a>
## 🌐 WOS UID 查询工具 (中文)

用于查询游戏"寒霜启示录"玩家信息的网页工具，通过UID获取玩家数据。

### 🌐 在线使用地址
[https://wuwiwo.github.io/wos-uid/](https://wuwiwo.github.io/wos-uid/)

### ✨ 功能特点

- **玩家信息查询**: 通过输入UID查询玩家详细信息
- **完整数据展示**:
  - 玩家昵称和UID
  - 熔炉等级（包含特殊等级映射）
  - 州/地区信息
  - 玩家头像
  - 最后更新时间
- **查询历史**: 自动保存最近查询记录，支持快速访问
- **一键复制**: 任意信息均可一键复制到剪贴板
- **响应式设计**: 完美支持桌面和移动设备
- **重试机制**: API请求失败时自动重试

### 🚀 快速开始

1. **打开工具**: 访问 [https://wuwiwo.github.io/wos-uid/](https://wuwiwo.github.io/wos-uid/)
2. **输入UID**: 在搜索框中输入玩家UID（例如：`251097717`）
3. **查询**: 点击查询按钮或按Enter键
4. **查看结果**: 玩家信息将显示在下方

### 🛠️ 技术细节

#### 文件结构
- `index.html` - 主HTML文件
- `index.css` - 样式表
- `index.js` - JavaScript功能

#### API集成
- **接口地址**: `https://wos-giftcode-api.centurygame.com/api/player`
- **认证方式**: 基于MD5的时间戳签名
- **请求方法**: POST表单数据
- **响应格式**: JSON

#### 核心功能
- `fetchPlayerData(uid)` - 主要的API调用函数，包含重试逻辑
- `displayResult(data)` - 渲染玩家信息
- `addToHistory(data)` - 管理查询历史
- `generateMD5(str)` - 生成API签名

### 🌟 特色功能

#### 熔炉等级映射
工具包含完整的熔炉等级映射系统，30级以上的等级会显示特殊名称如"FC 1"、"FC 2"等。

#### 历史记录管理
- 最多保存20条最近查询记录
- 使用localStorage持久化存储
- 支持快速查看和删除

#### 用户体验
- API调用时的加载指示器
- 成功/错误通知提示
- 键盘快捷键（Enter键查询）
- 全屏幕尺寸的响应式设计

### 📱 浏览器兼容性

支持所有现代浏览器包括：
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 🔒 隐私与数据

- 除游戏API外，不向外部服务器发送任何用户数据
- 查询历史仅存储在本地浏览器中
- API请求仅包含必要的UID和认证数据

