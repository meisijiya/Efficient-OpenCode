#!/usr/bin/env bash
# ============================================================
# Efficient-OpenCode Skills 一键安装脚本
# 安装 ohmyopencode 必装合集 + agent-browser 共 14 个 Skill
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

# ---- 2. agent-browser Skill + CLI + Chrome ----
echo "🔧 [2/3] agent-browser 浏览器自动化..."
echo ""

# 2a. 安装 Skill 文件
mkdir -p "${AGENTS_DIR}/agent-browser"
if is_installed "${AGENTS_DIR}" "agent-browser" && [ "$FORCE" != "--force" ]; then
    echo "  📄 Skill 文件: 已安装，跳过"
else
    cp -f "${REPO_DIR}/skills/agent-browser/SKILL.md" "${AGENTS_DIR}/agent-browser/SKILL.md"
    echo "  📄 Skill 文件: ✅ 已安装"
fi

# 2b. 检查 agent-browser CLI 是否安装
HAS_CLI=false
if command -v agent-browser &>/dev/null; then
    HAS_CLI=true
    echo "  🖥️  CLI: ✅ 已安装 ($(agent-browser --version 2>&1 | head -1))"
else
    echo "  🖥️  CLI: ❌ 未安装"
    read -p "     安装 agent-browser CLI？(npm 全局包) [Y/n]: " install_cli
    if [ "$install_cli" = "" ] || [ "$install_cli" = "y" ] || [ "$install_cli" = "Y" ]; then
        npm install -g agent-browser && HAS_CLI=true && echo "  🖥️  CLI: ✅ 安装完成"
    else
        echo "  ⏭️  跳过 CLI 安装（可稍后手动: npm install -g agent-browser）"
    fi
fi

# 2c. Chrome 检测与下载
if [ "$HAS_CLI" = true ]; then
    echo ""
    # 快速测试 Chrome 是否可用
    CHROME_OK=false
    if timeout 10 agent-browser open "about:blank" --no-sandbox 2>/dev/null; then
        CHROME_OK=true
        agent-browser close 2>/dev/null
    fi

    if [ "$CHROME_OK" = true ]; then
        echo "  🌐 Chrome: ✅ 可用"
    else
        # 尝试用 env var
        CHROME_CUSTOM="${HOME}/.agent-browser/chrome-install/opt/google/chrome/google-chrome"
        if [ -f "$CHROME_CUSTOM" ]; then
            export AGENT_BROWSER_EXECUTABLE_PATH="$CHROME_CUSTOM"
            if timeout 10 agent-browser open "about:blank" --no-sandbox 2>/dev/null; then
                CHROME_OK=true
                agent-browser close 2>/dev/null
                echo "  🌐 Chrome: ✅ 可用 (自定义路径)"
                # 持久化 env var
                if ! grep -q "AGENT_BROWSER_EXECUTABLE_PATH" "${HOME}/.bashrc" 2>/dev/null; then
                    echo "" >> "${HOME}/.bashrc"
                    echo "# agent-browser Chrome 路径" >> "${HOME}/.bashrc"
                    echo "export AGENT_BROWSER_EXECUTABLE_PATH=${CHROME_CUSTOM}" >> "${HOME}/.bashrc"
                    echo "  💡 已将 Chrome 路径写入 ~/.bashrc，source ~/.bashrc 生效"
                fi
            fi
        fi
    fi

    if [ "$CHROME_OK" = false ]; then
        echo "  🌐 Chrome: ❌ 未检测到"
        echo "     agent-browser 需要 Chrome 浏览器才能工作"
        echo "     💾 Chrome 约 300MB，下载可能需要几分钟"
        read -p "     是否下载 Chrome？[y/N]: " download_chrome
        if [ "$download_chrome" = "y" ] || [ "$download_chrome" = "Y" ]; then
            echo "  ⏳ 正在下载 Chrome（约 300MB），请耐心等待..."
            if agent-browser install 2>&1; then
                echo "  🌐 Chrome: ✅ 下载完成"
                # 检查是否需要设置 env var
                CHROME_CUSTOM="${HOME}/.agent-browser/chrome-install/opt/google/chrome/google-chrome"
                if [ -f "$CHROME_CUSTOM" ] && ! grep -q "AGENT_BROWSER_EXECUTABLE_PATH" "${HOME}/.bashrc" 2>/dev/null; then
                    export AGENT_BROWSER_EXECUTABLE_PATH="$CHROME_CUSTOM"
                    echo "" >> "${HOME}/.bashrc"
                    echo "# agent-browser Chrome 路径" >> "${HOME}/.bashrc"
                    echo "export AGENT_BROWSER_EXECUTABLE_PATH=${CHROME_CUSTOM}" >> "${HOME}/.bashrc"
                    echo "  💡 已将 Chrome 路径写入 ~/.bashrc"
                fi
            else
                echo "  ⚠️  Chrome 下载失败，请手动运行: agent-browser install"
            fi
        else
            echo "  ⏭️  跳过 Chrome 下载（可稍后手动: agent-browser install）"
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
