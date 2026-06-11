#!/usr/bin/env bash
#
# 部署 macOS Web 到服务器
#
#   用法:  ./deploy.sh
#
# 把本地代码 rsync 到服务器的静态目录,Caddy 会立即提供新文件(无需重启)。
# 部署完成后从服务器本机做一次健康检查,确认站点返回 200。
#
set -euo pipefail

# ============ 配置(按需修改) ============
SSH_HOST="aliyun"                       # ~/.ssh/config 里的主机别名
REMOTE_DIR="/opt/mac-desktop"           # 服务器上的静态文件目录
DOMAIN="desktop.19ba.cn"                # 对外域名(仅用于健康检查)
# =========================================

# 以脚本所在目录为同步源,保证在任何位置运行结果一致
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/"

# 终端颜色
if [ -t 1 ]; then G=$'\033[32m'; Y=$'\033[33m'; R=$'\033[31m'; B=$'\033[1m'; N=$'\033[0m'; else G=; Y=; R=; B=; N=; fi
info() { printf '%s▸ %s%s\n' "$B" "$1" "$N"; }
ok()   { printf '%s  ✓ %s%s\n' "$G" "$1" "$N"; }
die()  { printf '%s  ✗ %s%s\n' "$R" "$1" "$N" >&2; exit 1; }

command -v rsync >/dev/null || die "本机未安装 rsync"

info "同步代码到 ${SSH_HOST}:${REMOTE_DIR}"
rsync -az --delete --itemize-changes \
  --exclude='.git/' \
  --exclude='.DS_Store' \
  --exclude='AGENTS.md' \
  --exclude='deploy.sh' \
  "$SRC_DIR" "${SSH_HOST}:${REMOTE_DIR}/" \
  || die "rsync 失败,检查 SSH 连接或远程路径"
ok "文件已同步"

info "修正远程文件权限(确保 Caddy 可读)"
ssh "$SSH_HOST" "chmod -R a+rX '$REMOTE_DIR'" || die "权限设置失败"
ok "权限就绪"

info "健康检查(服务器本机,经 ${DOMAIN} 证书校验)"
CODE="$(ssh "$SSH_HOST" \
  "curl -s -o /dev/null -w '%{http_code}' --resolve ${DOMAIN}:443:127.0.0.1 https://${DOMAIN}/ 2>/dev/null" \
  || true)"
if [ "$CODE" = "200" ]; then
  ok "站点返回 200 —— https://${DOMAIN} 部署成功 🎉"
else
  printf '%s  ! 站点返回 %s(非 200)。Caddy 是否在运行?证书是否就绪?%s\n' "$Y" "${CODE:-无响应}" "$N"
  printf '    排查:%sssh %s "systemctl status caddy --no-pager"%s\n' "$B" "$SSH_HOST" "$N"
  exit 1
fi
