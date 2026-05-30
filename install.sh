#!/bin/bash

# Efficient OpenCode 一键安装脚本
# 作者：meisijiya（老江湖）
# 日期：2026-05-27

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    print_info "检查依赖..."
    
    # 检查 OpenCode
    if ! command -v opencode &> /dev/null; then
        print_error "OpenCode 未安装，请先安装 OpenCode"
        echo "安装命令：curl -fsSL https://opencode.ai/install | bash"
        exit 1
    fi
    
    print_success "OpenCode 已安装：$(opencode --version)"
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_warning "Node.js 未安装，某些功能可能受限"
    else
        print_success "Node.js 已安装：$(node --version)"
    fi
}

# 选择模型引擎
select_model() {
    # 支持命令行参数
    if [ "$1" = "--deepseek" ] || [ "$1" = "-d" ]; then
        MODEL_CHOICE="deepseek"
        print_info "通过命令行参数选择：DeepSeek + MiniMax"
        return
    elif [ "$1" = "--mimo" ] || [ "$1" = "-m" ]; then
        MODEL_CHOICE="mimo"
        print_info "通过命令行参数选择：MiMo + MiniMax"
        return
    elif [ "$1" = "--minimax" ] || [ "$1" = "-x" ]; then
        MODEL_CHOICE="minimax"
        print_info "通过命令行参数选择：纯 MiniMax M2.7"
        return
    elif [ "$1" = "--template" ] || [ "$1" = "-t" ]; then
        MODEL_CHOICE="template"
        print_info "通过命令行参数选择：自定义模板"
        return
    elif [ "$1" = "--solofast" ] || [ "$1" = "-s" ]; then
        MODEL_CHOICE="solofast"
        print_info "通过命令行参数选择：SoloFast 单Fast模型"
        return
    fi

    echo ""
    echo "=========================================="
    echo -e "${BLUE}请选择模型引擎方案${NC}"
    echo "=========================================="
    echo ""
    echo "  1) MiMo + MiniMax（默认）"
    echo "     - 推理引擎：MiMo V2.5 Pro"
    echo "     - 执行引擎：MiniMax M2.7"
    echo "     - 低成本引擎：MiMo V2.5"
    echo ""
    echo "  2) DeepSeek + MiniMax"
    echo "     - 推理引擎：DeepSeek V4 Pro"
    echo "     - 执行引擎：MiniMax M2.7"
    echo "     - 低成本引擎：DeepSeek V4 Flash"
    echo ""
    echo "  3) 纯 MiniMax M2.7"
    echo "     - 全部使用 MiniMax M2.7（单模型）"
    echo "     - 适合 MiniMax Token 订阅用户"
    echo ""
    echo "  4) 自定义模板"
    echo "     - 手动输入模型 ID，由你完全掌控"
    echo "     - 支持三层模型：Pro / Fast / Exec + 备选"
    echo ""
    echo "  5) SoloFast 模板（🆕 推荐）"
    echo "     - 只用一个 Fast 模型 + MiniMax M2.7"
    echo "     - 输入 Fast 模型 ID，其余自动配置为 MiniMax M2.7"
    echo ""
    
    read -p "请输入选项 (1/2/3/4/5，默认 1): " choice
    
    case "$choice" in
        2)
            MODEL_CHOICE="deepseek"
            print_success "已选择：DeepSeek + MiniMax"
            ;;
        3)
            MODEL_CHOICE="minimax"
            print_success "已选择：纯 MiniMax M2.7"
            ;;
        4)
            MODEL_CHOICE="template"
            print_success "已选择：自定义模板"
            ;;
        5)
            MODEL_CHOICE="solofast"
            print_success "已选择：SoloFast 模板"
            ;;
        *)
            MODEL_CHOICE="mimo"
            print_success "已选择：MiMo + MiniMax"
            ;;
    esac
}

# 选择 prompt 模式（追加 vs 覆盖）
select_prompt_mode() {
    echo ""
    echo "=========================================="
    echo -e "${BLUE}请选择 Prompt 注入模式${NC}"
    echo "=========================================="
    echo ""
    echo "  1) prompt_append 追加模式（默认，推荐新手）"
    echo "     - 你的自定义内容追加在官方系统提示之后"
    echo "     - 官方行为规则保留，你的规则作为补充"
    echo ""
    echo "  2) prompt 覆盖模式（完全自定义，推荐进阶）"
    echo "     - 你的内容完全替换官方系统提示"
    echo "     - 需要自己在 prompt 中定义身份和全部行为规则"
    echo "     - 当前配置已包含完整的身份声明和边界约束"
    echo ""
    
    read -p "请输入选项 (1/2，默认 1): " prompt_choice
    
    case "$prompt_choice" in
        2)
            PROMPT_MODE="prompt"
            print_success "已选择：prompt 覆盖模式"
            ;;
        *)
            PROMPT_MODE="prompt_append"
            print_success "已选择：prompt_append 追加模式"
            ;;
    esac
}

# 自定义模板：提示用户输入模型 ID
configure_template() {
    local template_file="configs/oh-my-openagent-template.json"
    local temp_file="/tmp/oh-my-openagent-template-$$.json"

    if [ ! -f "$template_file" ]; then
        print_error "模板文件不存在: $template_file"
        exit 1
    fi

    echo ""
    echo "=========================================="
    echo -e "${BLUE}自定义模板 - 输入模型 ID${NC}"
    echo "=========================================="
    echo ""
    echo "模板使用三层模型架构："
    echo "  Pro 模型  → 用于 Sisyphus/Oracle/Prometheus 等推理型 Agent"
    echo "  Fast 模型 → 用于 Explore/Librarian 等轻量 Agent"
    echo "  Exec 模型 → 用于 Atlas/Momus 等执行型 Agent"
    echo "  备选模型  → 所有 Agent 的 fallback（当主模型不可用时）"
    echo ""

    read -p "Pro 模型 ID（推理型）: " PRO_MODEL
    read -p "Fast 模型 ID（轻量型）: " FAST_MODEL
    read -p "Exec 模型 ID（执行型）: " EXEC_MODEL
    read -p "备选模型 ID（fallback）: " FALLBACK_MODEL

    if [ -z "$PRO_MODEL" ] || [ -z "$FAST_MODEL" ] || [ -z "$EXEC_MODEL" ] || [ -z "$FALLBACK_MODEL" ]; then
        print_error "所有模型 ID 不能为空"
        exit 1
    fi

    print_info "正在生成配置..."

    sed -e "s|__PRO_MODEL__|${PRO_MODEL}|g" \
        -e "s|__FAST_MODEL__|${FAST_MODEL}|g" \
        -e "s|__EXEC_MODEL__|${EXEC_MODEL}|g" \
        -e "s|__FALLBACK_MODEL__|${FALLBACK_MODEL}|g" \
        "$template_file" > "$temp_file"

    # 验证生成的是合法 JSON
    if ! python3 -m json.tool "$temp_file" > /dev/null 2>&1; then
        print_error "生成的配置 JSON 不合法，请检查模型 ID 是否包含特殊字符"
        rm -f "$temp_file"
        exit 1
    fi

    cp "$temp_file" "$HOME/.config/opencode/oh-my-openagent.json"
    rm -f "$temp_file"
    print_success "自定义配置已生成"
}

# SoloFast 模板：只需输入 FAST 模型 ID，其余固定为 MiniMax M2.7
configure_solofast() {
    local template_file="configs/ohmyopencode-solofast.json"
    local temp_file="/tmp/ohmyopencode-solofast-$$.json"

    if [ ! -f "$template_file" ]; then
        print_error "模板文件不存在: $template_file"
        exit 1
    fi

    echo ""
    echo "=========================================="
    echo -e "${BLUE}SoloFast 模板 - 输入 Fast 模型 ID${NC}"
    echo "=========================================="
    echo ""
    echo "SoloFast 架构："
    echo "  Fast 模型 → 用于所有推理型 Agent（Sisyphus/Oracle/Prometheus 等）"
    echo "  MiniMax M2.7 → 用于代码搜索/轻量任务/执行（已自动配置）"
    echo ""

    read -p "Fast 模型 ID: " FAST_MODEL

    if [ -z "$FAST_MODEL" ]; then
        print_error "模型 ID 不能为空"
        exit 1
    fi

    print_info "正在生成配置..."

    # 用 Python 替代 sed 避免分隔符冲突（如模型 ID 含 / & 等特殊字符）
    python3 -c "
import sys, json
with open(sys.argv[1]) as f:
    content = f.read()
content = content.replace('{{FAST_MODEL_ID}}', sys.argv[2])
json.loads(content)
with open(sys.argv[3], 'w') as f:
    f.write(content)
" "$template_file" "$FAST_MODEL" "$temp_file"

    if [ $? -ne 0 ]; then
        print_error "生成的配置 JSON 不合法，请检查模型 ID 是否包含特殊字符"
        rm -f "$temp_file"
        exit 1
    fi

    cp "$temp_file" "$HOME/.config/opencode/oh-my-openagent.json"
    rm -f "$temp_file"
    print_success "SoloFast 配置已生成"

}

# 备份现有配置
backup_configs() {
    print_info "备份现有配置..."
    
    BACKUP_DIR="$HOME/.config/opencode/backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if [ -f "$HOME/.config/opencode/opencode.json" ]; then
        cp "$HOME/.config/opencode/opencode.json" "$BACKUP_DIR/"
        print_success "已备份 opencode.json"
    fi
    
    if [ -f "$HOME/.config/opencode/oh-my-openagent.json" ]; then
        cp "$HOME/.config/opencode/oh-my-openagent.json" "$BACKUP_DIR/"
        print_success "已备份 oh-my-openagent.json"
    fi
    
    print_success "备份完成：$BACKUP_DIR"
}

# 安装配置文件
install_configs() {
    print_info "安装配置文件..."
    
    # 确保配置目录存在
    mkdir -p "$HOME/.config/opencode"
    
    # 复制 OpenCode 主配置
    cp configs/opencode.json "$HOME/.config/opencode/opencode.json"
    
    # 根据模型选择和 prompt 模式确定配置文件名
    if [ "$MODEL_CHOICE" = "template" ]; then
        configure_template
        if [ "$PROMPT_MODE" = "prompt" ]; then
            print_warning "模板方案暂不支持 prompt 覆盖模式，使用 prompt_append 追加模式"
        fi
    elif [ "$MODEL_CHOICE" = "solofast" ]; then
        configure_solofast
        if [ "$PROMPT_MODE" = "prompt" ]; then
            print_warning "SoloFast 方案暂不支持 prompt 覆盖模式，使用 prompt_append 追加模式"
        fi
    else
        local suffix=""
        if [ "$PROMPT_MODE" = "prompt" ]; then
            suffix="-prompt"
        fi
        local agent_config="configs/oh-my-openagent-${MODEL_CHOICE}${suffix}.json"
        if [ ! -f "$agent_config" ]; then
            print_error "配置文件不存在: $agent_config"
            exit 1
        fi
        cp "$agent_config" "$HOME/.config/opencode/oh-my-openagent.json"
    fi
    
    print_success "配置文件安装完成（模型方案：${MODEL_CHOICE}）"
}

# 安装 OhMyOpenAgent 插件
install_ohmyopenagent() {
    print_info "检查 OhMyOpenAgent 插件..."
    
    if grep -q "oh-my-openagent" "$HOME/.config/opencode/opencode.json" 2>/dev/null; then
        print_success "OhMyOpenAgent 插件已配置"
    else
        print_warning "OhMyOpenAgent 插件未配置，请手动安装"
        echo "安装命令：bunx oh-my-opencode@latest"
    fi
}

# 安装 MiniMax MCP
install_minimax_mcp() {
    print_info "检查 MiniMax MCP..."
    
    if command -v uvx &> /dev/null; then
        print_success "uvx 已安装，MiniMax MCP 可用"
    else
        print_warning "uvx 未安装，MiniMax MCP 可能不可用"
        echo "安装命令：pip install uv"
    fi
}

install_easyvision() {
    print_info "检查 EasyVision 插件..."
    
    if [ -f "$HOME/.config/opencode/opencode-minimax-easy-vision.jsonc" ]; then
        print_success "EasyVision 配置文件已存在"
    else
        print_info "复制 EasyVision 配置文件..."
        cp configs/opencode-minimax-easy-vision.jsonc "$HOME/.config/opencode/"
        print_success "EasyVision 配置文件已复制"
    fi
    
    if [ -d "$HOME/.config/opencode/plugins/opencode-minimax-easy-vision" ]; then
        print_success "EasyVision 插件已安装"
    else
        print_info "安装 EasyVision 插件..."
        opencode plugin opencode-minimax-easy-vision --global 2>/dev/null || \
            git clone https://github.com/devadathanmb/opencode-minimax-easy-vision.git "$HOME/.config/opencode/plugins/opencode-minimax-easy-vision" 2>/dev/null
        print_success "EasyVision 插件安装完成"
    fi
}

# 打印安装摘要
print_summary() {
    echo ""
    echo "=========================================="
    echo -e "${GREEN}✅ Efficient OpenCode 安装完成！${NC}"
    echo "=========================================="
    echo ""
    echo "📁 配置文件位置："
    echo "   - $HOME/.config/opencode/opencode.json"
    echo "   - $HOME/.config/opencode/oh-my-openagent.json"
    echo ""
    echo "📚 文档位置："
    echo "   - docs/ohmyopencode-guide.md"
    echo "   - docs/ohmyopencode的skill必装合集.md"
    echo ""
    echo "⚡ 核心优化："
    echo "   1. Compaction 上下文压缩（自动压缩长会话）"
    echo "   2. Sisyphus 强制委托纪律（Pro 只做编排）"
    echo "   3. 双引擎架构（根据选择：${MODEL_CHOICE} + MiniMax M2.7）"
    echo "   4. description/prompt_append 字段分工（精简描述，专注边界）"
    echo ""
    echo "🔄 请重启 OpenCode 使配置生效"
    echo ""
}

# 主函数
main() {
    echo ""
    echo "=========================================="
    echo -e "${BLUE}Efficient OpenCode 一键安装${NC}"
    echo "=========================================="
    echo ""
    
    check_dependencies
    select_model "$1"
    select_prompt_mode
    backup_configs
    install_configs
    install_ohmyopenagent
    install_minimax_mcp
    install_easyvision
    show_summary
}

# 运行主函数（支持 --mimo / --deepseek 参数跳过交互选择）
main "$@"
