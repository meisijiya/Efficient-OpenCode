---
title: OpenCode + OhMyOpenAgent Skill 必装合集 — DeepSeek v4 × MiniMax M2.7 双引擎效率革命
tags:
  - OpenCode
  - OhMyOpenAgent
  - Skill
  - DeepSeek v4
  - MiniMax M2.7
  - AI 编程
  - 多智能体
  - 效率工具
author: 老江湖
categories:
  - AI 开发
date: 2026-05-19 13:43:00
description: 深度解析 OhMyOpenAgent 的 11 智能体架构 + 14 任务分类路由 + 28 Skill 生态的完整协作体系。面向 DeepSeek v4 Pro（推理）与 MiniMax M2.7（执行/多模态）双引擎程序员，以及mimov2.5原生多模态，覆盖架构原理、Skill 分级推荐与场景化实战指南。
---

*Hi，我是 **meisijiya** ，也是 **老江湖** ，感谢你的阅读，我们一起进步。*

---

## 📌 前言：不只是 Skill，是一套完整的 Agent 操作系统

很多人以为 OpenCode 只是一个"AI 写代码工具"——装上 Skill 让它更会写代码。但当你装上 **OhMyOpenAgent** 插件后，事情完全变了。

OhMyOpenAgent 把 OpenCode 变成了一个 **多智能体操作系统**：11 个专业 Agent 各司其职、14 种任务分类自动路由到最优模型、28 个 Skill 为每个 Agent 注入领域知识。DeepSeek v4 Pro 负责强力推理，MiniMax M2.7 负责创意执行和多模态生成（通过工具调用"补全"多模态能力）——双引擎各展所长。

> MiniMax的多模态需要通过MiniMaxCLI来实现（Token订阅套餐有赠送多模态额度，视频生成、语音合成、音乐创作、编程、识图、webSearch）
>
> 本文基于个人 `oh-my-openagent.json` 实际配置，详解这套体系的运作原理与 Skill 选装策略。

---

## 🏛️ 第一章：架构全景——理解你在操作的是一支军队

### 1.1 双模型引擎

```text
┌─────────────────────────────────────────────────────────┐
│                   OhMyOpenAgent 双引擎                    │
├─────────────────────────┬───────────────────────────────┤
│   DeepSeek v4 Pro       │   MiniMax M2.7                 │
│   (推理引擎)             │   (执行引擎)                    │
├─────────────────────────┤───────────────────────────────┤
│ • 硬核推理 / 逻辑分析    │ • Agent 任务执行                │
│ • 架构决策 / 算法设计    │ • 创意突破 / 跳出框架            │
│ • 长上下文分析（Metis）  │ • 多模态生成（视频/语音/音乐/图片）│
│ • 技术文档写作           │ • 视觉分析 / OCR                │
│ • 深度研究 / 复杂重构    │ • 前端 UI / 动画                │
├─────────────────────────┤───────────────────────────────┤
│ Flash 变体（低成本）:     │ 全模态生产管线:                  │
│ • 代码探索               │ • Hailuo 视频生成               │
│ • 文档查询               │ • Speech 语音合成               │
│ • 简单任务               │ • Music 音乐创作                │
│ • Web 搜索               │ • Image 图片生成                │
└─────────────────────────┴───────────────────────────────┘
```

**核心原则**：DeepSeek "想"，MiniMax "做"。每个 Agent 和 Category 都配置了 fallback 链（反向互备），一个模型挂了自动切另一个。

### 1.2 11 智能体军团

OhMyOpenAgent 定义了 **11 个专业智能体**，每个都有明确的角色定位和模型分配：

| # | 智能体 | 主力模型 | 职责 |
|---|--------|---------|------|
| 🎯 | **Sisyphus** | DeepSeek v4 Pro | 主控——任务拆解、多智能体编排、质量决策 |
| 📐 | **Prometheus** | DeepSeek v4 Pro | 规划——模糊需求 → 分步可验证计划 |
| 🚀 | **Atlas** | MiniMax M2.7 | 执行——代码落地 + MiniMax 全模态管线 |
| 🔥 | **Hephaestus** | DeepSeek v4 Pro | 攻坚——其他 Agent 反复失败的高难度 Bug / 重构 |
| 🔮 | **Oracle** | DeepSeek v4 Pro | 顾问——只读分析：架构权衡、根因诊断、安全审查 |
| 📚 | **Metis** | DeepSeek v4 Pro | 长上下文分析——1M 窗口全库深度审查 |
| 🔎 | **Momus** | MiniMax M2.7 | 批评——严格代码审查 + 业界最佳实践对照 |
| 🔍 | **Explore** | DeepSeek v4 Flash | 探索——闪电级代码搜索、模式匹配 |
| 📖 | **Librarian** | DeepSeek v4 Flash | 查询——文档检索、开源参考查找 |
| 👁️ | **Multimodal-Looker** | MiMo-V2.5 | 视觉——原生全模态图片分析、OCR、UI 审查 |
| 👶 | **Sisyphus-Junior** | DeepSeek v4 Flash | 打杂——Lint 修复、批量重命名、简单格式调整 |

> 💡 **协作模式**：Sisyphus 拆解任务 → Prometheus 做计划 → Atlas 带队执行 → Momus 审查代码 → Oracle 做架构决策支持。遇到硬骨头交给 Hephaestus 攻坚。所有 Agent 都通过 `fallback` 互备，不存在单点故障。

### 1.3 14 种任务分类——智能路由

你的每个任务会被自动路由到最优模型。这套机制让你无需手动选择模型：

```text
任务类型                    →  主力模型           适用场景
──────────────────────────────────────────────────────
🧠 ultrabrain (硬核推理)    →  DeepSeek v4 Pro    复杂算法、架构决策
🔬 deep (深度研究)          →  DeepSeek v4 Pro    多步推理、跨文件实现
✍️  writing (文档写作)      →  DeepSeek v4 Pro    技术文档、API 文档
🌐 web-research (搜索)      →  DeepSeek v4 Flash  查文档、找方案
⚡ quick (快速修复)          →  DeepSeek v4 Flash  typo、配置修改
📦 unspecified-low (低难度)  →  DeepSeek v4 Flash  通用小任务
📦 unspecified-high (高难度) →  DeepSeek v4 Pro    通用复杂任务
──────────────────────────────────────────────────────
🎨 visual-engineering (前端) →  MiniMax M2.7      UI、动画、图片
🎭 artistry (创意突破)       →  MiniMax M2.7      非传统方案
🌐 multimodal (多模态)       →  MiniMax M2.7      视频/语音/音乐/图片
🎬 video-generation          →  MiniMax M2.7      Hailuo 视频
🎙️ speech-synthesis           →  MiniMax M2.7      Speech 语音
🎵 music-composition          →  MiniMax M2.7      Music 音乐
🖼️ image-generation           →  MiniMax M2.7      Image 图片
👁️ vision-analysis            →  MiniMax M2.7      图片理解
```

**关键规律**：
- **需要推理** → DeepSeek v4 Pro
- **需要执行/创意/多模态** → MiniMax M2.7
- **简单快速** → DeepSeek v4 Flash（降成本）

---

## 🎯 第二章：Skill 全景地图——28 个 Skill 按 Agent 分工

把 Skill 按它们在多智能体体系中扮演的角色重新分类：

```text
🎯 Sisyphus（主控编排）
  ├── subagent-driven-development  ← 多子代理并行驱动
  ├── executing-plans              ← 按计划分步执行
  ├── brainstorming                ← 开工前需求澄清
  ├── find-skills                  ← 发现新 Skill
  └── handoff                      ← 跨 Session 交接

📐 Prometheus（规划）
  └── executing-plans              ← 计划执行引擎

🚀 Atlas（执行）
  ├── frontend-dev                 ← 电影级前端（Framer Motion + 媒体生成）
  ├── fullstack-dev                ← 全栈（Express/Next.js/Go/Python）
  ├── react-native-dev             ← RN / Expo 全家桶
  ├── shader-dev                   ← GLSL 着色器特效
  ├── minimax-pdf                  ← 专业 PDF（三管线）
  ├── minimax-docx                 ← Word 文档
  ├── minimax-xlsx                 ← Excel 零格式丢失
  ├── pptx-generator               ← PPT 全流程
  └── minimax-multimodal-toolkit   ← 语音/音乐/视频/图片一站生成

🔥 Hephaestus（攻坚）
  └── systematic-debugging         ← 科学调试六步法

🔮 Oracle（顾问）
  ├── zoom-out                     ← 全局视角分析
  ├── grill-with-docs              ← 文档对照挑战
  └── improve-codebase-architecture ← 架构深化

🔎 Momus（审查）
  ├── review                       ← 双轴审查（规范 + 需求）
  └── verification-before-completion ← 强制验证门禁

👁️ Multimodal-Looker（视觉）
  └── vision-analysis              ← 图片分析/OCR/UI审查

🔧 通用（所有 Agent）
  ├── test-driven-development      ← TDD 红灯→绿灯→重构
  ├── diagnose                     ← 疑难 Bug 专家诊断
  ├── webapp-testing               ← Playwright E2E
  ├── triage                       ← Issue 状态机
  ├── to-prd                       ← PRD 生成
  ├── prototype                    ← 快速原型
  └── mcp-builder                  ← MCP Server 构建

⚡ 内置王牌（已随系统自带）
  ├── playwright                   ← 浏览器自动化
  ├── frontend-ui-ux               ← 设计师级 UI/UX
  ├── git-master                   ← Git 全操作
  ├── review-work                  ← 五重并行审查门禁
  └── ai-slop-remover             ← AI 代码味清理
```

---

## 🛡️ 第三章：第一梯队——质量保障（不装就是在裸奔）

### 1. `verification-before-completion` ⭐️⭐️⭐️⭐️⭐️

> **"完成前必须跑验证，不许空口说白话"**

在 OhMyOpenAgent 体系中，Atlas 负责执行代码，Momus 负责审查——但**最终验收**需要这个 Skill 来强制把关。它会在 Agent 声称"做完了"之前，自动触发验证命令。

**触发条件**：`fix`、`complete`、`done` 等声明性词汇。

### 2. `test-driven-development` ⭐️⭐️⭐️⭐️⭐️

> **"红灯 → 绿灯 → 重构，标准 TDD 循环"**

DeepSeek v4 Pro 写代码极快，但没有约束时也极快写出 Bug。TDD Skill 把 Atlas 的执行能力约束在测试框架内。

**推荐配合**：Hephaestus 攻坚时，先用 TDD Skill 补齐测试覆盖。

### 3. `systematic-debugging` ⭐️⭐️⭐️⭐️

> **"复现 → 缩小 → 假设 → 打桩 → 修复 → 回归"**

科学调试六步法。在 Hephaestus 接管前，先走标准流程；走不通再交给 Hephaestus 攻坚。

### 4. `review` ⭐️⭐️⭐️⭐️

> **"双轴并行审查：规范符合度 + 需求符合度"**

启动两个并行子审查——一个检查代码规范，一个检查需求匹配。比 Momus 的内置审查更轻量，适合日常快速审查。

### 5. `diagnose` ⭐️⭐️⭐️

> **"疑难杂症专家门诊"**

`systematic-debugging` 搞不定时，`diagnose` 提供更专业的诊断链路。如果还搞不定 → 交给 Hephaestus。

---

## 🎨 第四章：第二梯队——Atlas 执行工具箱

Atlas 是 OhMyOpenAgent 中的**主力执行 Agent**（MiniMax M2.7），肩负代码落地和多模态产出的双重使命。以下 Skill 直接增强 Atlas 的战斗力。

### 6. `frontend-dev` ⭐️⭐️⭐️⭐️⭐️

> **"电影级前端：Framer Motion / GSAP + MiniMax 媒体生成"**

配合 Atlas 的 MiniMax CLI 能力，直接生成页面所需的图片和视频素材，加上电影级动画——一个 Prompt 出整站。

**集成点**：Atlas → `visual-engineering` category（MiniMax M2.7） → `frontend-dev` Skill。

### 7. `fullstack-dev` ⭐️⭐️⭐️⭐️⭐️

> **"全栈最佳实践：Express / Next.js / Go / Python + 生产加固"**

覆盖 REST API 设计、实时通信（SSE/WebSocket）、认证流、文件上传。Atlas 用它来保证代码不走野路子。

### 8. `react-native-dev` ⭐️⭐️⭐️⭐️

> **"React Native / Expo 全家桶"**

组件、动画、导航、状态管理、性能优化、App Store 部署——Atlas 的移动端能力全靠它。

### 9. `shader-dev` ⭐️⭐️⭐️

> **"GLSL 着色器：Ray Marching + SDF + 粒子系统"**

WebGL 创意编程、视觉特效。适合前端需要炫酷效果时加载。

---

## 📄 第五章：第三梯队——文档产出四件套

MiniMax M2.7 在结构化内容生成上表现优异，文档四件套是 OhMyOpenAgent 生态的**独有优势**。

### 10. `minimax-pdf` ⭐️⭐️⭐️⭐️⭐️

> **"PDF 设计系统：颜色 → 排版 → 间距，自顶向下流动"**

| 管线 | 说明 |
|------|------|
| CREATE | 从零生成：报告、提案、简历、封面 |
| FILL | 智能填写 PDF 表单字段 |
| REFORMAT | Markdown/文本一键转专业 PDF |

### 11. `minimax-docx` ⭐️⭐️⭐️⭐️

> **"Word 文档三管线：新建 / 填写 / 模板套用，基于 OpenXML SDK"**

合同、正式报告、企业文档——格式精确到像素级。

### 12. `minimax-xlsx` ⭐️⭐️⭐️⭐️

> **"零格式丢失编辑 Excel，公式重算 + 专业财务格式"**

财务模型、数据报表、透视表——改数据不毁格式。

### 13. `pptx-generator` ⭐️⭐️⭐️⭐️

> **"PPT 全流程：封面 → TOC → 内容 → 章节分隔 → 总结"**

PptxGenJS 生成 + 编辑已有 PPTX。技术分享、项目汇报必备。

### 14. `to-prd` ⭐️⭐️⭐️

> **"对话上下文 → 标准 PRD → 发布到 Issue Tracker"**

Prometheus 做完规划后，一键输出 PRD。

---

## 🌐 第六章：第四梯队——MiniMax 多模态全栈

### 15. `minimax-multimodal-toolkit` ⭐️⭐️⭐️⭐️⭐️

> **"MiniMax 全模态一站生成：🎤语音 + 🎵音乐 + 🎬视频 + 🖼️图片"**

这是 Atlas 执行 Agent 的**核心武器**。在 OhMyOpenAgent 架构中，Atlas 通过 MiniMax CLI 直接调用以下能力：

| 能力 | 底层模型 | 说明 |
|------|---------|------|
| 🎤 Speech 2.8 | MiniMax TTS | 文字转语音、声音克隆、声音设计、多段合成 |
| 🎵 Music 2.6 | MiniMax Music | 原创歌曲、纯音乐 |
| 🎬 Hailuo 2.3 | MiniMax Video | 文生视频、图生视频、首尾帧、主体参考、长视频多场景 |
| 🖼️ Image 01 | MiniMax Image | 文生图、图生图（角色一致性保持） |
| 🔧 FFmpeg | 媒体处理 | 转换、拼接、裁剪、提取 |

**Category 路由**：Atlas 根据子任务类型，自动路由到 `video-generation` / `speech-synthesis` / `music-composition` / `image-generation` category——全部跑在 MiniMax M2.7 上。

### 16. `vision-analysis` ⭐️⭐️⭐️⭐️

> **"MiniMax 视觉理解：图片分析 + OCR + UI 审查"**

配合 Multimodal-Looker 智能体（MiniMax M2.7 原生），处理所有视觉任务。触发条件：消息中包含图片路径或 URL。

---

## 🚀 第七章：第五梯队——效率跃迁

### 17. `subagent-driven-development` ⭐️⭐️⭐️⭐️⭐️

> **"复杂任务拆解 → 多子代理并行 → Sisyphus 居中调度"**

这是 Sisyphus 主控 Agent 的**核心 Skill**。大型任务会被拆成独立单元，Sisyphus 派发子代理并行执行——DeepSeek v4 Pro 做推理拆分，Atlas（M2.7）或 DeepSeek v4 Flash Agent 并行落地。

### 18. `executing-plans` ⭐️⭐️⭐️⭐️

> **"Prometheus 出计划 → 按检查点分步执行 → 自动 Review"**

Prometheus（DeepSeek v4 Pro）规划完成后的执行引擎。每个检查点自动触发 Momus 审查。

### 19. `brainstorming` ⭐️⭐️⭐️⭐️

> **"任何创意工作前强制走需求探索 + 方案设计"**

面向 `artistry` category（MiniMax M2.7）的创意流程。在写代码之前先把需求想清楚。

### 20. `find-skills` ⭐️⭐️⭐️

> **"快速发现和安装新 Skill"**

当你想扩展 Agent 能力时，用它搜索可用 Skill。

### 21. `handoff` ⭐️⭐️⭐️

> **"会话交接：当前上下文 → 结构化交接文档"**

对话太长要换 Session？一键打包所有上下文，新 Session 无缝续接。

---

## 🏗️ 第八章：第六梯队——架构 & 项目管理

### 22. `improve-codebase-architecture` ⭐️⭐️⭐️⭐️

> **"基于 CONTEXT.md 和 ADR，找出架构优化点"**

配合 Oracle 的只读分析能力，在不动代码的情况下先分析架构瓶颈。

### 23. `zoom-out` ⭐️⭐️⭐️⭐️

> **"拉远视角，理解局部代码在全局中的位置"**

Metis（1M 上下文）或 Oracle 分析陌生代码时的必备视角切换工具。

### 24. `grill-with-docs` ⭐️⭐️⭐️

> **"计划 vs 文档对照审查——用领域语言挑战你的设计"**

Prometheus 出计划后、Atlas 执行前，用这个 Skill 做一次压力测试。

### 25. `prototype` ⭐️⭐️⭐️

> **"两路快速原型：终端状态机 + 多风格 UI 并行探索"**

方案不确定时先做原型，低成本验证假设。

### 26. `mcp-builder` ⭐️⭐️⭐️

> **"构建 MCP Server：Python FastMCP / Node MCP SDK"**

扩展 OhMyOpenAgent 能力边界——把外部 API 封装成 MCP 工具，所有 Agent 都能调用。

---

## 🔧 第九章：第七梯队——调试 & 测试

### 27. `webapp-testing` ⭐️⭐️⭐️⭐️

> **"Playwright E2E + 截图 + Console 日志"**

前端功能验证、UI 渲染调试。在 Atlas 生成前端代码后，用它做自动验收。

### 28. `triage` ⭐️⭐️⭐️

> **"Issue 状态机：分类 → 优先级 → 分配 → 关闭"**

项目管理流程规范化。

---

## ⚡ 第十章：内置王牌——无需安装已就绪

这 5 个 Skill 随 OpenCode 系统自带，但你得知道它们有多强：

| Skill | 模型 | 亮点 |
|-------|------|------|
| `playwright` | — | 浏览器全自动化——测试、爬虫、截图、表单填写 |
| `frontend-ui-ux` | — | 设计师级 UI/UX——无设计稿也能出精品 |
| `git-master` | — | Git 全操作专家——原子提交、rebase、blame、bisect |
| `review-work` | — | **五重并行审查门禁**：目标验证 + 代码质量 + 安全审查 + QA 执行 + 上下文挖掘（同时启动 5 个 Agent！） |
| `ai-slop-remover` | — | 移除过度注释、无用抽象等 AI 痕迹 |

> ⚠️ `review-work` 是审查链的终极形态——比 `review` Skill 更强（五重并行 vs 双轴），适合 PR 提交前的最终门禁。它在 OhMyOpenAgent 架构中会同时启动 Oracle、Momus 等多个 Agent 并行审查。

---

## 🧭 第十一章：场景速查——什么时候加载哪个 Skill

| 场景 | 涉及 Agent | 必装 Skill |
|------|-----------|-----------|
| 🔧 日常写代码 | Atlas + Sisyphus | `fullstack-dev` + `frontend-dev` + `brainstorming` |
| 🧪 写测试 | Atlas | `test-driven-development` + `webapp-testing` |
| 🐛 修 Bug | Hephaestus | `systematic-debugging` + `diagnose` |
| 📦 提交 PR | Momus + Oracle | `review` + `verification-before-completion` + `review-work` |
| 📝 出文档 | Atlas（M2.7） | `minimax-pdf` + `minimax-docx` + `pptx-generator` + `to-prd` |
| 📊 处理数据 | Atlas | `minimax-xlsx` |
| 🎙️ 多模态生成 | Atlas（M2.7） | `minimax-multimodal-toolkit` |
| 👁️ 图片分析 | Multimodal-Looker | `vision-analysis` |
| 🏗️ 重构架构 | Oracle + Hephaestus | `improve-codebase-architecture` + `zoom-out` + `grill-with-docs` |
| 🚀 大任务拆解 | Sisyphus + Prometheus | `subagent-driven-development` + `executing-plans` |
| 🔄 换 Session | Sisyphus | `handoff` |
| 🎨 视觉特效 | Atlas（M2.7） | `shader-dev` + `frontend-dev` |
| 📱 移动开发 | Atlas | `react-native-dev` |
| 🔌 自定义工具 | — | `mcp-builder` |
| 📋 项目管理 | — | `triage` |

---

## 💡 第十二章：按 Agent 角色推荐 Skill 组合

不同 Agent 在 OhMyOpenAgent 架构中承担不同职责，加载合适的 Skill 能最大化每个 Agent 的战斗力：

### 🎯 Sisyphus（主控编排）— DeepSeek v4 Pro

```text
subagent-driven-development  ← 核心：拆解 + 派发 + 调度
executing-plans              ← 按 Prometheus 计划执行
brainstorming                ← 需求澄清
handoff                      ← 长久任务交接
```

### 🚀 Atlas（执行主力）— MiniMax M2.7

```text
frontend-dev                 ← 前端（Framer Motion + 媒体生成）
fullstack-dev                ← 全栈（Express/Next.js/Go/Python）
minimax-multimodal-toolkit   ← 语音/音乐/视频/图片
minimax-pdf + docx + xlsx    ← 文档产出
pptx-generator               ← PPT
```

### 🔥 Hephaestus（攻坚）— DeepSeek v4 Pro

```text
systematic-debugging         ← 科学调试
diagnose                     ← 专家诊断
improve-codebase-architecture ← 深层重构
```

### 🔎 Momus（审查）— MiniMax M2.7

```text
review                       ← 双轴审查
verification-before-completion ← 强制验证
```

---

## 🎯 第十三章：最小必装清单（8 个安装型 + 5 个内置 = 13）

如果只装最核心的，推荐这个组合：

```text
🛡️ verification-before-completion    ← 拒绝假交付（Momus 门禁）
🛡️ test-driven-development          ← 代码有保障（Atlas 约束）
🛡️ systematic-debugging             ← Bug 不求人（Hephaestus 前置）
📄 minimax-pdf                       ← 文档一键出（M2.7 优势）
📄 minimax-multimodal-toolkit        ← 多模态核心（Atlas 武器库）
🎨 frontend-dev                      ← 前端不将就（Atlas 执行）
🎨 fullstack-dev                     ← 全栈通吃（Atlas 执行）
🚀 subagent-driven-development       ← 效率翻倍（Sisyphus 核心）

+ 5 个内置王牌（playwright / frontend-ui-ux / git-master / review-work / ai-slop-remover）
```

装上这 13 个，你的 DeepSeek v4 + MiniMax M2.7 开发体验会从"能用"直接跃迁到 **"恐怖如斯"**。

---

## 👁️ 第十四章：多模态视觉体系——打通 Sisyphus 的"眼睛"

### 14.1 痛点——Sisyphus 是个"盲人"

OhMyOpenAgent 的多智能体体系有个致命盲区：

```text
你粘贴图片给 Sisyphus（主编排器）
         ↓
Sisyphus 是 DeepSeek v4 Pro（纯文本模型）
         ↓
💥 "Cannot read clipboard" ——图片根本没机会路由给多模态 Agent！
```

**根因**：MiniMax M2.7（Atlas 的模型）虽然能做视觉分析，但它不是*原生多模态*模型——只能通过 MCP 工具（`MiniMax_understand_image`）"间接"看图。而 opencode 的图片粘贴是发给当前激活的 Agent 的——如果当前是 Sisyphus（DeepSeek v4 Pro），图片在入口就被拒绝了。

### 14.2 解决方案——双层图片链路

我们需要在两个层面解决问题：

> https://github.com/devadathanmb/opencode-minimax-easy-vision

| 层 | 机制 | 解决什么 |
|---|------|----------|
| 🛡️ **入口层** | EasyVision 插件拦截 Sisyphus 的图片 → 转 MiniMax MCP 识图 | 让主编排器也能"看懂"图片，然后智能路由 |
| 🚀 **直达层** | multimodal-looker 切到 MiMo-V2.5（原生全模态） | 切到该 Agent 后，图片直通模型，端到端推理 |

```
                       你粘贴图片
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌─────────────────┐      ┌─────────────────────┐
     │  Sisyphus        │      │ multimodal-looker   │
     │  (DeepSeek v4 Pro)│      │  (MiMo-V2.5 🆕)     │
     │  纯文本模型       │      │  原生全模态模型       │
     └────────┬────────┘      └──────────┬──────────┘
              │                          │
     ┌────────▼────────┐        ┌────────▼────────┐
     │ EasyVision 拦截  │        │ 图片直通模型      │
     │ 保存图片到 /tmp   │        │ 310B ViT编码器    │
     │ ↓                │        │ 1M 上下文         │
     │ MCP understand   │        │ ↓                │
     │ _image 分析       │        │ 端到端多模态推理   │
     └────────┬────────┘        └────────┬────────┘
              │                          │
              └──────────┬───────────────┘
                         ▼
                   Sisyphus 编排路由
```

记得修改 `~/.config/opencode/opencode-minimax-easy-vision.jsonc`，给 DeepSeek 加入拦截的名单里。

```json
{
  // Which models this plugin activates for.
  // Wildcards: "*" = all, "provider/*" = all from provider,
  // "*/model" = specific model from any provider, "provider/model" = exact.
  // 拦截所有需要 MCP 识图的模型（包括非原生多模态的 DeepSeek）
  "models": [
    "minimax/*",
    "minimax-cn/*",
    "minimax-coding-plan/*",
    "minimax-cn-coding-plan/*",
    "minimax-token-plan/*",
    "minimax-cn-token-plan/*",
    "opencode-go/deepseek-v4-pro",
    "opencode-go/deepseek-v4-flash"
  ],

  // MCP tool name for image analysis.
  // Format: mcp_<server-key>_<tool>
  "imageAnalysisTool": "mcp_minimax_understand_image",

  // Custom prompt template. Must include at least one variable:
  //   {imageList}  — newline-separated "- Image N: /path"
  //   {imageCount} — number of images
  //   {toolName}   — the configured MCP tool name
  //   {userText}   — the user's original text (may be empty)
  // Leave as null to use the built-in default template.
  "promptTemplate": null,

  // Directory where pasted images are saved before being passed to the MCP tool.
  // Leave as null to use the OS temp directory + "opencode-minimax-vision/".
  "tempDir": null,

  // Delete temp files older than this many hours on plugin startup.
  "cleanupAfterHours": 24
}

```

### 14.3 MiMo-V2.5 是什么？

MiMo-V2.5 是 opencode-go（Go 套餐）提供的一款**原生全模态模型**：

| 指标 | 数值 |
|------|------|
| 总参数 | 310B（Sparse MoE） |
| 激活参数 | 15B |
| 上下文窗口 | 1M tokens |
| 视觉编码器 | ViT 7.29亿参数（原生） |
| 输入模态 | 文本 + 图片 + 视频 + 音频 |
| 输出模态 | 文本 |
| 定价 | 1x（1 token = 1 credit），Go 套餐 $10/月（截至 2026.05） |

### 14.4 三种图片识别路径

| # | 场景 | 使用方式 | 机制 |
|---|------|----------|------|
| 1 | 🖼️ 在 Sisyphus 粘贴图片 | EasyVision 自动拦截 | 保存到文件 → MiniMax MCP understand_image → 文字返回 → Sisyphus 路由 |
| 2 | 🖼️ 切到 multimodal-looker 粘贴 | MiMo-V2.5 原生 | ViT 端到端视觉推理（比 MCP 快 3-5x） |
| 3 | 📂 本地文件路径（如 `/tmp/photo.png`） | `local-vision` category | MiniMax MCP understand_image（专用于文件路径） |

---

## 🔧 第十五章：配置优化实战——skills + prompt_append + vision 三级增强

### 15.1 Schema 隐藏字段

翻阅 [官方 Schema](https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json) 后发现，除了文档常见的 `model`/`fallback`/`description`，还支持两个关键字段：

| 字段 | 类型 | 适用对象 | 作用 |
|------|------|----------|------|
| **`skills`** | `string[]` | Agent（专属） | 预定义该 Agent 默认加载的 Skill 列表 |
| **`prompt_append`** | `string` | Agent + Category | 注入到系统提示词的额外指令文本 |

### 15.2 优化效果对比

| 维度 | 优化前 | 优化后 |
|------|--------|--------|
| **Agent 能力感知** | 仅描述角色职责 | ✅ `prompt_append` 注入能力速查表（子智能体清单+核心规则） |
| **Skill 预关联** | 无 | ✅ `skills` 字段预关联（Sisyphus 5个、Atlas 10个等） |
| **多模态视觉** | 粘贴图片即报错 | ✅ EasyVision 拦截 + MiMo-V2.5 原生视觉双链路 |
| **Category 指引** | 场景描述 | ✅ `prompt_append` 注入 Skill推荐+产出标准 |

### 15.3 改动文件清单

| 文件 | 改动 | 作用 |
|------|------|------|
| `oh-my-openagent.json` | 11 Agent + 15 Category 全部添加 `prompt_append` | Agent 启动时注入能力速查表 |
| `oh-my-openagent.json` | 7 个 Agent 添加 `skills` 预关联 | Sisyphus(5) / Atlas(10) / Hephaestus(3) / Oracle(3) / Momus(2) / Prometheus(1) / Metis(1) / Multimodal-Looker(1) |
| `oh-my-openagent.json` | multimodal-looker 从之前MiniMax模型切 `opencode-go/MiMo-V2.5` + fallback | 原生全模态视觉 |
| `oh-my-openagent.json` | 新增 `local-vision` category | 本地文件图片专用 MCP 通道 |
| `opencode-minimax-easy-vision.jsonc` | 模型列表新增 `deepseek-v4-pro` / `deepseek-v4-flash` | Sisyphus 粘贴图片 → EasyVision 拦截 → MCP 识图 |

### 15.4 Sisyphus 的 prompt_append 示例

```text
## ⚡ 你的能力速查表
### 可调度子智能体
- 🔮 Oracle(DeepSeek v4 Pro)：只读架构顾问
- 📐 Prometheus(DeepSeek v4 Pro)：需求→分步可验证计划
- 🚀 Atlas(MiniMax M2.7)：执行主力——全模态管线+全栈开发
- 🔥 Hephaestus(DeepSeek v4 Pro)：高难度Bug/深层重构攻坚
- 🔎 Momus(MiniMax M2.7)：代码审查——双轴审查+强制验证门禁
- 🔍 Explore(Flash)：内部代码搜索
- 📖 Librarian(Flash)：外部资料查询
- 👁️ Multimodal-Looker(MiMo-V2.5)：原生全模态视觉分析
### 核心规则
- 所有实现必须委托(用task)，不自己写代码
- 视觉工作→visual-engineering category
- 并行化一切能并行的
- 完成后：momus审查→verification-before-completion验证
```

### 15.5 验收测试结果

| 测试项 | 结果 |
|--------|:--:|
| 在 Sisyphus 粘贴图片 → EasyVision 拦截 | ✅ 通过 |
| MiniMax MCP understand_image 分析截图 | ✅ 通过 |
| 图片→文字→Sisyphus 智能路由 | ✅ 通过 |
| multimodal-looker + MiMo-V2.5 原生视觉 | ✅ 通过 |

---

## 📦 附录 A：Skill 仓库索引（一键安装）

> 以下将文中 28 个安装型 Skill + 5 个内置 Skill 按 GitHub 仓库归类，每个仓库均提供一键安装命令。安装后重启 OpenCode 即可生效。

### 🏢 仓库一：MiniMax-AI/skills（10 个 Skill）⭐ 主力仓库

**仓库地址**：[https://github.com/MiniMax-AI/skills](https://github.com/MiniMax-AI/skills)
**许可证**：MIT
**包含 Skill**：

| # | Skill 名称 | 文中章节 | 类型 |
|---|-----------|---------|------|
| 1 | `frontend-dev` | 第四章 §6 | 🎨 前端/动画 |
| 2 | `fullstack-dev` | 第四章 §7 | 🔧 全栈 |
| 3 | `react-native-dev` | 第四章 §8 | 📱 移动端 |
| 4 | `shader-dev` | 第四章 §9 | 🎨 着色器 |
| 5 | `minimax-pdf` | 第五章 §10 | 📄 PDF |
| 6 | `minimax-docx` | 第五章 §11 | 📄 Word |
| 7 | `minimax-xlsx` | 第五章 §12 | 📊 Excel |
| 8 | `pptx-generator` | 第五章 §13 | 📊 PPT |
| 9 | `minimax-multimodal-toolkit` | 第六章 §15 | 🎤🎵🎬🖼️ 多模态 |
| 10 | `vision-analysis` | 第六章 §16 | 👁️ 视觉分析 |

**🔧 一键安装（Linux/macOS/WSL）**：
```bash
# 克隆仓库
git clone https://github.com/MiniMax-AI/skills.git ~/.minimax-skills

# 创建 skills 目录并建立符号链接
mkdir -p ~/.config/opencode/skills
for skill in ~/.minimax-skills/skills/*/; do
  skill_name=$(basename "$skill")
  ln -sfn "$skill" ~/.config/opencode/skills/"$skill_name"
done

echo "✅ MiniMax Skills 安装完成！重启 OpenCode 生效"
```

**🔧 Windows（PowerShell）**：
```powershell
git clone https://github.com/MiniMax-AI/skills.git "$env:USERPROFILE\.minimax-skills"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\skills"
Get-ChildItem "$env:USERPROFILE\.minimax-skills\skills" -Directory | ForEach-Object {
  New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.config\opencode\skills\$($_.Name)" -Target $_.FullName -Force
}
Write-Host "✅ MiniMax Skills 安装完成！"
```

---

### 🔌 仓库二：code-yeongyu/oh-my-openagent（核心插件 + 5 内置 Skill）

**仓库地址**：[https://github.com/code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)
**说明**：OhMyOpenAgent 核心插件，提供 11 智能体 + 14 任务分类 + 5 个内置 Skill。**这是整套多智能体系统的基石，必须先装。**

**🔧 安装核心插件**：
```bash
# 方式一：bun（推荐）
bunx oh-my-opencode@latest

# 方式二：npm
npx oh-my-opencode@latest
```

**内置 Skill（无需额外安装，插件自带）**：

| # | Skill | 文中章节 | 说明 |
|---|-------|---------|------|
| ⚡1 | `playwright` | 第十章 | 浏览器全自动化 |
| ⚡2 | `frontend-ui-ux` | 第十章 | 设计师级 UI/UX |
| ⚡3 | `git-master` | 第十章 | Git 全操作专家 |
| ⚡4 | `review-work` | 第十章 | 五重并行审查门禁 |
| ⚡5 | `ai-slop-remover` | 第十章 | AI 代码味清理 |

---

### 👁️ 仓库三：devadathanmb/opencode-minimax-easy-vision（视觉链路插件）

**仓库地址**：[https://github.com/devadathanmb/opencode-minimax-easy-vision](https://github.com/devadathanmb/opencode-minimax-easy-vision)
**说明**：让 DeepSeek（纯文本模型）粘贴图片时自动拦截 → MiniMax MCP 识图，打通 Sisyphus 的"眼睛"。详见第十四章。

**🔧 一键安装**：
```bash
# 克隆到 opencode 插件目录
git clone https://github.com/devadathanmb/opencode-minimax-easy-vision.git \
  ~/.config/opencode/plugins/opencode-minimax-easy-vision

# 编辑配置，将 DeepSeek 加入拦截名单
# 配置文件路径：~/.config/opencode/opencode-minimax-easy-vision.jsonc
```

**配置示例（`opencode-minimax-easy-vision.jsonc`）**：
```jsonc
{
  "models": [
    "minimax/*",
    "minimax-cn/*",
    "opencode-go/deepseek-v4-pro",   // ← 关键：DeepSeek 加入拦截
    "opencode-go/deepseek-v4-flash"  // ← 关键：Flash 也加入
  ],
  "imageAnalysisTool": "mcp_minimax_understand_image",
  "cleanupAfterHours": 24
}
```

---

### 🌐 仓库四：社区编排类 Skill（通过 `npx skills` 安装）

以下编排类 Skill 来自开源社区多个仓库，可通过通用 Skills CLI 一键安装：

**🔧 通用安装方式**：
```bash
# 搜索可用 Skill
npx skills find "test-driven-development"

# 安装指定 Skill（示例）
npx skills add <owner/repo> --skill <skill-name> -g -y
```

| # | Skill 名称 | 文中章节 | 推荐来源 | 安装命令 |
|---|-----------|---------|---------|---------|
| 11 | `test-driven-development` | 第三章 | community | `npx skills find "test-driven-development"` |
| 12 | `verification-before-completion` | 第三章 | superpowers | `npx skills add obra/superpowers-skills --skill "Verification Before Completion" -g -y` |
| 13 | `systematic-debugging` | 第三章 | community | `npx skills find "systematic-debugging"` |
| 14 | `review` | 第三章 | community | `npx skills find "review"` |
| 15 | `diagnose` | 第三章 | mattpocock | `npx skills add mattpocock/skills --skill diagnose -g -y` |
| 16 | `subagent-driven-development` | 第七章 | superpowers | `npx skills add obra/superpowers-skills --skill "Subagent-Driven Development" -g -y` |
| 17 | `executing-plans` | 第七章 | superpowers | `npx skills add obra/superpowers-skills --skill "Executing Plans" -g -y` |
| 18 | `brainstorming` | 第七章 | superpowers | `npx skills add obra/superpowers-skills --skill brainstorming -g -y` |
| 19 | `find-skills` | 第七章 | community | `npx skills find "find-skills"` |
| 20 | `handoff` | 第七章 | mattpocock | `npx skills add mattpocock/skills --skill handoff -g -y` |
| 21 | `improve-codebase-architecture` | 第八章 | mattpocock | `npx skills add mattpocock/skills --skill improve-codebase-architecture -g -y` |
| 22 | `zoom-out` | 第八章 | mattpocock | `npx skills add mattpocock/skills --skill zoom-out -g -y` |
| 23 | `grill-with-docs` | 第八章 | mattpocock | `npx skills add mattpocock/skills --skill grill-with-docs -g -y` |
| 24 | `prototype` | 第八章 | mattpocock | `npx skills add mattpocock/skills --skill prototype -g -y` |
| 25 | `mcp-builder` | 第八章 | community | `npx skills find "mcp-builder"` |
| 26 | `webapp-testing` | 第九章 | community | `npx skills find "webapp-testing"` |
| 27 | `triage` | 第九章 | mattpocock | `npx skills add mattpocock/skills --skill github-triage -g -y` |
| 28 | `to-prd` | 第五章 | mattpocock | `npx skills add mattpocock/skills --skill to-prd -g -y` |

> 📌 **备注**：标记为 `community` 的 Skill 可通过 [skills.sh](https://skills.sh/) 搜索最新来源。标记为 `mattpocock` / `superpowers` 的 Skill 已验证上游仓库存在。
>
> 💡 **一键安装全部社区 Skill（推荐）**：在 `npx skills find` 搜索后逐个安装，或访问 [https://skills.sh/](https://skills.sh/) 浏览排行榜挑选。

---

### 🗺️ 完整 Skill 来源速查表

```text
┌─────────────────────────────────────────────────────────┐
│                    Skill 来源全景                         │
├─────────────────────┬───────────────────────────────────┤
│ MiniMax-AI/skills   │ 10 个（主力仓库）                  │
│   git clone → ln    │ frontend-dev, fullstack-dev,      │
│                     │ react-native-dev, shader-dev,     │
│                     │ minimax-pdf, minimax-docx,        │
│                     │ minimax-xlsx, pptx-generator,     │
│                     │ minimax-multimodal-toolkit,       │
│                     │ vision-analysis                   │
├─────────────────────┼───────────────────────────────────┤
│ oh-my-openagent     │ 5 个内置 Skill（插件自带）          │
│   核心插件           │ playwright, frontend-ui-ux,       │
│   bunx 一键安装      │ git-master, review-work,          │
│                     │ ai-slop-remover                   │
├─────────────────────┼───────────────────────────────────┤
│ easy-vision 插件     │ 1 个视觉链路插件（独立安装）        │
│   git clone         │ 让 DeepSeek 也能"看图"            │
├─────────────────────┼───────────────────────────────────┤
│ mattpocock/skills   │ 8 个编排类 Skill                  │
│   npx skills add    │ diagnose, handoff, prototype,     │
│                     │ zoom-out, grill-with-docs,        │
│                     │ to-prd, triage,                   │
│                     │ improve-codebase-architecture     │
├─────────────────────┼───────────────────────────────────┤
│ superpowers-skills  │ 4 个流程类 Skill                  │
│   npx skills add    │ brainstorming, subagent-driven-   │
│                     │ development, executing-plans,     │
│                     │ verification-before-completion    │
├─────────────────────┼───────────────────────────────────┤
│ community           │ 6 个通用 Skill                    │
│   npx skills find   │ test-driven-development,          │
│   → skills.sh       │ systematic-debugging, review,     │
│                     │ mcp-builder, webapp-testing,      │
│                     │ find-skills                       │
└─────────────────────┴───────────────────────────────────┘
```

---

## 附录 B：ohmyopencode 配置（优化版——含 skills + prompt_append + vision）

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "🎯 主控智能体（DeepSeek v4 Pro）——任务拆解与多智能体编排中枢。职责：① 将复杂需求拆分为可并行执行的子任务；② 委托给最合适的子智能体（Atlas执行、Oracle顾问、Explore探索、Momus审查）；③ 质量把控与最终决策。核心 Skill：subagent-driven-development（多子代理并行驱动）、executing-plans（按计划执行）、brainstorming（开工前澄清需求）、find-skills（发现新Skill）、handoff（跨Session交接）。可利用MiniMax MCP的web_search获取最新实践。协作模式：Sisyphus拆解 → Prometheus规划 → Atlas执行 → Momus审查 → Oracle架构决策。",
      "skills": [
        "subagent-driven-development",
        "executing-plans",
        "brainstorming",
        "find-skills",
        "handoff"
      ],
      "prompt_append": "## ⚡ 你的能力速查表\n### 可调度子智能体\n- 🔮 Oracle(DeepSeek v4 Pro)：只读架构顾问——架构权衡、根因诊断、安全审查\n- 📐 Prometheus(DeepSeek v4 Pro)：需求→分步可验证计划\n- 📚 Metis(DeepSeek v4 Pro)：1M上下文全局分析\n- 🚀 Atlas(MiniMax M2.7)：执行主力——全模态管线(视频/语音/音乐/图片)+ 全栈开发\n- 🔥 Hephaestus(DeepSeek v4 Pro)：高难度Bug/深层重构攻坚（2+次失败后调用）\n- 🔎 Momus(MiniMax M2.7)：代码审查——双轴审查+强制验证门禁\n- 🔍 Explore(Flash)：内部代码搜索（ast_grep/grep/glob）\n- 📖 Librarian(Flash)：外部资料查询（MiniMax web_search）\n- 👁️ Multimodal-Looker(MiniMax M2.7)：图片分析/OCR/UI审查\n### 核心规则\n- 所有实现必须委托(用task)，不自己写代码\n- 视觉工作→visual-engineering category\n- 并行化一切能并行的\n- 完成后：momus审查→verification-before-completion验证"
    },
    "atlas": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🚀 执行主力智能体（MiniMax M2.7，Pro推理兜底）——代码落地 + MiniMax全模态管线。开发Skill全栈覆盖：【前端】frontend-dev（电影级动画Framer Motion/GSAP+媒体生成）、shader-dev（GLSL着色器特效）；【全栈】fullstack-dev（Express/Next.js/Go/Python）；【移动端】react-native-dev（RN/Expo全家桶）；【文档】minimax-pdf（三管线PDF）、minimax-docx（Word文档）、minimax-xlsx（Excel零格式丢失）、pptx-generator（PPT全流程）；【多模态】minimax-multimodal-toolkit（Hailuo视频+Speech语音+Music音乐+Image图片一站生成）。通过MCP做视觉分析(understand_image)和资料检索(web_search)。工具：MiniMax CLI（多模态生成）+ 全模态MCP工具集。",
      "skills": [
        "frontend-dev",
        "fullstack-dev",
        "react-native-dev",
        "shader-dev",
        "minimax-multimodal-toolkit",
        "minimax-pdf",
        "minimax-docx",
        "minimax-xlsx",
        "pptx-generator",
        "test-driven-development"
      ],
      "prompt_append": "## ⚡ 你的工具清单\n### 核心Skill（预加载）\n- frontend-dev：电影级前端(Framer Motion/GSAP + AI素材生成)\n- fullstack-dev：全栈(Express/Next.js/Go/Python)\n- react-native-dev：RN/Expo全家桶\n- shader-dev：GLSL着色器特效\n- minimax-multimodal-toolkit：视频(Hailuo)/语音(Speech)/音乐(Music)/图片(Image)一站式生成\n- minimax-pdf/docx/xlsx：文档三件套(零格式丢失)\n- pptx-generator：PPT全流程(封面/目录/内容/总结)\n- test-driven-development：红灯→绿灯→重构\n### 可用工具（直接调用）\n- MiniMax CLI：多模态生成(视频/语音/音乐/图片)\n- MiniMax MCP：understand_image(视觉分析) + web_search(资料检索)\n- Playwright：浏览器自动化测试\n### 关键规则\n- 完成后跑 webapp-testing 验证前端效果\n- 文档类产出用 minimax-pdf/docx/xlsx 而非手写Markdown\n- 前端产出必须带电影级动画"
    },
    "hephaestus": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "🔥 攻坚智能体（DeepSeek v4 Pro）——高难度Bug/深层重构专家。触发条件：① 其他Agent反复失败（2+次）；② Oracle诊断出根因后需要高强度编码攻坚；③ 跨模块架构级改动。核心 Skill：systematic-debugging（复现→缩小→假设→打桩→修复→回归六步法）、diagnose（疑难Bug专家诊断）、improve-codebase-architecture（深层架构重构）。Pro的强推理能力确保一击必中，不下补丁式修补。",
      "skills": [
        "systematic-debugging",
        "diagnose",
        "improve-codebase-architecture"
      ],
      "prompt_append": "## ⚡ 你的工作流程\n### 调试六步法(systematic-debugging)\n1. 复现Bug 2. 缩小范围 3. 建立假设 4. 打桩/日志 5. 修复根因 6. 回归测试防复发\n### 何时调用Oracle\n- 2次修复失败后→让Oracle读代码做根因分析\n- 跨模块改动前→让Oracle评审影响面\n### 关键规则\n- 修复根因，不修症状\n- 每步修复后验证(must pass tests)\n- 不改测试来'pass'——那是作弊\n- 3次失败→立即停止→回滚→咨询Oracle"
    },
    "prometheus": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "📐 规划师智能体（DeepSeek v4 Pro）——模糊需求→分步可验证计划。职责：将需求转化为结构化工程任务，标注依赖关系和并行机会，确保每个子任务有明确的验收标准。核心 Skill：executing-plans（计划执行引擎）。可将Skills技能库作为任务拆分的参考模板，输出包含：任务分解、优先级排序、并行执行策略、检查点定义。",
      "skills": [
        "executing-plans"
      ],
      "prompt_append": "## ⚡ 你的规划模板\n### 输出结构\n1. 任务拆解：原子级子任务列表，标注可并行项\n2. 依赖关系：哪些任务必须等前面的完成\n3. 验收标准：每个子任务的'done'条件\n4. 模型推荐：每个任务建议用哪个category/agent\n5. Skill推荐：每个任务建议加载哪些Skill\n### 关键规则\n- 每个子任务必须可独立验证\n- 并行机会必须明确标注\n- 输出保存为 .sisyphus/plans/*.md 格式"
    },
    "oracle": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "🔮 只读顾问智能体（DeepSeek v4 Pro）——不写代码、不做决策、仅提供分析建议。适用场景：① 多系统架构权衡（微服务 vs 单体）；② 2次以上调试失败后的根因分析；③ 陌生代码模式的安全/性能审查；④ 技术选型对比评估。核心 Skill：zoom-out（全局视角）、grill-with-docs（计划vs文档对照挑战）、improve-codebase-architecture（架构深化建议）。Pro的最强推理模式专为深度思考场景设计。",
      "skills": [
        "zoom-out",
        "grill-with-docs",
        "improve-codebase-architecture"
      ],
      "prompt_append": "## ⚡ 你的分析边界\n### 你可以做\n- 分析架构/代码模式/性能瓶颈\n- 提出多个方案并给出权衡分析\n- 对照文档挑战现有设计\n- 审查安全问题和潜在风险\n### 你绝不能做\n- 写代码、改文件\n- 做最终决策（由Sisyphus决策）\n- 代替其他Agent执行任务"
    },
    "metis": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "📚 长上下文分析专家（DeepSeek v4 Pro，1M上下文窗口）——全库深度分析。适用场景：① 大型代码库架构审查；② 跨模块依赖追踪；③ 长文档（PRD/ADR）综合评审；④ 一次性消化整个仓库的结构和模式输出全局洞察。核心 Skill：zoom-out（拉远视角理解局部代码在全局中的位置）。不同于Oracle的单点分析，Metis擅长全局视角的系统级审查。",
      "skills": [
        "zoom-out"
      ],
      "prompt_append": "## ⚡ 你的分析策略\n### 优势\n- 1M上下文窗口：可一次性读入整个仓库\n- 全局视角：跨模块依赖追踪、架构全景图\n### 与Oracle分工\n- Metis：全局视角、系统级审查、跨模块分析\n- Oracle：单点深度分析、架构决策权衡、根因诊断\n- 需要全景→Metis；需要深度→Oracle"
    },
    "momus": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🔎 代码审查与批评智能体（MiniMax M2.7，Pro审查兜底）——不为礼貌牺牲质量。能力：① 双轴审查（规范合规+需求对齐）；② 利用MiniMax MCP的web_search获取业界最佳实践作为参照基准；③ 给出有据可查的改进建议。核心 Skill：review（双轴审查：Standards+Spec并行）、verification-before-completion（强制验证门禁——声称完成前必须跑验证命令）。触发时机：PR提交前、重大重构后、需要第三方视角时。审查链：review（初步）→ review-work（五重并行终极审查）。",
      "skills": [
        "review",
        "verification-before-completion"
      ],
      "prompt_append": "## ⚡ 你的审查清单\n### 双轴审查(review)\n- Standards轴：代码是否符合项目规范\n- Spec轴：代码是否匹配原始需求\n### 强制验证(verification-before-completion)\n- 触发词：done/complete/finished/fixed→必须先跑验证\n- 验证通过前不说'完成'\n### 审查工具\n- MiniMax MCP web_search：查业界最佳实践做参照\n- lsp_diagnostics：检查Lint/类型错误\n- bash：运行测试/build命令\n### 审查链\n- 日常：review（双轴并行）\n- PR前：review-work（五重并行：Oracle×2 + QA + 上下文挖掘）"
    },
    "explore": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "🔍 极速代码探索（DeepSeek v4 Flash，成本最低速度最快）——内部代码库搜索。能力：闪电级文件搜索、AST模式匹配、代码库结构发现。适用场景：查找特定实现、追踪调用链、扫描代码模式、发现项目约定。可使用MiniMax MCP的web_search查找外部开源代码参考。注意：此为内部搜索Agent，与librarian（外部资料搜索）互补。",
      "prompt_append": "## ⚡ 你的搜索工具箱\n### 内部搜索(代码库)\n- Grep：正则全文搜索\n- Glob：文件名模式匹配\n- ast_grep_search：AST结构化搜索(25种语言)\n- lsp_find_references：查找所有引用\n- lsp_symbols：文档/工作区符号搜索\n### 外部搜索\n- MiniMax MCP web_search：查开源代码参考\n### 互补分工\n- explore → 内部代码库搜索\n- librarian → 外部文档/开源参考查询"
    },
    "librarian": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "📖 文档与外部参考查询（DeepSeek v4 Flash）——外部资料检索。能力：查阅官方API文档、搜索npm/pip/cargo包用法、查找开源实现示例。使用MiniMax MCP的web_search工具检索最新文档和最佳实践。注意：此为外部资料搜索Agent，与explore（内部代码搜索）互补。适合：遇到不熟悉的库/框架时，先查文档再写代码。",
      "prompt_append": "## ⚡ 你的搜索策略\n### 搜索工具\n- MiniMax MCP web_search：实时网页搜索\n- websearch_web_search_exa：语义搜索GitHub等\n- context7_query-docs：Context7文档库查询(先resolve-library-id)\n- grep_app_searchGitHub：GitHub代码搜索\n### 互补分工\n- librarian → 外部文档/API/最佳实践查询\n- explore → 内部代码库搜索"
    },
    "sisyphus-junior": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "👶 Sisyphus辅助（DeepSeek v4 Flash）——处理明确、单一、重复性的子任务。接收Sisyphus明确指令执行，不自行决策。适用：修Lint错误、更新依赖版本、批量重命名、简单格式调整。Flash的低成本适合大量微小任务。",
      "prompt_append": "## ⚡ 你的工作范围\n### 能做\n- 修单文件Lint错误\n- 更新依赖版本号\n- 批量重命名变量/文件\n- 简单格式调整(缩进、换行)\n### 不能做\n- 自行决策架构/设计\n- 跨多文件的复杂改动\n- 需要逻辑推理的任务"
    },
    "multimodal-looker": {
      "model": "opencode-go/mimo-v2.5",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "👁️ 原生全模态视觉分析智能体（MiMo-V2.5，310B参数/15B激活/1M上下文）——支持直接接收粘贴的图片、无需MCP中转。能力：文本+图片+视频+音频理解，原生ViT(7.29亿参数)视觉编码器。适用：粘贴图片分析、截图审查、UI评审、OCR提取、图表解析。核心 Skill：vision-analysis（结构化视觉分析报告）。注意：仅做视觉理解（look），不生成图片（生成用 image-generation category + Atlas）。如MiMo-V2.5图片路由未生效，自动fallback到MiniMax M2.7 + MCP understand_image。",
      "skills": [
        "vision-analysis"
      ],
      "prompt_append": "## ⚡ 你是 MiMo-V2.5——原生全模态模型\n### 原生能力（直接接收，无需MCP）\n- 图片输入：粘贴截图/设计稿/图表直接理解\n- 视频理解：视频帧分析\n- 音频理解：音频内容转录与分析\n### 优势\n- 310B总参数/15B激活（Sparse MoE），1M上下文\n- 7.29亿参数ViT原生视觉编码——比MCP中转快3-5x\n- 端到端理解：图片和文字在同一上下文中推理\n### 备用路径（fallback到MiniMax时）\n- MiniMax_understand_image：MCP图片分析(JPEG/PNG/WebP)\n- vision-analysis技能：结构化视觉报告\n### 不做什么\n- 不生成图片/视频/音频(那是 atlas + image-generation 的活)"
    }
  },
  "categories": {
    "visual-engineering": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🎨 前端/UI/动画/图片生成（MiniMax M2.7执行，Pro推理兜底）。推荐 Skill：frontend-dev（电影级动画Framer Motion/GSAP+AI媒体素材生成）、frontend-ui-ux（设计师级UI/UX）、shader-dev（GLSL着色器特效）、minimax-multimodal-toolkit（通过MiniMax CLI生成图片/视频素材）。适用：着陆页、营销站、产品页、仪表板、媒体素材生成、电影级滚动动画。不适用：纯后端逻辑。",
      "prompt_append": "## 🎨 前端任务必加载Skill\n- frontend-dev：电影级动画(Framer Motion/GSAP)+ AI媒体素材生成\n- frontend-ui-ux：设计师级UI/UX(无设计稿也能出精品)\n- shader-dev：GLSL着色器特效(按需)\n- minimax-multimodal-toolkit：通过MiniMax CLI生成图片/视频素材\n- webapp-testing：Playwright E2E验证前端效果\n### 产出标准\n- 必须带动画效果\n- 响应式设计\n- E2E测试通过"
    },
    "multimodal": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🌐 全模态生成与理解（MiniMax M2.7一站式）。推荐 Skill：minimax-multimodal-toolkit。能力：通过MiniMax CLI调用Hailuo视频生成、Speech语音合成（TTS/声音克隆/多段合成）、Music音乐创作（歌曲/纯音乐）、Image图片生成；通过MCP的understand_image做视觉分析。适用：需要同时产出多种媒体格式的复杂任务。",
      "prompt_append": "## 🌐 全模态任务必加载Skill\n- minimax-multimodal-toolkit：一站式全模态生成\n### MiniMax CLI命令速查\n- 视频生成→minimax video generate\n- 语音合成→minimax speech generate\n- 音乐创作→minimax music generate\n- 图片生成→minimax image generate"
    },
    "video-generation": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🎬 Hailuo 2.3 视频生成（MiniMax M2.7）。推荐 Skill：minimax-multimodal-toolkit。通过MiniMax CLI的视频生成命令，支持：文本到视频(text-to-video)、图片到视频(image-to-video)、首尾帧视频(start-end frame)、主题参考视频(subject reference)、模板化视频、长视频多场景编排。",
      "prompt_append": "## 🎬 视频生成必加载Skill: minimax-multimodal-toolkit\n### 支持模式\n- text-to-video：文本直接生成视频\n- image-to-video：图片+描述生成视频\n- start-end frame：首尾帧控制\n- subject reference：主题参考保持一致性\n- long-form：多场景长视频编排"
    },
    "speech-synthesis": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🎙️ Speech 2.8 语音合成（MiniMax M2.7）。推荐 Skill：minimax-multimodal-toolkit。通过MiniMax CLI的语音合成命令，支持：文本转语音(TTS)、声音克隆、声音设计、多段合成拼接。适用：配音、播客、有声书、语音助手。",
      "prompt_append": "## 🎙️ 语音合成必加载Skill: minimax-multimodal-toolkit\n### 支持能力\n- TTS：文本→自然语音\n- 声音克隆：从样本克隆音色\n- 声音设计：自定义音色参数\n- 多段合成：拼接多段语音为长音频"
    },
    "music-composition": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🎵 Music 2.6 音乐创作（MiniMax M2.7）。推荐 Skill：minimax-multimodal-toolkit。通过MiniMax CLI的音乐生成命令，根据文本描述生成原创歌曲（带歌词+人声）或纯音乐（器乐演奏）。适用：BGM、主题曲、广告配乐。",
      "prompt_append": "## 🎵 音乐创作必加载Skill: minimax-multimodal-toolkit\n### 支持模式\n- 歌曲(song)：带歌词+人声演唱\n- 纯音乐(instrumental)：器乐演奏\n- 风格描述：如'中国风电音'、'钢琴叙事曲'"
    },
    "image-generation": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🖼️ Image 01 图片生成（MiniMax M2.7）。推荐 Skill：minimax-multimodal-toolkit。通过MiniMax CLI的图片生成命令，支持：文本到图片(text-to-image)、图片到图片(image-to-image)、角色参考图生成。适用：营销图、概念图、角色设计、插图。",
      "prompt_append": "## 🖼️ 图片生成必加载Skill: minimax-multimodal-toolkit\n### 支持模式\n- text-to-image：文本描述生成图片\n- image-to-image：参考图+描述生成新图\n- character reference：角色一致性参考生成"
    },
    "local-vision": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/mimo-v2.5"
      ],
      "description": "📂 本地图片文件识别（MiniMax M2.7 + MCP understand_image）——专门处理本地文件路径的图片。使用MiniMax MCP的MiniMax_understand_image工具对本地图片文件（JPEG/PNG/WebP）进行内容分析、OCR文字识别、图表数据提取。推荐 Skill：vision-analysis（结构化视觉分析报告）。与 vision-analysis 区别：本类别聚焦本地文件路径图片，通过MCP工具调用而非原生视觉模型。适用：本地截图分析、图片文件批量处理、文档扫描件识别。",
      "prompt_append": "## 📂 本地图片识别专用通道\n### 工具\n- MiniMax_understand_image：通过文件路径分析图片\n### 适用场景\n- 明确提供本地文件路径的图片（如 /tmp/screenshot.png）\n- 大量图片文件的批量分析\n- 需要结构化OCR输出的文档扫描件\n### 与 vision-analysis 的区别\n- local-vision：专门走 MCP 文件路径分析（专用于本地文件）\n- vision-analysis：通用视觉理解（可直接接收粘贴的图片）\n### 不做什么\n- 不处理非文件路径的图片（粘贴图片→用 vision-analysis）\n- 不生成图片（生成→用 image-generation）"
    },
    "vision-analysis": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "👁️ 视觉理解与分析（MiniMax M2.7）。推荐 Skill：vision-analysis（结构化视觉分析报告）。使用MiniMax MCP的MiniMax_understand_image工具进行：图片内容分析、OCR文字识别、UI界面审查、图表数据提取、设计稿评审、照片场景描述。注意：这是视觉理解类别，不是图片生成——生成图片请用 image-generation category。",
      "prompt_append": "## 👁️ 视觉分析必加载Skill: vision-analysis\n### 分析工具\n- MiniMax_understand_image：核心视觉分析API\n### 输出格式\n- 结构化报告：分类描述+关键发现+建议\n### 不要混淆\n- vision-analysis=图片理解\n- image-generation=图片生成"
    },
    "web-research": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7",
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🌐 上网搜索与资料查找（DeepSeek v4 Flash快速搜索，复杂分析回退到Pro）。工具：MiniMax MCP的web_search（实时搜索）、websearch_web_search_exa（语义搜索GitHub等）。适用：查最新API文档、找开源实现、调研技术方案、获取业界最佳实践、验证技术决策。策略：先用Flash低成本搜，结果不满足时fallback到Pro做深度分析。",
      "prompt_append": "## 🌐 搜索策略\n### 工具选择\n- MiniMax_web_search：中文/实时信息搜索\n- websearch_web_search_exa：英文/语义搜索\n- context7_query-docs：官方文档库查询\n- grep_app_searchGitHub：GitHub代码搜索\n### 成本策略\n- 先用Flash搜（低成本）\n- 结果不足→fallback到Pro做深度分析"
    },
    "quick": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "⚡ 快速修复（DeepSeek v4 Flash最低成本）——单文件typo、简单配置修改、明确小改动。适用：拼写错误、依赖版本号更新、单行配置调整。不适用：需要多文件协调、逻辑推理、架构变更的任务——这些请用 deep 或 ultrabrain。",
      "prompt_append": "## ⚡ 快速修复边界\n### 能做\n- 单文件typo/语法错误\n- 单行配置修改\n- 依赖版本号更新\n### 不能做\n- 多文件协调改动→用 deep\n- 逻辑推理/架构变更→用 ultrabrain\n- 代码重构→用 deep"
    },
    "deep": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "🔬 自主深度研究（DeepSeek v4 Pro强推理）——目标驱动的端到端问题解决。适用：需要自主探索、多步推理、跨文件实现的复杂研究型任务。Pro的强推理能力确保分析的深度和准确性。适合：调研型任务、复杂功能实现探索、多方案对比验证。",
      "prompt_append": "## 🔬 深度研究策略\n### 方法论\n1. 先Explore探索代码库结构\n2. 再Librarian查外部最佳实践\n3. Pro推理整合方案\n4. 输出有据可查的结论\n### 与ultrabrain区别\n- deep：研究+实现（有明确输出）\n- ultrabrain：纯推理（算法/架构/逻辑难题）"
    },
    "artistry": {
      "model": "minimax-cn-coding-plan/MiniMax-M2.7",
      "fallback": [
        "opencode-go/deepseek-v4-pro"
      ],
      "description": "🎭 创意突破（MiniMax M2.7创造性思维）——超越常规模式，用非传统、创新性方法解决复杂问题。推荐 Skill：brainstorming（创意工作前强制需求探索+方案设计）。M2.7的创造性思维擅长跳出框架的解决方案。适用：需要打破常规的设计方案、创新架构探索、非传统解法。",
      "prompt_append": "## 🎭 创意流程\n### 必加载Skill: brainstorming\n1. 需求探索：理解用户真实意图\n2. 方案发散：3+个不同方向的方案\n3. 方案评估：可行性/创新性/成本\n4. 原型验证：低成本快速试错\n### 与其他category区别\n- artistry=跳出框架的创新方案\n- deep=深入研究+落地实现\n- ultrabrain=硬核逻辑推理"
    },
    "ultrabrain": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "🧠 硬核推理（DeepSeek v4 Pro最强模式）——仅用于真正困难、逻辑密集型任务。给明确目标而非分步指令，让Pro自行推理最优路径。适用：复杂算法设计、深层架构决策、多系统协同难题、高难度数学/逻辑问题。不适用：日常编码、简单重构——这些请用 deep。",
      "prompt_append": "## 🧠 硬核推理策略\n### 适用场景\n- 复杂算法设计与优化\n- 多系统架构权衡决策\n- 高难度数学/逻辑证明\n- 分布式系统协同方案\n### 与deep区别\n- ultrabrain：给目标→自己推理最优路径(不干预)\n- deep：自主探索+分步实现(可干预)\n### 不要滥用\n- 日常代码→用 quick/deep\n- 简单算法→用 deep"
    },
    "unspecified-low": {
      "model": "opencode-go/deepseek-v4-flash",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "📦 未分类低难度任务（DeepSeek v4 Flash）——不属于特定类别但工作量小的通用任务。Flash的低成本确保效率。适用：不属于以上任何特定类别的小型任务。如不确定难度，先看是否匹配 quick/deep 等其他类别。",
      "prompt_append": "## 📦 使用提醒\n- 这是fallback类别，优先匹配 quick/deep 等专项类别\n- 仅用于小型通用任务\n- 如发现任务有明确特征→切换到适配的category"
    },
    "unspecified-high": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "📦 未分类高难度任务（DeepSeek v4 Pro）——不属于特定类别但需要强推理的通用任务。Pro的深度思考能力确保输出质量。适用：不属于以上任何特定类别但复杂度较高的任务。如不确定难度，优先匹配 deep/ultrabrain/artistry 等专项类别。",
      "prompt_append": "## 📦 使用提醒\n- 这是fallback类别，优先匹配 deep/ultrabrain/artistry 等专项类别\n- 仅用于高复杂度通用任务\n- 如发现任务有明确特征→切换到适配的category"
    },
    "writing": {
      "model": "opencode-go/deepseek-v4-pro",
      "fallback": [
        "minimax-cn-coding-plan/MiniMax-M2.7"
      ],
      "description": "✍️ 文档与写作（DeepSeek v4 Pro语感和逻辑）——专业技术写作。产出：技术文档、设计说明、API文档、Release Notes、架构决策记录(ADR)、PRD。推荐 Skill：minimax-pdf（专业PDF）、minimax-docx（Word文档）、pptx-generator（PPT演示）、to-prd（需求文档）。Pro的语感和逻辑性确保文档清晰准确。",
      "prompt_append": "## ✍️ 写作任务Skill选择\n### 文档类型→推荐Skill\n- 技术报告/设计文档→minimax-pdf(专业排版)\n- Word文档/合同→minimax-docx\n- PPT演示→pptx-generator\n- PRD需求文档→to-prd\n- 纯Markdown→直接写(不需要额外Skill)\n### 关键规则\n- 专业文档必须用对应Skill生成(不用手写Markdown)\n- 排版美观度是验收标准之一"
    }
  }
}
```
