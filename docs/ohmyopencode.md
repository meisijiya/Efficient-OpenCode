---
title: OhMyOpenCode 使用指南：多智能体协作开发的终极武器
tags:
  - AI
  - OpenCode
  - OhMyOpenCode
  - 多智能体
  - 开发工具
categories:
  - AI开发
date: 2026-05-13 13:40:00
description: 详细介绍 OhMyOpenCode 的安装、配置和使用方法，将单个 AI 助手升级为多智能体协作的开发团队。
---

*Hi，我是 **meisijiya** ，也是 **老江湖** ，感谢你的阅读，我们一起进步。*

---

# OhMyOpenCode 使用指南：多智能体协作开发的终极武器

## 一、OhMyOpenCode 是什么？

**OhMyOpenCode**（简称 OMO）是 OpenCode 的增强插件，核心理念是**将单个 AI 助手升级为多智能体协作的开发团队**。它受 `oh-my-zsh` 启发，通过插件化机制为 OpenCode 注入多代理编排能力。

### 核心特性

| 特性 | 说明 |
|------|------|
| 多模型协作 | 可同时调用多个 AI 模型协同工作 |
| 智能体系统 | 内置多个专业 Agent，各司其职 |
| 提示词优化 | 自动优化给 AI 的指令 |
| 后台任务管理 | 支持并行执行多个任务 |
| Skills 系统 | 可扩展的技能模块 |

## 二、核心智能体架构

OhMyOpenCode 的核心是多个专业智能体协作：

| 智能体 | 角色 | 职责 |
|--------|------|------|
| **Sisyphus** | 主编排器 | 任务调度、代码生成、质量控制 |
| **Oracle** | 架构师 | 复杂架构设计、调试难题、高质量推理 |
| **Librarian** | 代码库专家 | 代码库分析、文档检索、知识查询 |
| **Atlas** | 执行编排大师 | 执行 Prometheus 的计划 |
| **Prometheus** | 需求澄清 | 战略规划、需求访谈 |
| **Hephaestus** | 行为指令 | 执行具体任务 |

### 智能体协作流程

```
用户需求 → Prometheus（需求澄清）→ Atlas（执行编排）→ Sisyphus（调度执行）→ Hephaestus（写代码）
                                                    ↓
                                            Oracle（架构咨询）
                                            Librarian（代码库分析）
```

#### 💡 实际例子
**你说：** `实现用户认证系统`

1. **Prometheus** 会问：
   - 用什么认证方式？JWT？OAuth？
   - 需要支持多租户吗？
   - 数据库是什么？
2. **Atlas** 会拆解：
   - 任务1：设计数据库表结构
   - 任务2：实现注册/登录 API
   - 任务3：实现 JWT 签发/验证
   - 任务4：添加权限中间件
3. **Sisyphus** 会调度：
   - 并行分配任务给多个 Agent
4. **Hephaestus** 会执行：
   - 具体写每个模块的代码

#### 🎯 简单记忆

| Agent      | 一句话     |
| ---------- | ---------- |
| Prometheus | 问你要什么 |
| Atlas      | 拆成小任务 |
| Sisyphus   | 指挥谁来干 |
| Hephaestus | 动手写代码 |

### 角色分类：

![img](https://pica.zhimg.com/v2-4ebd71748fa06f7adbc5d661faf2da4e_1440w.jpg)

#### 1. **核心调度与战略规划** (Orchestrator & Strategist)

- **sisyphus**：主调度器，负责任务分配和流程控制。
- **prometheus**：战略规划师，负责顶层设计和任务拆解。

#### 2. **深度编码与执行** (Deep Coding & Execution)

- **hephaestus**：深度工作者，负责复杂编码和长时间任务。
- **atlas**：计划执行者，按计划落地实现。
- **sisyphus-junior**：轻量辅助执行，处理脚本或小任务。

#### 3. **审查、顾问与复盘** (Review, Advisory & Analysis)

- **oracle**：架构顾问，提供技术决策和方案建议。
- **momus**：严苛审查员，负责代码/设计审查，挑错和验证。
- **metis**：缺口分析专家，识别未覆盖的需求或风险。

#### 4. **探索与信息检索** (Exploration & Retrieval)

- **explore**：代码勘探者，快速扫描项目结构和依赖。
- **librarian**：图书管理员，搜索文档、API 引用和示例。

#### 5. **多模态感知** (Multimodal Perception)

- **multimodal-looker**：视觉分析师，处理图像、UI 截图或图表。

## 三、安装与配置

### 3.1 前置条件

- ✅ OpenCode 已安装并配置完成
- ✅ Node.js v18+ 或 Bun v1.0+
- ✅ Git 已初始化项目仓库
- ✅ 至少一个 LLM Provider 的 API Key（推荐：Claude / Kimi / GLM）

### 3.2 安装方法

#### 方法 1：使用 Bun（推荐）

```bash
# 安装 oh-my-opencode 插件
bunx oh-my-opencode install
```

#### 方法 2：使用 npm

```bash
# 全局安装
npm install -g oh-my-opencode
```

#### 方法 3：通过 OpenCode 安装

在 OpenCode 对话中输入：

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/refs/heads/dev/docs/guide/installation.md
```

### 3.3 验证安装

```bash
# 启动 OpenCode
opencode

# 在对话中输入测试命令
/omoc-status

# 或尝试 ultrawork 关键词触发
ulw say hello
```

### 3.4 配置文件位置

| 配置类型 | 路径 | 说明 |
|----------|------|------|
| 用户全局配置 | `~/.config/opencode/oh-my-opencode.jsonc` | 所有项目通用 |
| 项目配置 | `./.opencode/oh-my-opencode.jsonc` | 当前项目专用 |
| OpenCode 主配置 | `~/.config/opencode/opencode.json` | 插件注册位置 |

### 3.5 配置文件示例

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json",

  // 自定义 Agent 模型
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-7"
    },
    "oracle": {
      "model": "openai/gpt-5.4",
      "variant": "high"
    },
    "librarian": {
      "model": "google/gemini-3-flash"
    }
  },

  // 自定义任务类别模型
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3.1-pro",
      "variant": "high"
    },
    "quick": {
      "model": "openai/gpt-5-nano"
    }
  },

  // Skills 配置
  "skills": {
    "frontend-ui-ux": {
      "description": "精通 React、Tailwind、Framer Motion",
      "enabled": true
    },
    "git-master": {
      "description": "精通 Git workflow、commit 规范",
      "enabled": true
    },
    "systematic-debugging": {
      "description": "系统化调试、测试驱动开发",
      "enabled": true
    }
  }
}
```

### 3.6 我的配置心得

我们如果选择自己手动配置，那么可能会遇到什么角色需要什么模型以及模型名称怎么填。

对于第一个问题，角色如何搭配大模型，你只需要将你有的或者你想用的给到AI去让他帮你网上搜索资料看看哪个模型的能力能够配得上这个角色的。

我们拿DeepSeekV4模型举例，他有DeepSeekV4Flash和V4Pro，DeepSeekV4Pro可以用作规划，DeepSeekV4Flash则用于写代码。

模型名称的查看可以在你opencode连接了（/connect）模型厂商后，如果是wsl，则在用户目录下的`.cache/oh-my-opencode/provider-models.json`查看模型厂商和模型名，这样就不会填错，然后填完配置，记得重启opencode，就可以看到连接上了。我让AI配了一个配置，仅供参考：

我订阅了opencode-go，以及氪了MiniMax的套餐还附带了多个功能。需搭配MiniMax官方的CLI。

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "🎯 主智能体——任务拆解与多智能体编排。负责将复杂需求拆分为可并行执行的子任务，委托给最合适的子智能体（Atlas执行、Oracle顾问、Explore探索等），在质量把控层面做最终决策。可利用Skills技能库快速生成专业代码框架，通过MiniMax MCP的web_search获取最新实践。"
    },
    "hephaestus": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "🔥 攻坚智能体——当Oracle诊断出根因后、需要高强度编码攻坚时介入。处理其他智能体反复失败的高难度Bug、深层重构、跨模块架构改动。Pro的强推理能力确保一击必中，不下修修补补的补丁。"
    },
    "prometheus": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "📐 规划师智能体——负责制定详细、可执行、可验证的工作计划。将模糊需求转化为分步骤的工程任务，标注依赖关系和并行机会。可将Skills技能库作为任务拆分的参考模板，确保每个子任务有明确的验收标准。"
    },
    "metis": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "📚 长上下文分析专家——利用1M上下文窗口进行全库深度分析。适合：大型代码库架构审查、跨模块依赖追踪、长文档（PRD/ADR）综合评审。可一次性消化整个仓库的结构和模式，输出全局视角的洞察。"
    },
    "oracle": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "🔮 只读顾问智能体——不写代码、不做决策、仅提供分析建议。何时调用：① 多系统架构权衡（如微服务 vs 单体）；② 2次以上调试失败后的根因分析；③ 陌生代码模式的安全/性能审查；④ 技术选型对比评估。Pro的最强推理模式专为此类深度思考场景设计。"
    },
    "explore": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "🔍 极速代码探索——闪电级文件搜索、模式匹配、代码库结构发现。Flash模型成本最低、速度最快。适用场景：查找特定实现、追踪调用链、扫描代码模式。还可利用MiniMax MCP的web_search查找外部开源代码参考。"
    },
    "librarian": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "📖 文档与外部参考查询——Flash模型低成本和快速响应，专门处理简单明确的查询。适用场景：查阅官方API文档、搜索npm/pip包用法、查找开源实现示例。可使用MiniMax MCP的web_search工具检索最新文档和最佳实践。"
    },
    "sisyphus-junior": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "👶 Sisyphus得力助手——处理明确、单一、重复性的子任务。适合：修Lint错误、更新依赖版本、批量重命名、简单格式调整。接收Sisyphus的明确指令执行，不自行决策。Flash的低成本适合大量微小任务。"
    },
    "multimodal-looker": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "description": "👁️ 核心视觉分析智能体——使用MiniMax MCP的understand_image工具进行图片内容分析、OCR文字识别、UI界面审查、图表数据提取。结合Skills中的vision-analysis技能，可输出结构化的视觉分析报告。不用于图片生成（那是atlas/image-generation的领域）。"
    },
    "atlas": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "🚀 执行智能体——M2.7在Agent任务执行上表现出色，Pro提供推理兜底。集MiniMax全模态生产管线于一身：可通过CLI调用视频(Hailuo)、语音(Speech)、音乐(Music)、图片(Image)生成，通过MCP的understand_image做视觉分析，通过web_search做资料检索。结合Skills（前端/全栈/移动端/文档生成）快速交付生产级代码与资源。"
    },
    "momus": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "🔎 代码审查与批评智能体——提供不同视角的严格审查意见，不为礼貌牺牲质量。审查时利用MiniMax MCP的web_search工具获取最新最佳实践和业界解决方案作为参照基准，给出有据可查的改进建议。适合在PR提交前、重大重构后、或需要第三方视角时调用。"
    }
  },
  "categories": {
    "visual-engineering": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "前端、UI、动画、图片生成。使用MiniMax CLI进行视觉内容生成，结合Skills中的frontend-dev技能获取电影级动画（Framer Motion、GSAP）和媒体资源生成指导。"
    },
    "multimodal": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "视频、语音、音乐、图片生成与理解。通过MiniMax CLI一站式调用Hailuo视频生成、Speech语音合成、Music音乐创作、Image图片生成等全模态能力。"
    },
    "video-generation": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "Hailuo 2.3 视频生成。通过MiniMax CLI的视频生成命令，直接从文本描述生成高质量视频内容。"
    },
    "speech-synthesis": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "Speech 2.8 语音合成。使用MiniMax CLI的语音合成命令，将文本转换为自然流畅的语音，支持声音克隆和多段合成。"
    },
    "music-composition": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "Music 2.6 音乐创作。使用MiniMax CLI的音乐生成命令，根据描述生成原创歌曲或纯音乐。"
    },
    "image-generation": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "Image 01 图片生成。使用MiniMax CLI的图片生成命令，从文本描述生成高质量图片。"
    },
    "vision-analysis": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "视觉理解、OCR文字识别、图像分析。使用MiniMax MCP的understand_image工具进行图片理解与分析，结合vision-analysis技能输出结构化结果。适用：截图分析、UI审查、图表数据提取、照片内容描述。"
    },
    "web-research": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7", "opencode-go/deepseek-v4-pro"],
      "description": "🌐 上网搜索与资料查找——使用MiniMax MCP的web_search工具检索实时信息、最新文档、技术方案。Flash速度快成本低，适合信息收集类任务；复杂分析时fallback到Pro。适用：查API文档、找开源实现、调研技术方案、获取最新实践。"
    },
    "quick": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "快速修复、简单任务，Flash成本最低。适用：单文件typo、简单配置修改、明确的小改动。"
    },
    "deep": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "自主深度研究——目标驱动的端到端问题解决。适用：需要自主探索、多步推理、跨文件实现的复杂研究型任务。Pro的强推理能力确保深度分析的准确性。"
    },
    "artistry": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": ["opencode-go/deepseek-v4-pro"],
      "description": "创意突破——超越常规模式，用非传统、创新性方法解决复杂问题。M2.7的创造性思维适合跳出框架的解决方案。"
    },
    "ultrabrain": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "硬核推理——仅用于真正困难、逻辑密集型任务。给明确目标而非分步指令，让Pro自行推理最优路径。适用：复杂算法设计、深层架构决策、多系统协同难题。"
    },
    "unspecified-low": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "未分类低难度任务——不属于特定类别但工作量小的通用任务。Flash的低成本适合此类场景。"
    },
    "unspecified-high": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "未分类高难度任务——不属于特定类别但需要强推理能力的通用任务。Pro的深度思考能力确保输出质量。"
    },
    "writing": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": ["minimax-cn-coding-plan/MiniMax-M2.7"],
      "description": "文档与写作——技术文档、设计说明、API文档、Release Notes等专业技术写作任务。Pro的语感和逻辑性确保文档清晰准确。"
    }
  }
}

```

## 四、常用命令与快捷键

### 4.1 核心命令

| 命令 | 功能 | 示例 |
|------|------|------|
| `/init-deep` | 深度初始化，生成层级 `AGENTS.md` 文件 | `/init-deep` |
| `/start-work` | 调用 Prometheus 进行战略规划 | `/start-work 重构用户模块` |
| `/ulw-loop` | 启动 Ralph Loop 自循环模式 | `/ulw-loop 修复所有测试` |
| `ulw` 或 `ultrawork` | 一键全自动开发模式 | `ulw 添加用户认证功能` |
| `/refactor` | 智能重构（LSP + AST 感知） | `/refactor` |
| `/review` | 代码审查 | `/review` |
| `/handoff` | 生成会话上下文，方便切换设备继续 | `/handoff` |
| `/omoc-status` | 显示插件状态和配置 | `/omoc-status` |
| `/skills` | 列出可用 Skills | `/skills` |
| `/agents` | 列出可用 Agents 及状态 | `/agents` |

### 4.2 快捷键

| 快捷键 | 操作 | 说明 |
|--------|------|------|
| `Enter` | 发送消息 | 发送当前输入 |
| `Shift+Enter` | 换行 | 在输入框中添加新行 |
| `Tab` | 切换 Agent | 循环切换主要 Agent |
| `Shift+Tab` | 反向切换 | 反向循环切换 Agent |
| `Escape` | 中断 | 停止当前 AI 响应 |
| `Ctrl+C` | 清除输入 | 清空输入框内容 |
| `Ctrl+D` | 退出 | 关闭 OpenCode |
| `Ctrl+P` | 命令面板 | 打开命令列表 |

### 4.3 Leader Key 操作

默认 Leader Key：`Ctrl+X`

可以`ctrl+p`打开命令面板

| 快捷键 | 操作 | 说明 |
|--------|------|------|
| `Ctrl+X` → `n` | 新建会话 | 相当于 /new |
| `Ctrl+X` → `l` | 会话列表 | 相当于 /sessions |
| `Ctrl+X` → `m` | 模型列表 | 相当于 /models |
| `Ctrl+X` → `e` | 打开编辑器 | 打开文件编辑器 |
| `Ctrl+X` → `t` | 主题列表 | 切换主题 |
| `Ctrl+X` → `b` | 侧边栏 | 切换侧边栏显示 |
| `Ctrl+X` → `s` | 状态视图 | 查看状态信息 |
| `Ctrl+X` → `x` | 导出会话 | 导出当前会话 |

## 五、典型工作流程

### 5.1 场景 1：新功能开发

```bash
# 1. 启动 opencode
opencode

# 2. 与 Prometheus 对话，明确需求
> /planning-mode
> 我要实现一个用户认证系统

# 3. Prometheus 会问：
> 使用什么认证方式？JWT? OAuth? Session?
> 需要支持多租户吗？
> 数据库是什么？

# 4. 计划确认后
> /start-work

# 5. Atlas 自动编排执行
# 你会看到多个子代理并行工作
```

### 5.2 场景 2：高强度重构

```bash
# 启动 Ultrawork 模式
/ulw-loop

# 代理会：
# - 更主动地拆分任务
# - 自动验证每个步骤
# - 不会因为小问题停顿
```

### 5.3 场景 3：简单 Bug 修复

```bash
# 直接用标准模式
opencode

# 描述问题
> 用户反馈登录时偶尔失败

# Sisyphus 会：
# - 快速定位问题
# - 修复后验证
```

### 5.4 场景 4：排查复杂 Bug

```bash
# 使用 @oracle 手动调用 Oracle 代理
> @oracle 分析这个内存泄漏问题

# Oracle 会：
# - 深入分析代码
# - 提供架构级别的建议
# - 识别潜在的根因
```

## 六、高级功能

### 6.1 Ralph Loop 自我循环

Ralph Loop 是一种自主无限迭代循环模式，AI 会反复执行任务 → 自检 → 修复 → 再执行，直到满足完成条件。

```bash
# 触发格式
/ralph-loop "任务描述" --max-iterations N --completion-promise "停止条件"

# 示例
/ralph-loop "修复所有单元测试" --max-iterations 20 --completion-promise "所有测试通过"
```

### 6.2 UltraWork 模式

在提示词中加入 `ulw`（或 `ultrawork`），OMO 会自动激活全部增强功能：

- 多代理并行（oracle 规划 → librarian 分析现有代码 → 专业角色实现）
- 深度工具链（LSP 静态分析、AST 解析、MCP 多文件上下文）
- 子任务智能拆分与调度
- 自动验证与迭代

```bash
# 示例
ulw 请实现用户认证系统：注册、登录、JWT、刷新令牌、权限控制，集成到现有 Express 项目。
```

### 6.3 智能重构

```bash
# 使用 /refactor 命令
/refactor

# 或指定重构范围
ulw 重构 src/utils 目录下的所有工具函数，提取公共逻辑
```

### 6.4 代码审查

```bash
# 使用 /review 命令
/review

# 或指定审查范围
ulw 审查 src/api 目录下的所有接口，检查安全性问题
```

## 七、最佳实践

### 7.1 充分利用 Prometheus 的访谈

复杂需求先让 Prometheus 问清楚再执行：

```bash
> /planning-mode
> 我要实现一个支付系统

# 让 Prometheus 问清楚：
# - 支付方式？支付宝/微信/银行卡？
# - 需要支持退款吗？
# - 国际支付需求？
# - 合规要求？
```

### 7.2 善用项目级配置

不同项目用不同模型和技能：

```bash
# 进入项目目录
cd /path/to/project

# 创建项目级配置
mkdir -p .opencode
cat > .opencode/oh-my-opencode.jsonc << EOF
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-sonnet-4-5"
    }
  },
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro"
    }
  }
}
EOF
```

### 7.3 关注社区经验

- **GitHub Issues**：https://github.com/code-yeongyu/oh-my-opencode/issues
- **Discord 社区**：获取最新动态和技术支持
- **掘金、博客园**：搜索 "OhMyOpenCode" 获取中文教程

### 7.4 分层使用策略

| 任务类型 | 推荐方式 |
|----------|----------|
| 小改动 | 普通提示 |
| 中大型功能 | `ulw` + 明确角色分配 |
| 追求极致/大重构 | `ulw` + `ralph-loop` + 精准 completion-promise |

## 八、常见问题

### Q: 需要哪些 API Key？

至少需要 Claude Pro/Max 订阅（强烈推荐）。可选：OpenAI、Google Gemini、GLM 等。

### Q: 如何切换模型？

```bash
# 编辑配置文件
~/.config/opencode/oh-my-opencode.jsonc

# 或使用命令
/models
```

### Q: 安装失败怎么办？

```bash
# 确保 Node.js 18+ 或 Bun 1.0+
node --version
bun --version

# 检查 OpenCode 是否已安装
opencode --version

# 检查插件是否正确安装
cat ~/.config/opencode/opencode.json | grep "oh-my-opencode"
```

### Q: 如何升级到最新版本？

```bash
# 使用 bun
bunx oh-my-opencode install

# 使用 npm
npm update -g oh-my-opencode
```

### Q: 没有 Claude 订阅怎么办？

如果只有 OpenAI/ChatGPT 订阅，需要在配置中手动指定 Sisyphus 使用 OpenAI 模型：

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "openai/gpt-4"
    }
  }
}
```

## 九、实战案例

### 案例 1：快速实现用户认证

```bash
ulw 实现用户认证系统：注册、登录、JWT、刷新令牌、权限控制，集成到现有 Express 项目。
```

### 案例 2：前端组件开发

```bash
ulw 创建一个响应式导航栏组件，支持移动端适配，使用 React + Tailwind CSS。
```

### 案例 3：数据库优化

```bash
@oracle 分析当前数据库查询性能，提供优化建议。
```

### 案例 4：测试覆盖率提升

```bash
ulw 为 src/services 目录下的所有服务添加单元测试，覆盖率提升到 80%。
```

### 案例 5：一键部署配置

```bash
ulw 配置 GitHub Actions 自动部署，包括测试、构建、部署到 Vercel。
```

## 十、学习资源

### 官方资源

- **官方文档**：https://opencode.ai/docs/
- **GitHub 仓库**：https://github.com/code-yeongyu/oh-my-opencode
- **中文配置教程**：https://didee.cn/opencode-config/

### 中文教程

- **掘金**：搜索 "OhMyOpenCode" 获取详细教程
- **博客园**：搜索 "Oh My OpenCode" 获取实战经验
- **知乎**：搜索 "oh-my-opencode" 获取深度解析

### 社区支持

- **Discord 社区**：获取最新动态和技术支持
- **GitHub Issues**：报告问题和获取帮助

## 十一、总结

> **OhMyOpenCode 不是简单的"AI 生成器"，它是一个可编排、多智能体执行平台。掌握 MCP 配置、智能体角色和任务拆解后，你可以在 OpenCode 生态中完成高度自动化的开发任务。**

### 核心要点

1. **理解智能体架构**：Sisyphus、Oracle、Librarian、Atlas、Prometheus 各司其职
2. **善用命令系统**：`ulw`、`/start-work`、`/ulw-loop` 是你的核心武器
3. **配置优化**：根据项目需求调整模型和技能配置
4. **分层策略**：小任务用普通提示，大任务用多代理协作

### 终极建议

当你不确定如何实现某个功能时，试试：

```bash
ulw [你的需求]
```

让 OhMyOpenCode 的智能协作系统为你找到最佳解决方案！🚀

---

**参考来源**：
- OhMyOpenCode 官方文档
- 掘金技术博客
- 博客园技术文章
- 社区实践经验
