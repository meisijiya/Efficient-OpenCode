---
name: agent-browser
description: >
  Vercel Labs agent-browser CLI — AI 驱动的浏览器自动化工具。触发时机：用户提到"浏览器"、"截图"、"填表单"、
  "打开网页"、"agent-browser"、"爬取页面"、"自动浏览"、"网页测试"，或者需要在浏览器中执行自动化操作时。
---

# 🌐 agent-browser — AI 浏览器自动化 CLI

> 仓库：https://github.com/vercel-labs/agent-browser
> 版本：v0.27.0 | 语言：Rust 原生 | 安装：`npm i -g agent-browser && agent-browser install`

agent-browser 是 Vercel Labs 开发的**原生 CLI 工具**（非 MCP Server），专为 AI Agent 设计，通过命令行驱动浏览器。

---

## 📦 安装

```bash
npm install -g agent-browser
agent-browser install    # 安装 Chrome（如未检测到）
```

> WSL2 用户如 Chrome 自动安装失败，需手动指定路径：
> ```bash
> export AGENT_BROWSER_EXECUTABLE_PATH="~/.agent-browser/chrome-install/opt/google/chrome/google-chrome"
> ```

---

## 🏗️ 核心设计理念：`@eN` 快照模式

agent-browser 的核心哲学是**无障碍树快照 + 元素引用**，而非直接操作 DOM：

```
snapshot 命令 → 返回无障碍树（200-400 token，极省）
每个元素有 @eN 编号 → 后续交互用 @eN 引用
click @e3, fill @e5, type @e7 等
```

对比传统 DOM 抓取（15K+ token），节省 **~98%** token 消耗。

---

## 🚀 常用命令速查

### 导航 & 快照

```bash
agent-browser open "https://example.com"      # 打开网页
agent-browser snapshot -i                     # 获取无障碍树快照（-i 含元素编号）
agent-browser snapshot --full                 # 全页快照
agent-browser close                           # 关闭浏览器
```

### 交互操作

```bash
agent-browser click @e3                       # 点击 @e3 元素
agent-browser click "button.submit"           # CSS 选择器点击
agent-browser fill @e5 "hello@email.com"      # 填入文本
agent-browser type @e7 "搜索内容"              # 键入（不清空现有内容）
agent-browser press Enter                     # 按键
agent-browser select @e8 "选项值"             # 下拉选择
agent-browser check @e9                       # 勾选复选框
agent-browser hover @e10                      # 悬停
agent-browser scroll down 300                 # 滚动
agent-browser upload @e11 "./file.pdf"        # 上传文件
```

### 获取信息

```bash
agent-browser get text @e3                    # 获取文本
agent-browser get value @e5                   # 获取输入值
agent-browser get title                       # 页面标题
agent-browser get url                         # 当前 URL
agent-browser get count "div.card"            # 元素数量
```

### 截图 & 导出

```bash
agent-browser screenshot                      # 可视区域截图
agent-browser screenshot --full               # 全页截图
agent-browser screenshot --annotate           # 标注元素编号
agent-browser pdf output.pdf                  # 导出 PDF
```

### 等待

```bash
agent-browser wait "div.result"               # 等待元素出现
agent-browser wait 2000                       # 等待 2 秒
agent-browser wait --text "Success"           # 等待文本出现
agent-browser wait --load networkidle         # 等待网络空闲
```

### JavaScript

```bash
agent-browser eval "document.title"           # 执行 JS 并返回结果
agent-browser eval "window.scrollTo(0, 1000)" # JS 滚动
```

### 语义查找（无需先快照）

```bash
agent-browser find text "登录" click          # 查找文本并点击
agent-browser find role button click          # 查找按钮并点击
agent-browser find label "邮箱" fill "a@b.c"  # 按标签填表
agent-browser find placeholder "搜索" type "hello" # 按占位符输入
```

---

## 🎯 AI Agent 使用模式

### 标准工作流

```bash
# 1. 打开目标页面
agent-browser open "https://example.com/login"

# 2. 获取快照，识别元素
agent-browser snapshot -i
# 输出:
# @e1 link "首页"
# @e2 textbox "邮箱"       ← 记住这个 @e2
# @e3 textbox "密码"       ← 记住这个 @e3
# @e4 button "登录"        ← 记住这个 @e4

# 3. 操作元素
agent-browser fill @e2 "user@example.com"
agent-browser fill @e3 "password123"
agent-browser click @e4

# 4. 等待响应并确认
agent-browser wait --load networkidle
agent-browser snapshot -i    # 确认到达目标页面
agent-browser screenshot     # 可选的视觉确认
```

### 批量操作

```bash
agent-browser batch \
  "open https://example.com" \
  "snapshot -i" \
  "click @e4"
```

### 多标签页

```bash
agent-browser open "https://a.com"      # 标签页 t1
agent-browser open "https://b.com" --new-tab  # 标签页 t2
agent-browser click @e5 --new-tab       # 点击在新标签页打开
```

---

## 🔧 高级功能

| 功能 | 命令示例 |
|:---|:---|
| **会话隔离** | `agent-browser open URL --session mysession` |
| **视频录制** | `agent-browser record start` / `stop` |
| **前后对比** | `agent-browser diff snapshot`, `diff screenshot` |
| **网络 Mock** | `agent-browser network mock` |
| **设备模拟** | agent-browser 自动检测 Chrome User-Agent |
| **Cookie 操作** | `agent-browser cookie set/get/clear` |

---

## ⚠️ 重要提示

1. **agent-browser 是 CLI 工具，不是 MCP Server**——你通过 `bash` 工具执行 `agent-browser <cmd>` 命令
2. 每次交互后建议再做一次 `snapshot -i`，因为页面 DOM 可能已变化
3. 截图使用 `--annotate` 可以在图片上标注元素编号，帮助视觉定位
4. 遇到复杂表单，优先用 `find` 命令的语义查找，减少 `snapshot` 次数
5. WSL2 环境需确保 Chrome 已正确安装，必要时设置 `AGENT_BROWSER_EXECUTABLE_PATH`
