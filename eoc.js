#!/usr/bin/env node

/**
 * eoc.js — Efficient-OpenCode 配置切换器 v1.0
 * 单文件 Node.js 工具，零 npm 依赖，纯内置模块。
 *
 * 功能：
 *   ./eoc             智能入口（未安装→安装流程，已安装→切换流程）
 *   ./eoc install     交互式安装（选择引擎+Prompt模式）
 *   ./eoc switch      交互式切换配置
 *   ./eoc status      查看当前配置状态
 *   ./eoc rollback    回滚到历史备份
 */

'use strict';

// ============================================================
// 模块引入（仅 Node.js 内置模块）
// ============================================================
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { execSync } = require('child_process');

// ============================================================
// 全局常量
// ============================================================

/** 源配置目录（相对于本脚本所在位置） */
const SOURCE_DIR = path.join(__dirname, 'configs');

/** 版本号 */
const VERSION = '1.1.0';

/**
 * ANSI 颜色码（零依赖终端着色）
 */
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  white: '\x1b[37m',
};

/**
 * 快捷着色函数
 */
const c = {
  success: (s) => COLORS.green + s + COLORS.reset,
  warning: (s) => COLORS.yellow + s + COLORS.reset,
  error: (s) => COLORS.red + s + COLORS.reset,
  info: (s) => COLORS.blue + s + COLORS.reset,
  dim: (s) => COLORS.dim + s + COLORS.reset,
  bold: (s) => COLORS.bold + s + COLORS.reset,
  cyan: (s) => COLORS.cyan + s + COLORS.reset,
  magenta: (s) => COLORS.magenta + s + COLORS.reset,
};

/**
 * 计算字符串在终端中的显示宽度
 * 中文/全角字符 = 2列，ASCII/半角 = 1列
 * @param {string} str - 原始字符串（可含 ANSI 转义码）
 * @returns {number} 终端显示列数
 */
function displayWidth(str) {
  // 先去除 ANSI 转义码
  const clean = str.replace(/\x1b\[[0-9;]*m/g, '');
  let width = 0;
  for (const ch of clean) {
    const code = ch.codePointAt(0);
    // CJK Unified, Hiragana, Katakana, Hangul, full-width forms, etc.
    if ((code >= 0x1100 && code <= 0x115F) ||   // Hangul Jamo
        (code >= 0x2E80 && code <= 0xA4CF) ||   // CJK Radicals ~ Yi Radicals
        (code >= 0xA960 && code <= 0xA97C) ||   // Hangul Jamo Extended-A
        (code >= 0xAC00 && code <= 0xD7AF) ||   // Hangul Syllables
        (code >= 0xF900 && code <= 0xFAFF) ||   // CJK Compatibility Ideographs
        (code >= 0xFE10 && code <= 0xFE19) ||   // Vertical forms
        (code >= 0xFE30 && code <= 0xFE6F) ||   // CJK Compatibility Forms
        (code >= 0xFF01 && code <= 0xFF60) ||   // Fullwidth Forms
        (code >= 0xFFE0 && code <= 0xFFE6) ||   // Fullwidth Signs
        (code >= 0x1F300 && code <= 0x1F64F) || // Emoticons / Emoji
        (code >= 0x1F680 && code <= 0x1F6FF) || // Transport Symbols
        (code >= 0x2600 && code <= 0x26FF)) {   // Misc Symbols
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

// ============================================================
// 配置路径辅助函数（支持项目级/全局级双部署）
// ============================================================

/**
 * 获取目标配置目录
 * @param {'auto'|'global'|'project'} target - 配置目标级别
 * @returns {string} 配置目录路径
 */
function getConfigDir(target) {
  if (target === 'project') {
    return path.join(process.cwd(), '.opencode');
  }
  if (target === 'global') {
    return path.join(os.homedir(), '.config', 'opencode');
  }
  // auto: 优先检测项目级配置
  if (fs.existsSync(path.join(process.cwd(), '.opencode', 'oh-my-openagent.json'))) {
    return path.join(process.cwd(), '.opencode');
  }
  return path.join(os.homedir(), '.config', 'opencode');
}

/**
 * 获取目标 oh-my-openagent.json 文件路径
 * @param {string} target - 配置目标级别
 * @returns {string} 完整文件路径
 */
function getTargetFile(target) {
  return path.join(getConfigDir(target), 'oh-my-openagent.json');
}

/**
 * 检测全局 eoc 命令是否已设置
 * 优先检查 .bashrc 中的注释标记，后备检查仓库目录下的软链接
 * @returns {boolean}
 */
function hasProjectConfig() {
  return fs.existsSync(path.join(process.cwd(), '.opencode', 'oh-my-openagent.json'));
}

/**
 * 检查全局级配置是否存在
 * @returns {boolean}
 */
function hasGlobalConfig() {
  return fs.existsSync(path.join(os.homedir(), '.config', 'opencode', 'oh-my-openagent.json'));
}

/**
 * 将当前全局级配置快速部署为项目级配置
 * 直接复制 ~/.config/opencode/ 下的文件到 ./.opencode/
 */
function deployProjectConfig() {
  const globalDir = path.join(os.homedir(), '.config', 'opencode');
  const projectDir = path.join(process.cwd(), '.opencode');

  fs.mkdirSync(projectDir, { recursive: true });

  // 复制 oh-my-openagent.json
  const agentFile = path.join(globalDir, 'oh-my-openagent.json');
  if (fs.existsSync(agentFile)) {
    fs.copyFileSync(agentFile, path.join(projectDir, 'oh-my-openagent.json'));
  }

  // 复制 opencode.json
  const opencodeFile = path.join(globalDir, 'opencode.json');
  if (fs.existsSync(opencodeFile)) {
    fs.copyFileSync(opencodeFile, path.join(projectDir, 'opencode.json'));
  }

  // 复制 easy-vision config
  const visionFile = path.join(globalDir, 'opencode-minimax-easy-vision.jsonc');
  if (fs.existsSync(visionFile)) {
    fs.copyFileSync(visionFile, path.join(projectDir, 'opencode-minimax-easy-vision.jsonc'));
  }

  console.log(`✅ 项目级配置已部署到 ${projectDir}/`);
}

/**
 * 询问用户 Y/n 确认
 * @param {string} question - 问题文本
 * @param {boolean} defaultYes - true=默认Y, false=默认N
 * @returns {Promise<boolean>} 用户回答
 */
function askYesNo(question, defaultYes) {
  defaultYes = defaultYes || false;
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const hint = defaultYes ? '[Y/n]' : '[y/N]';
    rl.question(`${question} ${hint} `, (answer) => {
      rl.close();
      const ans = answer.trim().toLowerCase();
      if (ans === '') {
        resolve(defaultYes);
      } else {
        resolve(ans === 'y' || ans === 'yes');
      }
    });
  });
}

/**
 * 检查全局 eoc 命令是否已设置
 * 检测 .bashrc 中是否有 repo 目录的 PATH 条目
 * @returns {boolean}
 */
function isGlobalCommandSet() {
  // 优先检查 .bashrc 中的注释标记（setupGlobalCommand 写入的可靠标识）
  const bashrcPath = path.join(os.homedir(), '.bashrc');
  if (fs.existsSync(bashrcPath)) {
    const content = fs.readFileSync(bashrcPath, 'utf-8');
    if (content.includes('# eoc - Efficient-OpenCode 配置切换器全局命令')) {
      return true;
    }
  }
  // 后备检查：仓库目录下的 eoc 软链接是否存在
  const symlinkPath = path.join(__dirname, 'eoc');
  return fs.existsSync(symlinkPath);
}

/**
 * 设置全局 eoc 命令
 * 1. 创建软链接 eoc -> eoc.js（在仓库目录）
 * 2. 添加 PATH 条目到 ~/.bashrc
 * @returns {string} 状态消息
 */
function setupGlobalCommand() {
  const repoDir = __dirname;

  // 1. 创建软链接
  const symlinkPath = path.join(repoDir, 'eoc');
  if (!fs.existsSync(symlinkPath)) {
    fs.symlinkSync('eoc.js', symlinkPath);
  }

  // 2. 检查 .bashrc 是否已有条目
  const bashrcPath = path.join(os.homedir(), '.bashrc');
  if (fs.existsSync(bashrcPath)) {
    const content = fs.readFileSync(bashrcPath, 'utf-8');
    const pattern = new RegExp(`export\\s+PATH\\s*=\\s*"${repoDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\$PATH"`);
    const eocComment = /# eoc - Efficient-OpenCode/.test(content);
    if (pattern.test(content) && eocComment) {
      return 'already_set';
    }
  }

  // 3. 添加 PATH 条目
  const pathLine = `\n# eoc - Efficient-OpenCode 配置切换器全局命令\nexport PATH="${repoDir}:$PATH"\n`;
  fs.appendFileSync(bashrcPath, pathLine);

  return 'setup_done';
}

// ============================================================
// 指纹数据库 — 用于检测当前激活的配置方案
// ============================================================

/**
 * 配置指纹列表，每条指纹包含：
 * - id: 唯一标识
 * - label: 中文显示名
 * - sourceFile: 对应的 configs/ 源文件
 * - cliFlag: 命令行参数标识
 * - modelKeys: {pro, fast, exec} 三引擎模型 ID
 * - description: 简短说明
 */
const FINGERPRINTS = [
  {
    id: 'deepseek-append',
    label: 'DeepSeek V4 Pro + MiniMax M2.7（追加模式）',
    sourceFile: 'oh-my-openagent-deepseek.json',
    cliFlag: 'deepseek',
    modelKeys: {
      pro: 'opencode-go/deepseek-v4-pro',
      fast: 'opencode-go/deepseek-v4-flash',
      exec: 'minimax-cn-coding-plan/MiniMax-M2.7',
    },
    description: '推理: DeepSeek V4 Pro | 轻量: DeepSeek V4 Flash | 执行: MiniMax M2.7',
  },
  {
    id: 'deepseek-prompt',
    label: 'DeepSeek V4 Pro + MiniMax M2.7（覆盖模式）',
    sourceFile: 'oh-my-openagent-deepseek-prompt.json',
    cliFlag: 'deepseek',
    modelKeys: {
      pro: 'opencode-go/deepseek-v4-pro',
      fast: 'opencode-go/deepseek-v4-flash',
      exec: 'minimax-cn-coding-plan/MiniMax-M2.7',
    },
    description: '推理: DeepSeek V4 Pro | 轻量: DeepSeek V4 Flash | 执行: MiniMax M2.7',
  },
  {
    id: 'mimo-append',
    label: 'MiMo V2.5 + MiniMax M2.7（追加模式）',
    sourceFile: 'oh-my-openagent-mimo.json',
    cliFlag: 'mimo',
    modelKeys: {
      pro: 'xiaomi-token-plan-cn/mimo-v2.5-pro',
      fast: 'xiaomi-token-plan-cn/mimo-v2.5',
      exec: 'minimax-cn-coding-plan/MiniMax-M2.7',
    },
    description: '推理: MiMo V2.5 Pro | 轻量: MiMo V2.5 | 执行: MiniMax M2.7',
  },
  {
    id: 'mimo-prompt',
    label: 'MiMo V2.5 + MiniMax M2.7（覆盖模式）',
    sourceFile: 'oh-my-openagent-mimo-prompt.json',
    cliFlag: 'mimo',
    modelKeys: {
      pro: 'xiaomi-token-plan-cn/mimo-v2.5-pro',
      fast: 'xiaomi-token-plan-cn/mimo-v2.5',
      exec: 'minimax-cn-coding-plan/MiniMax-M2.7',
    },
    description: '推理: MiMo V2.5 Pro | 轻量: MiMo V2.5 | 执行: MiniMax M2.7',
  },
  {
    id: 'minimax-append',
    label: '纯 MiniMax M2.7（追加模式）',
    sourceFile: 'oh-my-openagent-minimax.json',
    cliFlag: 'minimax',
    modelKeys: {
      pro: 'minimax-cn-coding-plan/MiniMax-M2.7',
      fast: 'minimax-cn-coding-plan/MiniMax-M2.7',
      exec: 'minimax-cn-coding-plan/MiniMax-M2.7',
    },
    description: '全引擎: MiniMax M2.7（单引擎方案）',
  },
  {
    id: 'minimax-prompt',
    label: '纯 MiniMax M2.7（覆盖模式）',
    sourceFile: 'oh-my-openagent-minimax-prompt.json',
    cliFlag: 'minimax',
    modelKeys: {
      pro: 'minimax-cn-coding-plan/MiniMax-M2.7',
      fast: 'minimax-cn-coding-plan/MiniMax-M2.7',
      exec: 'minimax-cn-coding-plan/MiniMax-M2.7',
    },
    description: '全引擎: MiniMax M2.7（单引擎方案）',
  },
  {
    id: 'template-append',
    label: '自定义模板（追加模式）',
    sourceFile: 'oh-my-openagent-template.json',
    cliFlag: 'template',
    modelKeys: {
      pro: '__PRO_MODEL__',
      fast: '__FAST_MODEL__',
      exec: '__EXEC_MODEL__',
    },
    description: '自定义模型（安装时输入模型 ID）',
  },
  {
    id: 'template-prompt',
    label: '自定义模板（覆盖模式）',
    sourceFile: 'oh-my-openagent-template-prompt.json',
    cliFlag: 'template',
    modelKeys: {
      pro: '__PRO_MODEL__',
      fast: '__FAST_MODEL__',
      exec: '__EXEC_MODEL__',
    },
    description: '自定义模型（安装时输入模型 ID）',
  },
  {
    id: 'template2-append',
    label: '自定义模板 双引擎（追加模式）',
    sourceFile: 'oh-my-openagent-template2.json',
    cliFlag: 'template2',
    modelKeys: {
      pro: '__PRO_MODEL__',
      fast: '__FAST_MODEL__',
      exec: 'minimax-cn-coding-plan/MiniMax-M2.7',
    },
    description: '自定义 Pro/Fast 模型 + 执行/回退 MiniMax M2.7',
  },
  {
    id: 'template2-prompt',
    label: '自定义模板 双引擎（覆盖模式）',
    sourceFile: 'oh-my-openagent-template2-prompt.json',
    cliFlag: 'template2',
    modelKeys: {
      pro: '__PRO_MODEL__',
      fast: '__FAST_MODEL__',
      exec: 'minimax-cn-coding-plan/MiniMax-M2.7',
    },
    description: '自定义 Pro/Fast 模型 + 执行/回退 MiniMax M2.7',
  },
];

// ============================================================
// 实用函数
// ============================================================

/**
 * 格式化时间戳为 YYYY-MM-DD-HHmmss 格式
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的时间戳字符串
 */
function formatTimestamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

/**
 * 检测当前激活的配置方案（3层降级）
 * - tier 'exact': 三个模型全部匹配
 * - tier 'partial': 仅 Pro 模型匹配（配置可能已被手动修改）
 * - tier 'unknown': 无法识别
 * @param {string} target - 配置目标级别
 * @returns {{ fingerprint: object|null, tier: string, label: string }}
 */
function detectCurrent(target) {
  const targetFile = getTargetFile(target);
  if (!fs.existsSync(targetFile)) {
    return { fingerprint: null, tier: 'unknown', label: '未安装' };
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
  } catch {
    return { fingerprint: null, tier: 'unknown', label: '配置文件已损坏' };
  }

  // 读取关键 Agent 的 model 字段
  const sisyphusModel = config.agents?.sisyphus?.model;
  const exploreModel = config.agents?.explore?.model;
  const atlasModel = config.agents?.atlas?.model;

  // 第1层：完全匹配（三个模型都吻合）
  for (const fp of FINGERPRINTS) {
    if (
      sisyphusModel === fp.modelKeys.pro &&
      exploreModel === fp.modelKeys.fast &&
      atlasModel === fp.modelKeys.exec
    ) {
      return { fingerprint: fp, tier: 'exact', label: fp.label };
    }
  }

  // 第2层：部分匹配（仅 Pro 模型吻合）
  for (const fp of FINGERPRINTS) {
    if (sisyphusModel === fp.modelKeys.pro) {
      return { fingerprint: fp, tier: 'partial', label: `已修改 — ${fp.label}` };
    }
  }

  // 第3层：完全未知
  return {
    fingerprint: null,
    tier: 'unknown',
    label: `自定义配置（Sisyphus: ${sisyphusModel || '?'}）`,
  };
}

/**
 * 列出备份文件，按时间倒序排列
 * @param {string} target - 配置目标级别
 * @returns {Array<{name: string, path: string, timestamp: string}>}
 */
function listBackupFiles(target) {
  const backupDir = path.join(getConfigDir(target), 'backups');
  if (!fs.existsSync(backupDir)) return [];

  return fs
    .readdirSync(backupDir)
    .filter((f) => f.endsWith('-oh-my-openagent.json'))
    .map((f) => ({
      name: f,
      path: path.join(backupDir, f),
      timestamp: f.replace('-oh-my-openagent.json', ''),
    }))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * 清理旧备份，只保留最近 N 个
 * @param {string} target - 配置目标级别
 * @param {number} keepCount - 保留数量
 */
function cleanOldBackups(target, keepCount) {
  const backups = listBackupFiles(target);
  if (backups.length <= keepCount) return;
  backups.slice(keepCount).forEach((b) => {
    try { fs.unlinkSync(b.path); } catch (e) { console.warn('⚠ 清理旧备份失败:', e.message); }
  });
}

/**
 * 备份当前配置到带时间戳的文件
 * 如果当前配置与最新备份内容相同，则跳过以去重
 * @param {string} target - 配置目标级别
 * @returns {string|null} 备份文件路径，如果跳过则返回 null
 */
function backupCurrent(target) {
  const targetFile = getTargetFile(target);
  if (!fs.existsSync(targetFile)) return null;

  const configDir = getConfigDir(target);
  const backupDir = path.join(configDir, 'backups');
  fs.mkdirSync(backupDir, { recursive: true });

  const currentContent = fs.readFileSync(targetFile, 'utf-8');

  // 去重：如果最新备份内容相同则跳过
  const backups = listBackupFiles(target);
  if (backups.length > 0) {
    try {
      const latestContent = fs.readFileSync(backups[0].path, 'utf-8');
      if (currentContent === latestContent) return null;
    } catch (e) { console.warn('⚠ 备份去重检查失败:', e.message); }
  }

  const timestamp = formatTimestamp(new Date());
  const backupFile = path.join(backupDir, `${timestamp}-oh-my-openagent.json`);
  fs.copyFileSync(targetFile, backupFile);

  cleanOldBackups(target, 10);
  return backupFile;
}

/**
 * 执行配置切换：复制源文件到目标
 * @param {string} sourceFile - configs/ 下的源文件名
 * @param {string} target - 配置目标级别
 */
function switchTo(sourceFile, target) {
  const sourcePath = path.join(SOURCE_DIR, sourceFile);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`源文件不存在: ${sourcePath}`);
  }
  const configDir = getConfigDir(target);
  fs.mkdirSync(configDir, { recursive: true });
  fs.copyFileSync(sourcePath, getTargetFile(target));
}

/**
 * 用用户输入的模型 ID 填充模板占位符
 * @param {string} sourceFile - 模板文件名
 * @param {{pro: string, fast: string, exec: string, fallback: string}} models
 * @returns {string} 填充后的 JSON 内容
 */
function fillTemplate(sourceFile, models) {
  const sourcePath = path.join(SOURCE_DIR, sourceFile);
  let content = fs.readFileSync(sourcePath, 'utf-8');
  content = content.replaceAll('__PRO_MODEL__', models.pro);
  content = content.replaceAll('__FAST_MODEL__', models.fast);
  content = content.replaceAll('__EXEC_MODEL__', models.exec);
  content = content.replaceAll('__FALLBACK_MODEL__', models.fallback);
  // 验证 JSON 合法性
  JSON.parse(content);
  return content;
}

/**
 * 从指纹获取对应的源文件名
 * @param {string} engine - 引擎标识 ('mimo'|'deepseek'|'minimax'|'template')
 * @param {string} promptMode - 模式标识 ('append'|'prompt')
 * @returns {string} 源文件名
 */
function getSourceFile(engine, promptMode) {
  const suffix = promptMode === 'prompt' ? '-prompt' : '';
  return `oh-my-openagent-${engine}${suffix}.json`;
}

// ============================================================
// 命令行参数解析
// ============================================================

/**
 * 解析命令行参数
 * eoc [command] [options]
 * Commands: install, switch, status, rollback
 * Options: --mimo, --deepseek, --minimax, --template, --prompt, --global
 * @returns {{ command: string|null, engine: string|null, promptMode: string, global: boolean }}
 */
function parseArgs() {
  const rawArgs = process.argv.slice(2);

  const result = {
    command: null,
    engine: null,
    promptMode: 'append',
    global: false,
  };

  for (const arg of rawArgs) {
    // 以 - 开头的是标志
    if (arg.startsWith('-')) {
      if (arg === '--mimo' || arg === '-m') result.engine = 'mimo';
      else if (arg === '--deepseek' || arg === '-d') result.engine = 'deepseek';
      else if (arg === '--minimax' || arg === '-x') result.engine = 'minimax';
      else if (arg === '--template' || arg === '-t') result.engine = 'template';
      else if (arg === '--template2' || arg === '-2') result.engine = 'template2';
      else if (arg === '--prompt' || arg === '-p') result.promptMode = 'prompt';
      else if (arg === '--global' || arg === '-g') result.global = true;
      else if (arg === '--help' || arg === '-h') result.command = 'help';
      else if (arg === '--version' || arg === '-v') result.command = 'version';
      // 忽略其他未知标志
    } else if (!result.command) {
      // 第一个非标志参数 = 命令
      result.command = arg;
    }
  }

  return result;
}

// ============================================================
// 交互式菜单（纯 ANSI 转义序列，零依赖）
// ============================================================

/**
 * 创建箭头键交互式菜单
 * @param {Array<{label: string, value: any, isCurrent?: boolean}>} items - 菜单项
 * @param {number} defaultIndex - 默认选中索引
 * @param {string} title - 菜单标题
 * @param {string|null} currentLabel - 当前配置标签（可选，放在顶部显示）
 * @param {string|null} currentDesc - 当前配置详情（可选）
 * @returns {Promise<{action: string, index?: number}>}
 *   action: 'select'|'detail'|'rollback'|'quit'
 */
function createMenu(items, defaultIndex, title, currentLabel, currentDesc) {
  return new Promise((resolve) => {
    const stdin = process.stdin;

    // 确保 stdin 可用
    if (!stdin.isTTY) {
      // 非 TTY 环境降级：打印菜单后退出
      console.log(`\n${title}`);
      items.forEach((item, i) => {
        const prefix = i === defaultIndex ? ' ❯ ' : '   ';
        const suffix = item.isCurrent ? ' ← 当前' : '';
        console.log(`${prefix}${item.label}${suffix}`);
      });
      resolve({ action: 'quit' });
      return;
    }

    // 切换到备用屏幕缓冲区（独立画布，退出时自动恢复）
    process.stdout.write('\x1b[?1049h');

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf-8');

    let selected = defaultIndex || 0;

    // 隐藏光标
    process.stdout.write('\x1b[?25l');

    function render() {
      // 清空备用屏幕缓冲区
      process.stdout.write('\x1b[2J\x1b[H');

      const boxW = 54;
      const out = process.stdout.write.bind(process.stdout);
      const nl = () => out('\n');

      // 顶部边框
      out(`${COLORS.cyan}╔${'═'.repeat(boxW - 2)}╗${COLORS.reset}`); nl();
      out(`${COLORS.cyan}║${COLORS.reset}${' '.repeat(boxW - 2)}${COLORS.cyan}║${COLORS.reset}`); nl();

      // 标题行
      const titleLine = `  ${title}  `;
      const titleLineW = displayWidth(titleLine);
      const padT = Math.floor((boxW - 4 - titleLineW) / 2);
      out(`${COLORS.cyan}║${COLORS.reset}${' '.repeat(padT)}${COLORS.bold}${titleLine}${COLORS.reset}${' '.repeat(boxW - 4 - padT - titleLineW)}${COLORS.cyan}║${COLORS.reset}`); nl();

      // 当前配置信息
      if (currentLabel && currentLabel !== '未安装') {
        out(`${COLORS.cyan}╠${'═'.repeat(boxW - 2)}╣${COLORS.reset}`); nl();
        const star = `${COLORS.cyan}⭐${COLORS.reset} 当前: `;
        const labelW = displayWidth(currentLabel);
        const labelText = labelW > (boxW - 12) ? currentLabel.substring(0, boxW - 15) + '…' : currentLabel;
        out(`${COLORS.cyan}║${COLORS.reset} ${star}${labelText}${' '.repeat(Math.max(0, boxW - 5 - 9 - displayWidth(labelText)))}${COLORS.cyan}║${COLORS.reset}`); nl();
        if (currentDesc) {
          const descText = `    ${currentDesc}`;
          out(`${COLORS.cyan}║${COLORS.reset} ${COLORS.dim}${descText}${COLORS.reset}${' '.repeat(Math.max(0, boxW - 5 - displayWidth(descText)))}${COLORS.cyan}║${COLORS.reset}`); nl();
        }
      } else if (currentLabel === '未安装') {
        out(`${COLORS.cyan}╠${'═'.repeat(boxW - 2)}╣${COLORS.reset}`); nl();
        const warnText = ' ⚠  当前未安装 OhMyOpenAgent 配置';
        out(`${COLORS.cyan}║${COLORS.reset} ${COLORS.yellow}⚠${COLORS.reset}  ${COLORS.yellow}当前未安装 OhMyOpenAgent 配置${COLORS.reset}${' '.repeat(Math.max(0, boxW - 5 - displayWidth(warnText)))}${COLORS.cyan}║${COLORS.reset}`); nl();
      }

      // 选项列表分隔
      out(`${COLORS.cyan}╠${'═'.repeat(boxW - 2)}╣${COLORS.reset}`); nl();
      const selectPrompt = '  ? 选择要切换的配置:';
      out(`${COLORS.cyan}║${COLORS.reset}${selectPrompt}${' '.repeat(Math.max(0, boxW - 4 - displayWidth(selectPrompt)))}${COLORS.cyan}║${COLORS.reset}`); nl();

      // 渲染每个选项
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isSelected = i === selected;
        const prefix = isSelected ? `${COLORS.bold}${COLORS.cyan} ❯${COLORS.reset}` : '  ';
        const suffix = item.isCurrent ? ` ${COLORS.cyan}← 当前${COLORS.reset}` : '';

        let line = `${prefix} ${item.label}${suffix}`;
        const visibleLen = visibleLength(line);
        const pad = Math.max(0, boxW - 4 - visibleLen);
        out(`${COLORS.cyan}║${COLORS.reset}${line}${' '.repeat(pad)}${COLORS.cyan}║${COLORS.reset}`); nl();
      }

      // 底部操作提示
      out(`${COLORS.cyan}╠${'═'.repeat(boxW - 2)}╣${COLORS.reset}`); nl();
      const footer = '[↑↓] 移动  [Enter] 确认  [D] 详情  [B] 回滚  [Q] 退出';
      out(`${COLORS.cyan}║${COLORS.reset}  ${COLORS.dim}${footer}${COLORS.reset}${' '.repeat(Math.max(0, boxW - 4 - displayWidth(footer)))}${COLORS.cyan}║${COLORS.reset}`); nl();

      out(`${COLORS.cyan}╚${'═'.repeat(boxW - 2)}╝${COLORS.reset}`); nl();
    }

    /**
     * 计算字符串可见字符长度（去除 ANSI 转义码）
     * @param {string} str - 含 ANSI 码的字符串
     * @returns {number} 可见长度
     */
    function visibleLength(str) {
      return displayWidth(str);
    }

    /**
     * 按键处理回调
     */
    function onData(key) {
      // 箭头键（3字节序列: ESC [ A/B/C/D）
      if (key === '\x1b[A') {
        // 上箭头
        selected = (selected - 1 + items.length) % items.length;
        render();
      } else if (key === '\x1b[B') {
        // 下箭头
        selected = (selected + 1) % items.length;
        render();
      } else if (key === '\r' || key === '\n') {
        // Enter 键 — 确认选择
        cleanup();
        resolve({ action: 'select', index: selected });
      } else if (key === 'd' || key === 'D') {
        // D 键 — 查看详情
        cleanup();
        resolve({ action: 'detail', index: selected });
      } else if (key === 'b' || key === 'B') {
        // B 键 — 回滚
        cleanup();
        resolve({ action: 'rollback' });
      } else if (key === 'q' || key === 'Q') {
        // Q 键 — 退出
        cleanup();
        resolve({ action: 'quit' });
      } else if (key === '\x03') {
        // Ctrl+C — 退出
        cleanup();
        console.log(''); // 换行
        process.exit(0);
      }
      // 忽略其他按键
    }

    /**
     * 清理终端状态
     */
    function cleanup() {
      // 恢复主屏幕缓冲区
      process.stdout.write('\x1b[?1049l');
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
      process.stdout.write('\x1b[?25h'); // 显示光标
    }

    // Ctrl+C 恢复屏幕后退出
    process.on('SIGINT', () => {
      cleanup();
      process.exit(0);
    });

    stdin.on('data', onData);
    render();
  });
}

// ============================================================
// 详情展示
// ============================================================

/**
 * 展示某个指纹配置的详细信息
 * @param {object} fp - 指纹对象
 */
function showDetail(fp) {
  console.log('');
  console.log(`${COLORS.cyan}╔══════════════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  ${COLORS.bold}${fp.label}${COLORS.reset}`);
  console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  源文件: ${fp.sourceFile}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  引擎标识: ${fp.cliFlag}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  推理模型 (Pro):   ${fp.modelKeys.pro}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  轻量模型 (Fast):  ${fp.modelKeys.fast}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  执行模型 (Exec):  ${fp.modelKeys.exec}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  💡 ${fp.description}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  ${COLORS.yellow}⚠️  请确认已在 OpenCode 中 /connect 连接以上模型${COLORS.reset}`);
  console.log(`${COLORS.cyan}╚══════════════════════════════════════════════════════╝${COLORS.reset}`);
  console.log('');
}

// ============================================================
// 按键等待
// ============================================================

/**
 * 等待用户按任意键继续
 * @param {string} msg - 提示信息
 * @returns {Promise<void>}
 */
function pressAnyKey(msg) {
  if (!process.stdin.isTTY) return Promise.resolve();
  msg = msg || '按任意键继续...';
  return new Promise((resolve) => {
    console.log(`\n${COLORS.dim}${msg}${COLORS.reset}`);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf-8');
    const onData = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
      resolve();
    };
    stdin.once('data', onData);
  });
}

// ============================================================
// 命令行参数输入
// ============================================================

/**
 * 创建 readline 接口用于非 raw 模式的文本输入
 * @returns {readline.Interface}
 */
function createReadline() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
}

// ============================================================
// 命令: install
// ============================================================

/**
 * 安装流程
 * @param {string} target - 配置目标级别 ('global'|'project')
 * @param {string|null} engine - 引擎标识
 * @param {string} promptMode - Prompt 注入模式
 */
async function cmdInstall(target, engine, promptMode) {
  const isProject = target === 'project';

  console.log(`\n${COLORS.cyan}╔══════════════════════════════════════════════════════╗${COLORS.reset}`);
  const levelLabel = isProject ? '📁 项目级' : '👤 用户级';
  console.log(`${COLORS.cyan}║${COLORS.reset}        ${COLORS.bold}🚀 Efficient-OpenCode ${levelLabel}安装 v${VERSION}${COLORS.reset}`);
  console.log(`${COLORS.cyan}╚══════════════════════════════════════════════════════╝${COLORS.reset}`);
  console.log('');

  // ---- 全局级才检查依赖 ----
  if (!isProject) {
    console.log(`${c.info('🔍')} 检查依赖…\n`);

    // OpenCode 必须存在
    let opencodeFound = false;
    let opencodeVersion = '';
    try {
      opencodeVersion = execSync('opencode --version', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      console.log(`  ${c.success('✅')} OpenCode: ${opencodeVersion}`);
      opencodeFound = true;
    } catch {
      try {
        const which = execSync('which opencode', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
        console.log(`  ${c.warning('⚠')} OpenCode 已安装但版本检测失败 (${which})`);
        opencodeFound = true;
      } catch {}
    }
    if (!opencodeFound) {
      console.log(`  ${c.error('❌')} OpenCode 未安装！请先安装 OpenCode。`);
      console.log(`  ${c.dim('安装命令: curl -fsSL https://opencode.ai/install | bash')}`);
      process.exit(1);
    }

    // Node.js
    try {
      const v = execSync('node --version', { encoding: 'utf-8' }).trim();
      console.log(`  ${c.success('✅')} Node.js: ${v}`);
    } catch {
      console.log(`  ${c.warning('⚠')} Node.js 未检测到，脚本功能可能受限`);
    }

    console.log('');
  }

  // ---- 选择引擎 ----
  promptMode = promptMode || 'append';

  if (!engine) {
    // 非 TTY 降级
    if (!process.stdin.isTTY) {
      console.log(`${c.warning('⚠')} 非交互环境，默认使用 MiMo + 追加模式`);
      engine = 'mimo';
    } else {
      engine = await selectEngineInteractive();
      if (!engine) {
        console.log(`${c.dim('已取消')}`);
        process.exit(0);
      }
    }
  }

  // ---- 选择 Prompt 模式 ----
  // 交互模式下让用户选
  if (process.stdin.isTTY) {
    const interactiveEngine = engine; // 只有在交互选择时才问 prompt 模式
    if (interactiveEngine && !promptMode) {
      promptMode = await selectPromptModeInteractive();
      if (!promptMode) {
        console.log(`${c.dim('已取消')}`);
        process.exit(0);
      }
    }
  }

  console.log('');
  console.log(`  ${c.cyan('📦')} 引擎: ${engineName(engine)}`);
  console.log(`  ${c.cyan('📝')} 模式: ${promptMode === 'prompt' ? '覆盖模式 (prompt)' : '追加模式 (prompt_append)'}`);
  console.log('');

  // 显示所选方案的模型 ID
  console.log(`${COLORS.cyan}📋 所选方案模型分配：${COLORS.reset}`);
  if (engine === 'deepseek') {
    console.log(`  推理: opencode-go/deepseek-v4-pro`);
    console.log(`  轻量: opencode-go/deepseek-v4-flash`);
    console.log(`  执行: minimax-cn-coding-plan/MiniMax-M2.7`);
  } else if (engine === 'mimo') {
    console.log(`  推理: xiaomi-token-plan-cn/mimo-v2.5-pro`);
    console.log(`  轻量: xiaomi-token-plan-cn/mimo-v2.5`);
    console.log(`  执行: minimax-cn-coding-plan/MiniMax-M2.7`);
  } else if (engine === 'minimax') {
    console.log(`  全引擎: minimax-cn-coding-plan/MiniMax-M2.7`);
  }
  // template/template2 are handled separately with their own prompts
  console.log(`${COLORS.yellow}  ⚠️  请确认已在 OpenCode 中 /connect 连接以上模型\n${COLORS.reset}`);

  // ---- 模板模式：输入模型 ID ----
  let templateContent = null;
  if (engine === 'template') {
    const sourceFile = getSourceFile(engine, promptMode);
    const models = await promptTemplateModels();
    if (!models) {
      console.log(`${c.dim('已取消')}`);
      process.exit(0);
    }
    console.log('');
    console.log(`  Pro:     ${models.pro}`);
    console.log(`  Fast:    ${models.fast}`);
    console.log(`  Exec:    ${models.exec}`);
    console.log(`  备选:    ${models.fallback}`);
    console.log('');
    try {
      templateContent = fillTemplate(sourceFile, models);
      console.log(`  ${c.success('✅')} 模板填充成功，JSON 验证通过`);
    } catch (err) {
      console.log(`  ${c.error('❌')} 模板填充失败: ${err.message}`);
      process.exit(1);
    }
  }

  // ---- 模板2模式：只需输入 Pro 和 Fast 模型 ID（Exec/Fallback 已硬编码） ----
  if (engine === 'template2') {
    const sourceFile = getSourceFile(engine, promptMode);
    const models = await promptTemplate2Models();
    if (!models) {
      console.log(`${c.dim('已取消')}`);
      process.exit(0);
    }
    console.log('');
    console.log(`  Pro:     ${models.pro}`);
    console.log(`  Fast:    ${models.fast}`);
    console.log('');
    try {
      const sourcePath = path.join(SOURCE_DIR, sourceFile);
      let content = fs.readFileSync(sourcePath, 'utf-8');
      content = content.replaceAll('__PRO_MODEL__', models.pro);
      content = content.replaceAll('__FAST_MODEL__', models.fast);
      JSON.parse(content); // 验证 JSON 合法性
      templateContent = content;
      console.log(`  ${c.success('✅')} 模板填充成功，JSON 验证通过`);
    } catch (err) {
      console.log(`  ${c.error('❌')} 模板填充失败: ${err.message}`);
      process.exit(1);
    }
  }

  // ---- 备份已有配置 ----
  const existing = fs.existsSync(getTargetFile(target));
  if (existing) {
    const backupFile = backupCurrent(target);
    if (backupFile) {
      console.log(`\n${c.success('💾')} 已备份: ${path.basename(backupFile)}`);
    } else {
      console.log(`\n${c.dim('ℹ')} 当前配置与最新备份相同，跳过备份`);
    }
  }

  // ---- 写入配置 ----
  const sourceFile = getSourceFile(engine, promptMode);

  if ((engine === 'template' || engine === 'template2') && templateContent) {
    fs.mkdirSync(getConfigDir(target), { recursive: true });
    fs.writeFileSync(getTargetFile(target), templateContent, 'utf-8');
  } else {
    const sourcePath = path.join(SOURCE_DIR, sourceFile);
    if (!fs.existsSync(sourcePath)) {
      console.log(`\n${c.error('❌')} 源文件不存在: ${sourcePath}`);
      process.exit(1);
    }
    fs.mkdirSync(getConfigDir(target), { recursive: true });
    fs.copyFileSync(sourcePath, getTargetFile(target));
  }
  console.log(`\n${c.success('✅')} oh-my-openagent.json 已安装`);

  // ---- 复制辅助配置 ----
  copyAuxiliaryConfigs(target);

  // ---- 检查 EasyVision（仅全局） ----
  if (!isProject) {
    await checkAndInstallEasyVision();
    await checkAndInstallAgentBrowser();
  }

  // ---- 摘要 ----
  printSummary(target, engine, promptMode);

  // 全局安装完成后，提示设置全局命令
  if (target === 'global') {
    if (!isGlobalCommandSet()) {
      const setupCmd = await askYesNo('💡 设置全局 eoc 命令？（在任意目录使用 eoc）', true);
      if (setupCmd) {
        const result = setupGlobalCommand();
        if (result === 'setup_done') {
          console.log('✅ 全局命令已设置！运行 source ~/.bashrc 或重启终端生效');
        } else {
          console.log('✅ 全局命令已就绪');
        }
      }
    }
  }
}

/**
 * 交互式选择引擎
 * @returns {Promise<string|null>}
 */
function selectEngineInteractive() {
  return new Promise((resolve) => {
    const rl = createReadline();
    console.log(`${COLORS.cyan}请选择模型引擎方案：${COLORS.reset}\n`);
    console.log(`  [M] MiMo + MiniMax      推理: xiaomi-token-plan-cn/mimo-v2.5-pro | 执行: minimax-cn-coding-plan/MiniMax-M2.7 (推荐)`);
    console.log(`  [D] DeepSeek + MiniMax  推理: opencode-go/deepseek-v4-pro | 执行: minimax-cn-coding-plan/MiniMax-M2.7`);
    console.log(`  [N] 纯 MiniMax M2.7     全引擎: minimax-cn-coding-plan/MiniMax-M2.7（单模型方案）`);
    console.log(`  [T] 自定义模板          需手动输入 Pro/Fast/Exec/Fallback 四个模型 ID`);
    console.log(`  [2] 自定义模板 双引擎   需手动输入 Pro/Fast 模型 ID（Exec/Fallback 硬编码）\n`);
    console.log(`\n${COLORS.yellow}⚠️  请确认已在 OpenCode 中通过 /connect 连接好对应模型，否则安装后无法正常使用${COLORS.reset}\n`);
    rl.question(`请输入选择 [M/D/N/T/2]（默认 M）: `, (answer) => {
      rl.close();
      const a = answer.trim().toLowerCase();
      if (a === 'd') resolve('deepseek');
      else if (a === 'n') resolve('minimax');
      else if (a === 't') resolve('template');
      else if (a === '2') resolve('template2');
      else if (a === '' || a === 'm') resolve('mimo');
      else {
        console.log(`${c.error('无效选择')}`);
        resolve(null);
      }
    });
  });
}

/**
 * 交互式选择 Prompt 注入模式
 * @returns {Promise<string|null>}
 */
function selectPromptModeInteractive() {
  return new Promise((resolve) => {
    const rl = createReadline();
    console.log(`\n${COLORS.cyan}请选择 Prompt 注入模式：${COLORS.reset}\n`);
    console.log(`  [A] 追加模式 (prompt_append) — 官方提示保留，你的规则补充（默认，推荐）`);
    console.log(`  [P] 覆盖模式 (prompt)        — 完全替换官方系统提示（进阶）\n`);
    rl.question(`请输入选择 [A/P]（默认 A）: `, (answer) => {
      rl.close();
      const a = answer.trim().toLowerCase();
      if (a === 'p') resolve('prompt');
      else if (a === '' || a === 'a') resolve('append');
      else {
        console.log(`${c.error('无效选择')}`);
        resolve(null);
      }
    });
  });
}

/**
 * 模板模式：提示输入四个模型 ID
 * @returns {Promise<object|null>}
 */
function promptTemplateModels() {
  return new Promise((resolve) => {
    const rl = createReadline();
    console.log(`\n${COLORS.cyan}自定义模板 — 输入模型 ID${COLORS.reset}\n`);
    console.log(`  三层模型架构：`);
    console.log(`  Pro  → Sisyphus/Oracle/Prometheus 等推理型 Agent`);
    console.log(`  Fast → Explore/Librarian 等轻量 Agent`);
    console.log(`  Exec → Atlas/Momus 等执行型 Agent\n`);

    const models = {};
    const questions = [
      { key: 'pro', prompt: 'Pro 模型 ID（推理型）: ' },
      { key: 'fast', prompt: 'Fast 模型 ID（轻量型）: ' },
      { key: 'exec', prompt: 'Exec 模型 ID（执行型）: ' },
      { key: 'fallback', prompt: '备选模型 ID（fallback）: ' },
    ];

    let idx = 0;
    function askNext() {
      if (idx >= questions.length) {
        rl.close();
        if (!models.pro || !models.fast || !models.exec || !models.fallback) {
          console.log(`${c.error('❌ 所有模型 ID 不能为空')}`);
          resolve(null);
          return;
        }
        resolve(models);
        return;
      }
      const q = questions[idx];
      rl.question(`  ${q.prompt}`, (answer) => {
        models[q.key] = answer.trim();
        idx++;
        askNext();
      });
    }
    askNext();
  });
}

/**
 * 模板2模式：只需输入 Pro 和 Fast 模型 ID（Exec/Fallback 已硬编码为 MiniMax M2.7）
 * @returns {Promise<object|null>}
 */
function promptTemplate2Models() {
  return new Promise((resolve) => {
    const rl = createReadline();
    console.log(`\n${COLORS.cyan}自定义模板 双引擎 — 输入模型 ID${COLORS.reset}\n`);
    console.log(`  双引擎架构（Exec/Fallback 已硬编码为 MiniMax M2.7）：`);
    console.log(`  Pro  → Sisyphus/Oracle/Prometheus/Hephaestus/Metis 等推理型 Agent`);
    console.log(`  Fast → Explore/Librarian/Sisyphus-Junior 等轻量 Agent\n`);

    const models = {};
    const questions = [
      { key: 'pro', prompt: '__PRO_MODEL__ ID（推理型）: ' },
      { key: 'fast', prompt: '__FAST_MODEL__ ID（轻量型）: ' },
    ];

    let idx = 0;
    function askNext() {
      if (idx >= questions.length) {
        rl.close();
        if (!models.pro || !models.fast) {
          console.log(`${c.error('❌ 所有模型 ID 不能为空')}`);
          resolve(null);
          return;
        }
        resolve(models);
        return;
      }
      const q = questions[idx];
      rl.question(`  ${q.prompt}`, (answer) => {
        models[q.key] = answer.trim();
        idx++;
        askNext();
      });
    }
    askNext();
  });
}

/**
 * 获取引擎中文名称
 * @param {string} engine
 * @returns {string}
 */
function engineName(engine) {
  const map = { mimo: 'MiMo + MiniMax', deepseek: 'DeepSeek + MiniMax', minimax: '纯 MiniMax M2.7', template: '自定义模板', template2: '自定义模板 双引擎' };
  return map[engine] || engine;
}

/**
 * 复制辅助配置文件（opencode.json 和 easy-vision.jsonc）
 * @param {string} target - 配置目标级别
 */
function copyAuxiliaryConfigs(target) {
  const configDir = getConfigDir(target);

  // opencode.json
  const opencodeSrc = path.join(SOURCE_DIR, 'opencode.json');
  const opencodeDst = path.join(configDir, 'opencode.json');
  if (fs.existsSync(opencodeSrc)) {
    if (!fs.existsSync(opencodeDst)) {
      fs.mkdirSync(configDir, { recursive: true });
      fs.copyFileSync(opencodeSrc, opencodeDst);
      console.log(`${c.success('✅')} opencode.json 已安装`);
    } else {
      console.log(`${c.dim('ℹ')} opencode.json 已存在，跳过`);
    }
  }

  // easy-vision.jsonc
  const evSrc = path.join(SOURCE_DIR, 'opencode-minimax-easy-vision.jsonc');
  const evDst = path.join(configDir, 'opencode-minimax-easy-vision.jsonc');
  if (fs.existsSync(evSrc) && !fs.existsSync(evDst)) {
    fs.mkdirSync(configDir, { recursive: true });
    fs.copyFileSync(evSrc, evDst);
    console.log(`${c.success('✅')} opencode-minimax-easy-vision.jsonc 已安装`);
  }
}

/**
 * 检查并提示安装 EasyVision 插件
 */
async function checkAndInstallEasyVision() {
  if (!process.stdin.isTTY) return;

  let installed = false;
  try {
    const r = execSync('npm list -g opencode-minimax-easy-vision', {
      encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'],
    });
    if (r.includes('opencode-minimax-easy-vision')) installed = true;
  } catch {}

  if (!installed) {
    const answer = await new Promise((resolve) => {
      const rl = createReadline();
      rl.question(`\n${c.info('📦')} 安装 EasyVision 图片拦截插件？[Y/n]: `, (a) => {
        rl.close();
        resolve(a.trim().toLowerCase());
      });
    });

    if (answer === '' || answer === 'y') {
      console.log(`${c.info('⏳')} 正在安装 opencode-minimax-easy-vision…`);
      try {
        execSync('npm install -g opencode-minimax-easy-vision', { stdio: 'inherit' });
        console.log(`${c.success('✅')} EasyVision 插件安装完成`);
      } catch (err) {
        console.log(`${c.warning('⚠')} EasyVision 安装失败，请手动安装: npm install -g opencode-minimax-easy-vision`);
      }
    } else {
      console.log(`${c.dim('ℹ')} 跳过 EasyVision 安装（可稍后手动安装）`);
    }
  } else {
    console.log(`${c.success('✅')} EasyVision 插件已安装`);
  }
}

/**
 * 检查并提示安装 agent-browser（浏览器自动化 MCP）
 * 仅全局安装时执行
 */
async function checkAndInstallAgentBrowser() {
  if (!process.stdin.isTTY) return;

  // 检查 agent-browser 是否已全局安装
  let installed = false;
  try {
    const r = execSync('npm list -g agent-browser', {
      encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'],
    });
    if (r.includes('agent-browser')) installed = true;
  } catch {}

  if (!installed) {
    const answer = await new Promise((resolve) => {
      const rl = createReadline();
      rl.question(`\n${c.info('🌐')} 安装 agent-browser 浏览器自动化 MCP？[Y/n]: `, (a) => {
        rl.close();
        resolve(a.trim().toLowerCase());
      });
    });

    if (answer === '' || answer === 'y') {
      console.log(`${c.info('⏳')} 正在安装 agent-browser…`);
      try {
        execSync('npm install -g agent-browser', { stdio: 'inherit' });
        console.log(`${c.success('✅')} agent-browser 安装完成`);
        installed = true;
      } catch (err) {
        console.log(`${c.warning('⚠')} agent-browser 安装失败，请手动安装: npm install -g agent-browser`);
        return;
      }
    } else {
      console.log(`${c.dim('ℹ')} 跳过 agent-browser 安装（可稍后手动安装）`);
      return;
    }
  } else {
    console.log(`${c.success('✅')} agent-browser 已安装`);
  }

  // 检测 Chrome 路径（WSL2 环境可能需要手动设置）
  if (installed) {
    const chromePaths = [
      path.join(os.homedir(), '.agent-browser', 'chrome-install', 'opt', 'google', 'chrome', 'google-chrome'),
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];
    let chromeFound = false;
    for (const p of chromePaths) {
      if (fs.existsSync(p)) {
        chromeFound = true;
        // 如果 Chrome 在 agent-browser 默认路径，设置环境变量
        if (p.includes('.agent-browser')) {
          const bashrcPath = path.join(os.homedir(), '.bashrc');
          const envLine = `export AGENT_BROWSER_EXECUTABLE_PATH="${p}"`;
          try {
            const content = fs.readFileSync(bashrcPath, 'utf-8');
            if (!content.includes('AGENT_BROWSER_EXECUTABLE_PATH')) {
              fs.appendFileSync(bashrcPath, `\n# agent-browser Chrome 路径\n${envLine}\n`);
              console.log(`${c.success('✅')} Chrome 路径已设置: ${p}`);
              console.log(`${c.dim('   💡 运行 source ~/.bashrc 生效')}`);
            }
          } catch {}
        }
        break;
      }
    }
    if (!chromeFound) {
      console.log(`${c.warning('⚠')} 未检测到 Chrome，agent-browser 将自动下载`);
      console.log(`${c.dim('   💡 WSL2 用户可能需要手动安装 Chrome 并设置 AGENT_BROWSER_EXECUTABLE_PATH')}`);
    }
  }
}

/**
 * 打印安装摘要
 * @param {string} target - 配置目标级别
 * @param {string} engine
 * @param {string} promptMode
 */
function printSummary(target, engine, promptMode) {
  const isProject = target === 'project';
  const configDir = getConfigDir(target);
  const showPath = isProject ? '.opencode/' : '~/.config/opencode/';

  console.log(`\n${COLORS.cyan}╔══════════════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}       ${c.success('✅ Efficient-OpenCode 安装完成！')}`);
  console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  层级: ${isProject ? '📁 项目级 (.opencode/)' : '👤 用户级 (~/.config/opencode/)'}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  方案: ${c.bold(engineName(engine))}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  模式: ${promptMode === 'prompt' ? '覆盖模式' : '追加模式'}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  配置文件:`);
  console.log(`${COLORS.cyan}║${COLORS.reset}    ${showPath}opencode.json`);
  console.log(`${COLORS.cyan}║${COLORS.reset}    ${showPath}oh-my-openagent.json`);
  console.log(`${COLORS.cyan}║${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  ⚡ 请重启 OpenCode 使配置生效`);
  console.log(`${COLORS.cyan}╚══════════════════════════════════════════════════════╝${COLORS.reset}`);
  console.log('');
}

// ============================================================
// 命令: switch
// ============================================================

/**
 * 切换配置交互流程
 * @param {string} target - 配置目标级别
 */
async function cmdSwitch(target) {
  const current = detectCurrent(target);
  const currentFpId = current.fingerprint?.id;

  // 构建菜单项
  const items = FINGERPRINTS.map((fp) => ({
    label: fp.label,
    value: fp,
    isCurrent: current.tier === 'exact' && currentFpId === fp.id,
  }));

  // 找到当前项的索引
  let currentIndex = items.findIndex((it) => it.isCurrent);
  if (currentIndex < 0) currentIndex = 0;

  const currentDesc = current.fingerprint ? current.fingerprint.description : null;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const isProject = target === 'project';
    const menuTitle = isProject ? '📁 项目级配置切换' : '🔄 OpenCode 配置切换器';

    const result = await createMenu(
      items,
      currentIndex,
      menuTitle,
      current.label,
      currentDesc,
    );

    if (result.action === 'quit') {
      console.log(`\n${COLORS.dim}👋 已退出${COLORS.reset}`);
      break;
    }

    if (result.action === 'rollback') {
      console.log('');
      await cmdRollbackMenu(target);
      continue;
    }

    if (result.action === 'detail') {
      if (result.index != null && items[result.index]) {
        showDetail(items[result.index].value);
        await pressAnyKey();
      }
      continue;
    }

    if (result.action === 'select') {
      if (result.index == null) continue;
      const selected = items[result.index];

      if (selected.isCurrent) {
        console.log(`\n${c.warning('⚠')} 已经是当前配置，无需切换\n`);
        await pressAnyKey();
        currentIndex = result.index;
        continue;
      }

      // 备份 → 切换
      const backupFile = backupCurrent(target);
      if (backupFile) {
        console.log(`\n${c.success('💾')} 已备份: ${path.basename(backupFile)}`);
      }

      const fp = selected.value;
      // 模板不能用 switchTo 直接复制（占位符），需要现场填模型 ID
      if (fp.cliFlag === 'template' || fp.cliFlag === 'template2') {
        console.log(`\n${COLORS.cyan}🔧 模板配置 — 输入模型 ID${COLORS.reset}`);
        console.log(`${COLORS.yellow}⚠️  请确认已在 OpenCode 中通过 /connect 连接好对应模型${COLORS.reset}\n`);

        let models;
        if (fp.cliFlag === 'template2') {
          models = await promptTemplate2Models();
        } else {
          models = await promptTemplateModels();
        }

        if (!models) {
          console.log(`${c.warning('⚠')} 已取消\n`);
          continue; // 回到选择菜单
        }

        // 填充模板并写入目标（模板文件在 configs/ 下是只读的，不修改源文件）
        const sourcePath = path.join(SOURCE_DIR, fp.sourceFile);
        let content = fs.readFileSync(sourcePath, 'utf-8');
        content = content.replaceAll('__PRO_MODEL__', models.pro);
        content = content.replaceAll('__FAST_MODEL__', models.fast);
        // template2 不需要 exec/fallback，template 需要。用空串安全回退
        content = content.replaceAll('__EXEC_MODEL__', models.exec || '');
        content = content.replaceAll('__FALLBACK_MODEL__', models.fallback || '');
        // 验证 JSON
        try {
          JSON.parse(content);
        } catch (e) {
          console.log(`\n${c.error('❌')} 模板填充后 JSON 验证失败: ${e.message}\n`);
          continue;
        }

        const destPath = path.join(getConfigDir(target), 'oh-my-openagent.json');
        fs.writeFileSync(destPath, content, 'utf-8');

        console.log(`\n${c.success('✅')} 已切换到: ${fp.label}`);
        console.log(`${c.dim('   推理: ' + (models.pro || '(已填写)'))}`);
        console.log(`${c.dim('   轻量: ' + (models.fast || '(已填写)'))}`);
        if (models.exec) console.log(`${c.dim('   执行: ' + models.exec)}`);
        console.log(`${c.warning('⚠')} 请重启 OpenCode 以使配置生效\n`);
        break;
      }

      try {
        switchTo(fp.sourceFile, target);
        console.log(`\n${c.success('✅')} 已切换到: ${fp.label}`);
        console.log(`${c.warning('⚠')} 请确认已在 OpenCode 中 /connect 连接以下模型：`);
        console.log(`${c.dim('   推理: ' + fp.modelKeys.pro)}`);
        console.log(`${c.dim('   轻量: ' + fp.modelKeys.fast)}`);
        console.log(`${c.dim('   执行: ' + fp.modelKeys.exec)}`);
        console.log(`${c.warning('⚠')} 请重启 OpenCode 以使配置生效\n`);
      } catch (err) {
        console.log(`\n${c.error('❌')} 切换失败: ${err.message}\n`);
      }
      break;
    }
  }
}

// ============================================================
// 命令: status
// ============================================================

/**
 * 显示当前配置状态
 * @param {string} target - 配置目标级别
 */
function cmdStatus(target) {
  const showProject = hasProjectConfig();
  const showGlobal = hasGlobalConfig();

  console.log('');
  console.log(`${COLORS.cyan}╔══════════════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}          ${COLORS.bold}📊 OpenCode 配置状态${COLORS.reset}`);

  if (showGlobal) {
    const globalStatus = detectCurrent('global');
    console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}  ${COLORS.bold}👤 用户级 (~/.config/opencode)${COLORS.reset}`);

    if (globalStatus.tier !== 'unknown' || globalStatus.label !== '未安装') {
      const fp = globalStatus.fingerprint;
      console.log(`${COLORS.cyan}║${COLORS.reset}     方案: ${globalStatus.label}`);
      console.log(`${COLORS.cyan}║${COLORS.reset}     等级: ${globalStatus.tier === 'exact' ? c.success('完全匹配') : globalStatus.tier === 'partial' ? c.warning('部分匹配') : c.warning('未识别')}`);
      if (fp) {
        console.log(`${COLORS.cyan}║${COLORS.reset}     推理: ${fp.modelKeys.pro}`);
        console.log(`${COLORS.cyan}║${COLORS.reset}     轻量: ${fp.modelKeys.fast}`);
        console.log(`${COLORS.cyan}║${COLORS.reset}     执行: ${fp.modelKeys.exec}`);
      }
    } else {
      console.log(`${COLORS.cyan}║${COLORS.reset}     状态: ${c.warning('未安装')}`);
    }
  } else {
    console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}  ${COLORS.bold}👤 用户级 (~/.config/opencode)${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}     状态: ${c.warning('未安装')}`);
  }

  // 项目级面板
  if (showProject) {
    const projectStatus = detectCurrent('project');
    console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}  ${COLORS.bold}📁 项目级 (./.opencode)${COLORS.reset}`);

    if (projectStatus.tier !== 'unknown' || projectStatus.label !== '未安装') {
      const fp = projectStatus.fingerprint;
      console.log(`${COLORS.cyan}║${COLORS.reset}     方案: ${projectStatus.label}`);
      console.log(`${COLORS.cyan}║${COLORS.reset}     等级: ${projectStatus.tier === 'exact' ? c.success('完全匹配') : projectStatus.tier === 'partial' ? c.warning('部分匹配') : c.warning('未识别')}`);
      if (fp) {
        console.log(`${COLORS.cyan}║${COLORS.reset}     推理: ${fp.modelKeys.pro}`);
        console.log(`${COLORS.cyan}║${COLORS.reset}     轻量: ${fp.modelKeys.fast}`);
        console.log(`${COLORS.cyan}║${COLORS.reset}     执行: ${fp.modelKeys.exec}`);
      }
      console.log(`${COLORS.cyan}║${COLORS.reset}     ${c.warning('⚠️ 项目级配置会覆盖用户级')}`);
      console.log(`${COLORS.cyan}║${COLORS.reset}     ${c.dim('💡 ./eoc -g switch 管理全局级')}`);
    } else {
      console.log(`${COLORS.cyan}║${COLORS.reset}     状态: ${c.warning('未安装')}`);
    }
  } else {
    console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}  ${COLORS.bold}📁 项目级 (./.opencode)${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}     状态: ${c.dim('未设置')}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}     ${c.dim('💡 ./eoc 可快速设置项目级配置')}`);
  }

  // 备份数量
  if (showGlobal || showProject) {
    const targetBackup = showProject ? 'project' : 'global';
    const backups = listBackupFiles(targetBackup);
    if (backups.length > 0) {
      console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
      console.log(`${COLORS.cyan}║${COLORS.reset}  备份数量: ${backups.length}（运行 ./eoc rollback 查看）`);
    }
  }

  // 全局命令状态
  console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
  if (isGlobalCommandSet()) {
    console.log(`${COLORS.cyan}║${COLORS.reset}                                               ${COLORS.cyan}║${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}  🔗 全局命令: 已设置 (eoc)                      ${COLORS.cyan}║${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}     📝 如删除仓库，记得清理 ~/.bashrc 中的       ${COLORS.cyan}║${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}         # eoc 注释行                             ${COLORS.cyan}║${COLORS.reset}`);
  } else {
    console.log(`${COLORS.cyan}║${COLORS.reset}                                               ${COLORS.cyan}║${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}  🔗 全局命令: 未设置                             ${COLORS.cyan}║${COLORS.reset}`);
    console.log(`${COLORS.cyan}║${COLORS.reset}     💡 ./eoc install 可设置全局命令              ${COLORS.cyan}║${COLORS.reset}`);
  }

  console.log(`${COLORS.cyan}╚══════════════════════════════════════════════════════╝${COLORS.reset}`);
  console.log('');
}

// ============================================================
// 命令: rollback
// ============================================================

/**
 * 回滚到备份（作为独立命令调用）
 * @param {string} target - 配置目标级别
 */
async function cmdRollback(target) {
  await cmdRollbackMenu(target);
}

/**
 * 回滚交互菜单
 * @param {string} target - 配置目标级别
 */
async function cmdRollbackMenu(target) {
  const configDir = getConfigDir(target);
  const backups = listBackupFiles(target);

  if (backups.length === 0) {
    console.log(`\n${c.warning('⚠')} 暂无备份文件\n`);
    return;
  }

  console.log(`\n${COLORS.cyan}╔══════════════════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}          ${COLORS.bold}📦 回滚到历史备份${COLORS.reset}`);
  console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);

  // 显示最近 10 条
  const recent = backups.slice(0, 10);
  for (let i = 0; i < recent.length; i++) {
    const b = recent[i];
    // 格式化显示时间
    const displayTime = b.timestamp.replace(
      /^(\d{4})-(\d{2})-(\d{2})-(\d{2})(\d{2})(\d{2})$/,
      '$1-$2-$3 $4:$5:$6',
    );
    const marker = i === 0 ? ` ${c.cyan('(最新)')}` : '';
    console.log(`${COLORS.cyan}║${COLORS.reset}  ${i + 1}. ${displayTime}${marker}`);
  }

  console.log(`${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}`);
  console.log(`${COLORS.cyan}║${COLORS.reset}  输入序号 (1-${recent.length}) 回滚，或 [Q] 取消`);
  console.log(`${COLORS.cyan}╚══════════════════════════════════════════════════════╝${COLORS.reset}`);
  console.log('');

  if (!process.stdin.isTTY) {
    console.log(`${c.warning('⚠')} 非交互环境，无法选择备份`);
    return;
  }

  const answer = await new Promise((resolve) => {
    const rl = createReadline();
    rl.question('选择: ', (a) => {
      rl.close();
      resolve(a.trim());
    });
  });

  if (answer.toLowerCase() === 'q') {
    console.log(`${c.dim('已取消')}`);
    return;
  }

  const index = parseInt(answer, 10);
  if (isNaN(index) || index < 1 || index > recent.length) {
    console.log(`${c.error('❌')} 无效选择\n`);
    return;
  }

  // 二次确认
  const confirm = await new Promise((resolve) => {
    const rl = createReadline();
    rl.question(`${c.warning('⚠')} 确认回滚到 ${recent[index - 1].timestamp}？[y/N]: `, (a) => {
      rl.close();
      resolve(a.trim().toLowerCase());
    });
  });

  if (confirm !== 'y') {
    console.log(`${c.dim('已取消')}`);
    return;
  }

  // 先备份当前
  backupCurrent(target);

  // 恢复
  const backupPath = recent[index - 1].path;
  try {
    fs.mkdirSync(configDir, { recursive: true });
    fs.copyFileSync(backupPath, getTargetFile(target));
    console.log(`\n${c.success('✅')} 已回滚到备份: ${path.basename(backupPath)}`);
    console.log(`${c.warning('⚠')} 请重启 OpenCode 以使配置生效\n`);
  } catch (err) {
    console.log(`\n${c.error('❌')} 回滚失败: ${err.message}\n`);
  }
}

// ============================================================
// 主函数（智能入口逻辑）
// ============================================================

/**
 * 程序入口
 */
async function main() {
  const args = parseArgs();
  const target = args.global ? 'global' : 'auto';

  // 处理显式命令
  if (args.command === 'status') return cmdStatus(target);
  if (args.command === 'rollback') return cmdRollback(target);
  if (args.command === 'switch') return cmdSwitch(target);
  if (args.command === 'install') return cmdInstall(target, args.engine, args.promptMode);
  if (args.command === 'help' || args.command === '--help' || args.command === '-h') return showHelp();
  if (args.command === '--version' || args.command === '-v' || args.command === 'version') {
    console.log(`eoc v${VERSION}`);
    return;
  }

  // 智能入口：无命令 + 无 -g
  if (args.global) {
    // -g 标志强制全局级 → 进入全局切换菜单
    await cmdSwitch('global');
    return;
  }

  const globalInstalled = hasGlobalConfig();
  const projectInstalled = hasProjectConfig();

  if (!globalInstalled) {
    // 情况一：全局未安装 → 强制安装
    console.log('🔧 首次使用，需要先安装全局级配置...\n');
    await cmdInstall('global', args.engine, args.promptMode);

    // 问要不要项目级
    if (process.stdin.isTTY) {
      const wantProject = await askYesNo('💡 为当前目录设置项目级配置？', false);
      if (wantProject) {
        deployProjectConfig();
      }
    }
    return;
  }

  if (projectInstalled) {
    // 情况三：全局✅ + 项目✅ → 默认管项目级
    await cmdSwitch('project');
    return;
  }

  // 情况二：全局✅ + 项目❌ → 每次必问
  if (process.stdin.isTTY) {
    const wantProject = await askYesNo('💡 当前目录暂无项目级配置，要设置吗？', false);
    if (wantProject) {
      deployProjectConfig();
      return;
    }
  }

  // 不要项目级 → 进全局级切换菜单
  await cmdSwitch('global');

  // 全局命令提醒（防健忘）
  if (isGlobalCommandSet()) {
    console.log(COLORS.dim + '\n💡 全局命令已设置（eoc）。如需删除仓库，记得清理 ~/.bashrc 中 # eoc 注释行' + COLORS.reset);
  }
}

/**
 * 打印帮助信息
 */
function showHelp() {
  console.log(`
${COLORS.cyan}╔══════════════════════════════════════════════════════╗${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}     ${COLORS.bold}Efficient-OpenCode 配置切换器 v${VERSION}${COLORS.reset}
${COLORS.cyan}╠══════════════════════════════════════════════════════╣${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}  用法: ${COLORS.bold}./eoc${COLORS.reset} [命令] [选项]
${COLORS.cyan}║${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}  命令:
${COLORS.cyan}║${COLORS.reset}    install     安装配置（交互式选择引擎+模式）
${COLORS.cyan}║${COLORS.reset}    switch      交互式切换配置
${COLORS.cyan}║${COLORS.reset}    status      查看当前配置状态
${COLORS.cyan}║${COLORS.reset}    rollback    回滚到历史备份
${COLORS.cyan}║${COLORS.reset}    help        显示此帮助
${COLORS.cyan}║${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}  选项（任意命令通用）:
${COLORS.cyan}║${COLORS.reset}    -g, --global     强制操作全局级配置
${COLORS.cyan}║${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}  选项（配合 install 使用）:
${COLORS.cyan}║${COLORS.reset}    -m, --mimo       选择 MiMo + MiniMax
${COLORS.cyan}║${COLORS.reset}    -d, --deepseek   选择 DeepSeek + MiniMax
${COLORS.cyan}║${COLORS.reset}    -x, --minimax    选择纯 MiniMax M2.7
${COLORS.cyan}║${COLORS.reset}    -t, --template   选择自定义模板（4 层模型自定义）
${COLORS.cyan}║${COLORS.reset}    -2, --template2  选择自定义模板 双引擎（Pro/Fast 自定义，Exec/Fallback 硬编码）
${COLORS.cyan}║${COLORS.reset}    -p, --prompt     使用覆盖模式（默认追加模式）
${COLORS.cyan}║${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}  示例:
${COLORS.cyan}║${COLORS.reset}    ./eoc                     智能入口
${COLORS.cyan}║${COLORS.reset}    ./eoc -g status           查看全局级配置
${COLORS.cyan}║${COLORS.reset}    ./eoc install             交互安装（全局级）
${COLORS.cyan}║${COLORS.reset}    ./eoc install -d -p       一键安装 DeepSeek 覆盖模式
${COLORS.cyan}║${COLORS.reset}    ./eoc switch              打开切换菜单
${COLORS.cyan}║${COLORS.reset}    ./eoc status              查看当前配置
${COLORS.cyan}║${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}  💡 提示:
${COLORS.cyan}║${COLORS.reset}     ./eoc install 安装后会提示设置全局命令
${COLORS.cyan}║${COLORS.reset}     设置后可在任意目录直接使用 eoc 命令
${COLORS.cyan}║${COLORS.reset}
${COLORS.cyan}║${COLORS.reset}  💡 项目级配置 (./.opencode/) 会覆盖用户级 (~/.config/opencode/)
${COLORS.cyan}║${COLORS.reset}     ./eoc 快速设置项目级  |  ./eoc -g switch 管理全局级
${COLORS.cyan}╚══════════════════════════════════════════════════════╝${COLORS.reset}
`);
}

// ---- 运行 ----
main().catch((err) => {
  console.error(`${c.error('❌ 未捕获的错误:')} ${err.message}`);
  // 确保恢复终端状态
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
    process.stdout.write('\x1b[?25h');
  }
  process.exit(1);
});
