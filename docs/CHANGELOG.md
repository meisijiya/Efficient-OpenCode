# Changelog

All notable changes to Efficient-OpenCode will be documented in this file.

## [1.1.0] - 2026-05-30

### 🆕 Added

- **`eoc.js` 配置切换器**（~1700 行 Node.js，零 npm 依赖）
  - 方向键 ↑↓ 交互菜单 + 命令行参数双模式
  - `install` / `switch` / `status` / `rollback` 四大命令
  - 智能入口：首次自动引导安装，已安装进入切换菜单
  - 项目级配置支持（`./.opencode/`），全局/项目级双层级管理
  - 全局命令设置：一键写入 `.bashrc`，任意目录 `eoc` 直达
  - 自动备份：时间戳命名 + 内容去重 + 保留 10 份
  - 模型 ID 指纹检测：3 层降级（完全匹配/部分匹配/未知）
  - 模板切换内联填 ID：菜单内直接输入模型 ID，含 `/connect` 提醒
  - 备用屏幕缓冲区渲染（零重影）+ CJK 显示宽度精准计算

- **Template2 双引擎配置** (`oh-my-openagent-template2.json`)
  - 仅需 `__PRO_MODEL__` 和 `__FAST_MODEL__` 两个占位符
  - Exec/Fallback 硬编码为 MiniMax M2.7，multimodal-looker 为 `opencode-go/mimo-v2.5`

- **4 个 Prompt 覆盖模式配置** (`*-prompt.json`)
  - 完全替换官方系统提示，适合进阶用户

- **纯 MiniMax M2.7 单引擎配置**

### 🔧 Changed

- **agent-browser 从 MCP 改为 Skill**：agent-browser 是 CLI 工具而非 MCP Server，移除 MCP 配置，新增 `skills/agent-browser/SKILL.md` 供 OpenCode 加载
- 所有 8 个配置文件中 multimodal-looker 模型统一为 `opencode-go/mimo-v2.5`
- `install.sh` 升级：模型引擎 4 选 1 + Prompt 注入模式 2 选 1
- description/prompt_append 字段优化：description 精简到 <120 字符

### 🐛 Fixed

- 菜单重影/下移问题（换用 alternate screen buffer）
- CJK 中文字符导致边框错位（新增 `displayWidth()` 函数）
- 空 catch 块吞错误（备份/清理失败现在会打印 warning）
- OpenCode 版本检测失败时打印 "undefined"
- PATH 检测过于宽松导致误判

## [1.0.0] - 2026-05-27

### Added
- 初始版本：DeepSeek V4 Pro + MiniMax M2.7 双引擎配置
- compaction 上下文压缩配置
- Sisyphus 强制委托规则
- EasyVision 图片拦截插件集成
- Karpathy 四原则全局执行宪法
- OhMyOpenAgent 多智能体配置（11 agents + 14 categories）
