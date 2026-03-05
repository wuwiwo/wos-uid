# ❄️ WOS UID 查询工具 / WOS UID Query Tool

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## 🌐 WOS UID Query Tool (English)

A professional, modular web-based tool for querying player information in the game "Whiteout Survival" (寒霜启示录). Now powered by Vercel for a seamless, bypass-restricted experience.

### 🚀 Quick Start
1. **Access**: [https://wos-uid.vercel.app/](https://wos-uid.vercel.app/)
2. **Search**: Enter a UID (e.g., `251097717`) and press Enter.
3. **History**: Your last 20 queries are saved locally for instant access.

### 🛠️ Technical Details
- **Architecture**: Decoupled Frontend (Vanilla JS) + Backend Proxy (Node.js Serverless).
- **Security**: Securely handles `API_SECRET` and signatures on the server side to prevent credential exposure.
- **Data Handling**: Robust type checking for `stove_lv_content` to ensure smooth rendering of furnace icons.
- **Stability**: Fully resolves CORS and "Unauthorized request" errors by spoofing Referer/Origin headers.

### 📜 Change Log (Cumulative)
- **v1.5.0 (Current)**:
    - **Vercel Migration**: Moved from GitHub Pages to Vercel to resolve API domain blockages.
    - **Serverless Integration**: Added `/api/player.js` to handle backend-side API requests.
    - **Input Fix**: Resolved desktop focus issues where background elements blocked input clicks.
- **v1.4.0**:
    - **UI Optimization**: Enhanced Glassmorphism design and mobile responsiveness.
    - **Error Handling**: Improved timeout management and user notifications.
- **v1.3.0**:
    - **Modular Architecture**: Decoupled core logic from translations (`i18n.js`).
    - **Multi-language**: Added support for English, Chinese, Japanese, Korean, and Arabic.
    - **RTL Support**: Full UI compatibility for Right-to-Left languages.

---

<a name="中文"></a>
## 🌐 WOS UID 查询工具 (中文)

专为《寒霜启示录》(Whiteout Survival) 玩家设计的专业信息查询工具。已升级至 Vercel 架构，彻底解决官方接口封锁问题。

### 🌐 在线地址
[https://wos-uid.vercel.app/](https://wos-uid.vercel.app/)

### ✨ 核心功能
- **全接口适配**: 针对官方最新补丁重构，通过后端云函数完美解决 `Unauthorized request` 权限错误。
- **深度数据解析**: 完美解析熔炉等级（支持 30 级后的 FC 等级映射）。
- **全语种支持**: 智能识别浏览器语言，支持简/繁、英、日、韩、阿等主流语种。
- **极致体验**: 记录最近 20 条查询历史，支持一键复制 UID。

### 🛠️ 技术细节
- **文件结构**:
  - `index.html`: 主入口。
  - `api/player.js`: **(核心)** Vercel 后端函数，处理 API 转发与 MD5 签名。
  - `index.js`: 前端逻辑，负责 DOM 调度与数据展示。
  - `i18n.js`: 国际化文本配置中心。
- **安全性**: 采用 `API_SECRET` 后端签名机制，避免敏感信息泄露。

### 📜 更新日志 (历史叠加)
- **v1.5.0 (当前版本)**:
    - **架构升级**: 从 GitHub Pages 迁移至 Vercel，使用 Serverless 处理跨域请求。
    - **权限修复**: 通过后端伪装 `Referer` 绕过官方 v1.4.2 接口校验。
    - **UI 修复**: 解决了电脑端背景光斑遮挡输入框、导致无法点击的 Bug。
- **v1.4.0**:
    - **稳定性增强**: 修复了 `stove_lv_content` 为空时导致的脚本报错。
    - **性能优化**: 增加了 API 请求缓存（5 分钟有效期）和搜索节流。
- **v1.3.0**:
    - **国际化**: 实现多语言支持，包括阿拉伯语的 RTL（从右至左）布局适配。
    - **历史记录**: 增加本地持久化存储，支持最近查询记录的一键直达。

---
*Disclaimer: This tool is for educational and community use only. All game data is property of Century Games.*
