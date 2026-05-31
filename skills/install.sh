#!/usr/bin/env bash
# ============================================================
# Efficient-OpenCode Skills 一键安装脚本
# 安装 ohmyopencode 必装合集 + browser-automation 共 14 个 Skill
# 用法: ./skills/install.sh [--force]   (--force 强制覆盖已安装)
# ============================================================
set -e

SKILLS_DIR="${HOME}/.config/opencode/skills"
AGENTS_DIR="${HOME}/.agents/skills"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FORCE="${1}"

# 检查单个 skill 是否已安装
is_installed() {
    local dir="$1" name="$2"
    [ -f "${dir}/${name}/SKILL.md" ] || [ -f "${dir}/${name}/skill.md" ]
}

echo "📦 Efficient-OpenCode Skills 一键安装"
echo "======================================"
echo ""

# ---- 1. MiniMax Skills (10 个) ----
echo "🔧 [1/3] MiniMax Skills (10 个)..."
if [ -d "${HOME}/.minimax-skills" ]; then
    echo "  ⏳ 更新已有仓库..."
    git -C "${HOME}/.minimax-skills" pull --ff-only 2>/dev/null || echo "  ⚠️  更新失败，继续"
else
    git clone https://github.com/MiniMax-AI/skills.git "${HOME}/.minimax-skills"
fi

mkdir -p "${SKILLS_DIR}"
mm_installed=0; mm_skipped=0
for skill in "${HOME}/.minimax-skills/skills/"*/; do
    skill_name=$(basename "$skill")
    if is_installed "${SKILLS_DIR}" "${skill_name}" && [ "$FORCE" != "--force" ]; then
        mm_skipped=$((mm_skipped + 1))
        continue
    fi
    ln -sfn "$skill" "${SKILLS_DIR}/${skill_name}"
    mm_installed=$((mm_installed + 1))
done
echo "  ✅ ${mm_installed} 安装, ${mm_skipped} 跳过 (--force 覆盖)"
echo ""

# 动态查找 Chromium/Chrome 可执行文件（供 agent-browser 使用）
find_chrome() {
    for candidate in \
        "${HOME}/.cache/ms-playwright/"*/chrome-linux/chrome \
        "${HOME}/.agent-browser/chrome-install/opt/google/chrome/google-chrome" \
        "${HOME}/.agent-browser/browsers/"*/opt/google/chrome/google-chrome \
        /usr/bin/google-chrome-stable \
        /usr/bin/google-chrome \
        /usr/bin/chromium-browser \
        /usr/bin/chromium; do
        # 展开 glob 后的 path
        for resolved in $candidate; do
            if [ -f "$resolved" ]; then
                echo "$resolved"
                return 0
            fi
        done
    done
    return 1
}

# 写入 env var 到 .bashrc（使用 $HOME 变量保持可移植）
write_env_var() {
    local chrome_path="$1"
    local portable_path="\$HOME/${chrome_path#${HOME}/}"
    export AGENT_BROWSER_EXECUTABLE_PATH="$chrome_path"
    if ! grep -q "AGENT_BROWSER_EXECUTABLE_PATH" "${HOME}/.bashrc" 2>/dev/null; then
        echo "" >> "${HOME}/.bashrc"
        echo "# agent-browser 共享 Chromium（由 Playwright 管理）" >> "${HOME}/.bashrc"
        echo "export AGENT_BROWSER_EXECUTABLE_PATH=\"${portable_path}\"" >> "${HOME}/.bashrc"
        echo "  💡 已将 Chromium 路径写入 ~/.bashrc（source ~/.bashrc 生效）"
    fi
}

# ---- 2. browser-automation Skill + CLI 工具 ----
echo "🔧 [2/3] browser-automation (agent-browser + Playwright CLI)..."

# 2a. 安装 browser-automation Skill
mkdir -p "${AGENTS_DIR}/browser-automation"
if is_installed "${AGENTS_DIR}" "browser-automation" && [ "$FORCE" != "--force" ]; then
    echo "  📄 Skill: 已安装，跳过"
else
    if [ -f "${REPO_DIR}/skills/browser-automation/SKILL.md" ]; then
        cp -f "${REPO_DIR}/skills/browser-automation/SKILL.md" "${AGENTS_DIR}/browser-automation/SKILL.md"
    fi
    echo "  📄 Skill: ✅ 已安装"
fi

# 2b. Playwright CLI（npm 全局包）
HAS_PLAYWRIGHT=false
if command -v playwright &>/dev/null; then
    HAS_PLAYWRIGHT=true
    echo "  🎭 Playwright CLI: ✅ 已安装 ($(playwright --version 2>&1))"
else
    echo "  🎭 Playwright CLI: ❌ 未安装"
    read -p "     安装 Playwright CLI？(npm 全局包) [Y/n]: " install_pw
    if [ "$install_pw" = "" ] || [ "$install_pw" = "y" ] || [ "$install_pw" = "Y" ]; then
        npm install -g playwright && HAS_PLAYWRIGHT=true && echo "  🎭 Playwright CLI: ✅ 安装完成"
    else
        echo "  ⏭️  跳过 Playwright CLI（可稍后手动: npm install -g playwright）"
    fi
fi

# 2c. Playwright Chromium（与 agent-browser 共享同一浏览器）
SHARED_CHROMIUM=""
if [ "$HAS_PLAYWRIGHT" = true ]; then
    # 查找 Playwright 已安装的 Chromium
    SHARED_CHROMIUM=$(find "${HOME}/.cache/ms-playwright" -name chrome -path "*/chrome-linux/chrome" 2>/dev/null | head -1)
    if [ -n "$SHARED_CHROMIUM" ]; then
        echo "  🌐 Playwright Chromium: ✅ 已安装"
    else
        echo "  🌐 Playwright Chromium: 未安装"
        read -p "     安装 Chromium？(约 300MB, 与 agent-browser 共享) [Y/n]: " install_chromium
        if [ "$install_chromium" = "" ] || [ "$install_chromium" = "y" ] || [ "$install_chromium" = "Y" ]; then
            echo "  ⏳ 正在安装 Chromium（约 300MB），请耐心等待..."
            if playwright install chromium 2>&1; then
                SHARED_CHROMIUM=$(find "${HOME}/.cache/ms-playwright" -name chrome -path "*/chrome-linux/chrome" 2>/dev/null | head -1)
                echo "  🌐 Chromium: ✅ 安装完成"
            else
                echo "  ⚠️  Chromium 安装失败，尝试安装系统依赖后重试"
                echo "     playwright install-deps chromium"
            fi
        else
            echo "  ⏭️  跳过 Chromium 安装"
        fi
    fi
fi

# 2d. agent-browser CLI（npm 全局包）
HAS_AGENT_BROWSER=false
if command -v agent-browser &>/dev/null; then
    HAS_AGENT_BROWSER=true
    echo "  🖥️  agent-browser CLI: ✅ 已安装 ($(agent-browser --version 2>&1 | head -1))"
else
    echo "  🖥️  agent-browser CLI: ❌ 未安装"
    read -p "     安装 agent-browser CLI？(npm 全局包) [Y/n]: " install_ab
    if [ "$install_ab" = "" ] || [ "$install_ab" = "y" ] || [ "$install_ab" = "Y" ]; then
        npm install -g agent-browser && HAS_AGENT_BROWSER=true && echo "  🖥️  agent-browser CLI: ✅ 安装完成"
    else
        echo "  ⏭️  跳过 agent-browser CLI（可稍后手动: npm install -g agent-browser）"
    fi
fi

# 2e. 统一 Chromium 配置（agent-browser 共享 Playwright 的 Chromium）
if [ "$HAS_AGENT_BROWSER" = true ]; then
    echo ""
    CHROME_OK=false

    if [ -n "$SHARED_CHROMIUM" ]; then
        # 方案 A：agent-browser 使用 Playwright 的 Chromium
        export AGENT_BROWSER_EXECUTABLE_PATH="$SHARED_CHROMIUM"
        if timeout 10 agent-browser open "about:blank" --no-sandbox 2>/dev/null; then
            agent-browser close 2>/dev/null
            CHROME_OK=true
            echo "  🌐 共享 Chromium: ✅ 可用（agent-browser ↔ Playwright 统一浏览器）"
            write_env_var "$SHARED_CHROMIUM"
        fi
    fi

    if [ "$CHROME_OK" = false ]; then
        # 方案 B：尝试系统 Chrome / agent-browser 自带 Chrome
        CHROME_PATH=$(find_chrome)
        if [ -n "$CHROME_PATH" ]; then
            export AGENT_BROWSER_EXECUTABLE_PATH="$CHROME_PATH"
            if timeout 10 agent-browser open "about:blank" --no-sandbox 2>/dev/null; then
                CHROME_OK=true
                agent-browser close 2>/dev/null
                echo "  🌐 Chrome: ✅ 可用 ($CHROME_PATH)"
                write_env_var "$CHROME_PATH"
            fi
        fi
    fi

    if [ "$CHROME_OK" = false ]; then
        echo "  🌐 Chrome: ❌ 未检测到"
        echo "     agent-browser 需要 Chromium 浏览器才能工作"
        read -p "     是否下载 Chrome？(约 300MB, agent-browser install) [y/N]: " download_chrome
        if [ "$download_chrome" = "y" ] || [ "$download_chrome" = "Y" ]; then
            echo "  ⏳ 正在下载 Chrome（约 300MB），请耐心等待..."
            if agent-browser install 2>&1; then
                CHROME_PATH=$(find_chrome)
                if [ -n "$CHROME_PATH" ]; then
                    write_env_var "$CHROME_PATH"
                fi
                echo "  🌐 Chrome: ✅ 下载完成"
            else
                echo "  ⚠️  Chrome 下载失败"
                echo "     💡 可先运行 playwright install chromium，再执行本脚本自动共享"
            fi
        else
            echo "  ⏭️  跳过 Chrome 下载"
        fi
    fi
fi
echo ""

# ---- 3. Superpowers 社区 Skills ----
echo "🔧 [3/3] Superpowers 社区 Skills..."
SUPERPOWERS_DIR="${HOME}/.superpowers-skills"
if [ -d "${SUPERPOWERS_DIR}" ]; then
    echo "  ⏳ 更新已有仓库..."
    git -C "${SUPERPOWERS_DIR}" pull --ff-only 2>/dev/null || echo "  ⚠️  更新失败，继续"
else
    git clone https://github.com/obra/superpowers.git "${SUPERPOWERS_DIR}"
fi

sp_installed=0; sp_skipped=0
mkdir -p "${AGENTS_DIR}"
for skill in "${SUPERPOWERS_DIR}/skills/"*/; do
    if [ -d "$skill" ] && [ -f "${skill}SKILL.md" ]; then
        skill_name=$(basename "$skill")
        if is_installed "${AGENTS_DIR}" "${skill_name}" && [ "$FORCE" != "--force" ]; then
            sp_skipped=$((sp_skipped + 1))
            continue
        fi
        ln -sfn "$skill" "${AGENTS_DIR}/${skill_name}"
        sp_installed=$((sp_installed + 1))
    fi
done
echo "  ✅ ${sp_installed} 安装, ${sp_skipped} 跳过 (--force 覆盖)"
echo ""

# ---- 汇总 ----
echo "======================================"
echo "✅ 全部 Skill 安装完成！"
echo ""
echo "📊 已安装统计:"
echo "   ~/.config/opencode/skills/: $(ls -1 ${SKILLS_DIR} 2>/dev/null | wc -l) 个"
echo "   ~/.agents/skills/:        $(ls -1 ${AGENTS_DIR} 2>/dev/null | wc -l) 个"
echo ""
echo "⚠️  请重启 OpenCode 以使 Skill 生效"
