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
    
    # 复制配置文件
    cp configs/opencode.json "$HOME/.config/opencode/opencode.json"
    cp configs/oh-my-openagent.json "$HOME/.config/opencode/oh-my-openagent.json"
    
    print_success "配置文件安装完成"
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
    echo "   3. 双引擎架构（DeepSeek v4 + MiniMax M2.7）"
    echo ""
    echo "🔄 请重启 OpenCode 使配置生效"
    echo ""
}

# 主函数
main() {
    echo ""
    echo "=========================================="
    echo -e "${BLUE}🚀 Efficient OpenCode 安装程序${NC}"
    echo "=========================================="
    echo ""
    
    check_dependencies
    backup_configs
    install_configs
    install_ohmyopenagent
    install_minimax_mcp
    print_summary
}

# 运行主函数
main
