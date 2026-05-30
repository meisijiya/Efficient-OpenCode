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

# ---- 2. agent-browser Skill ----
echo "🔧 [2/3] agent-browser Skill..."
mkdir -p "${AGENTS_DIR}/agent-browser"
if is_installed "${AGENTS_DIR}" "agent-browser" && [ "$FORCE" != "--force" ]; then
    echo "  ⏭️  已安装，跳过 (--force 覆盖)"
else
    cp -f "${REPO_DIR}/skills/agent-browser/SKILL.md" "${AGENTS_DIR}/agent-browser/SKILL.md"
    echo "  ✅ agent-browser Skill 已安装"
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
