#!/usr/bin/env bash
# One-shot runner for the Palacioj portfolio (Next.js / LiveTerm).
# Checks Node.js + pm2, installs deps, and serves the site under pm2 in prod.
#
# Usage:
#   ./run.sh              # dev server on :3000 (no pm2, hot reload)
#   ./run.sh prod         # build + run under pm2 (reload if already running)
#   ./run.sh stop         # pm2 stop + delete the app
#   ./run.sh restart      # pm2 restart the app
#   ./run.sh logs         # tail pm2 logs
#   ./run.sh status       # pm2 status for this app
#   PORT=4000 ./run.sh prod
#   ./run.sh --help

set -euo pipefail

MODE="${1:-dev}"
PORT="${PORT:-3000}"
MIN_NODE_MAJOR=14
PM2_NAME="palacioj"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

c_red()   { printf '\033[0;31m%s\033[0m\n' "$*"; }
c_grn()   { printf '\033[0;32m%s\033[0m\n' "$*"; }
c_ylw()   { printf '\033[0;33m%s\033[0m\n' "$*"; }
c_blu()   { printf '\033[0;34m%s\033[0m\n' "$*"; }
info()    { c_blu "==> $*"; }
warn()    { c_ylw "!!  $*"; }
err()     { c_red "xx  $*" >&2; }
ok()      { c_grn "ok  $*"; }

if [[ "$MODE" == "--help" || "$MODE" == "-h" ]]; then
  sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
fi

case "$MODE" in
  dev|prod|stop|restart|logs|status) ;;
  *) err "Unknown mode '$MODE'. Try: dev | prod | stop | restart | logs | status"; exit 1 ;;
esac

# -- detect a privilege escalator for pkg installs -----------------------------
SUDO=""
if [[ $EUID -ne 0 ]]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  elif command -v doas >/dev/null 2>&1; then
    SUDO="doas"
  fi
fi

# -- detect distro package manager ---------------------------------------------
detect_pkg_mgr() {
  if   command -v apt-get >/dev/null 2>&1; then echo "apt"
  elif command -v dnf     >/dev/null 2>&1; then echo "dnf"
  elif command -v yum     >/dev/null 2>&1; then echo "yum"
  elif command -v pacman  >/dev/null 2>&1; then echo "pacman"
  elif command -v zypper  >/dev/null 2>&1; then echo "zypper"
  elif command -v apk     >/dev/null 2>&1; then echo "apk"
  elif command -v brew    >/dev/null 2>&1; then echo "brew"
  else echo ""
  fi
}
PKG_MGR="$(detect_pkg_mgr)"

# -- ensure Node.js ------------------------------------------------------------
install_node() {
  info "Installing Node.js..."
  case "$PKG_MGR" in
    apt)
      curl -fsSL https://deb.nodesource.com/setup_lts.x | $SUDO -E bash -
      $SUDO apt-get install -y nodejs
      ;;
    dnf|yum)
      curl -fsSL https://rpm.nodesource.com/setup_lts.x | $SUDO bash -
      $SUDO "$PKG_MGR" install -y nodejs
      ;;
    pacman) $SUDO pacman -Sy --noconfirm nodejs npm ;;
    zypper) $SUDO zypper install -y nodejs npm ;;
    apk)    $SUDO apk add --no-cache nodejs npm ;;
    brew)   brew install node ;;
    *)
      err "No supported package manager detected. Install Node.js >= $MIN_NODE_MAJOR manually: https://nodejs.org/"
      exit 1
      ;;
  esac
}

check_node() {
  if ! command -v node >/dev/null 2>&1; then
    warn "Node.js not found."
    install_node
  fi
  local major
  major="$(node -p 'process.versions.node.split(".")[0]')"
  if (( major < MIN_NODE_MAJOR )); then
    err "Node.js v$major is too old (need >= $MIN_NODE_MAJOR). Upgrade and re-run."
    exit 1
  fi
  ok "Node.js $(node -v)"
}

# -- choose / ensure package manager ------------------------------------------
PM=""
choose_pm() {
  if command -v yarn >/dev/null 2>&1; then
    PM="yarn"
  elif command -v npm >/dev/null 2>&1; then
    PM="npm"
  else
    warn "Neither yarn nor npm found. Installing yarn via npm..."
    if ! command -v npm >/dev/null 2>&1; then
      err "npm is missing even after Node install. Aborting."
      exit 1
    fi
    $SUDO npm install -g yarn
    PM="yarn"
  fi
  ok "Package manager: $PM"
}

# -- ensure pm2 ---------------------------------------------------------------
ensure_pm2() {
  if command -v pm2 >/dev/null 2>&1; then
    ok "pm2 $(pm2 -v)"
    return
  fi
  info "pm2 not found — installing globally via npm..."
  if ! command -v npm >/dev/null 2>&1; then
    err "npm is required to install pm2. Aborting."
    exit 1
  fi
  $SUDO npm install -g pm2
  ok "pm2 $(pm2 -v)"
}

pm2_app_exists() {
  pm2 jlist 2>/dev/null | grep -q "\"name\":\"$PM2_NAME\""
}

# -- install deps (skip if node_modules is fresh vs lockfile) -----------------
install_deps() {
  local lockfile marker
  marker="node_modules/.palacioj-installed"
  if [[ "$PM" == "yarn" ]]; then lockfile="yarn.lock"; else lockfile="package-lock.json"; fi

  if [[ -d node_modules && -f "$marker" && "$marker" -nt "$lockfile" && "$marker" -nt package.json ]]; then
    ok "Dependencies up to date — skipping install."
    return
  fi

  info "Installing dependencies with $PM..."
  if [[ "$PM" == "yarn" ]]; then
    yarn install --frozen-lockfile || yarn install
  else
    npm ci || npm install
  fi
  mkdir -p node_modules
  touch "$marker"
  ok "Dependencies installed."
}

# -- pm2 lifecycle shortcuts --------------------------------------------------
cmd_stop()    { ensure_pm2; pm2 delete "$PM2_NAME" 2>/dev/null || warn "No running app named $PM2_NAME."; pm2 save --force >/dev/null 2>&1 || true; }
cmd_restart() { ensure_pm2; pm2 restart "$PM2_NAME"; pm2 save --force >/dev/null 2>&1 || true; }
cmd_logs()    { ensure_pm2; exec pm2 logs "$PM2_NAME"; }
cmd_status()  { ensure_pm2; pm2 status "$PM2_NAME" || pm2 status; }

# -- run the app --------------------------------------------------------------
run_dev() {
  local url="http://localhost:$PORT"
  info "Starting dev server at $url (Ctrl+C to stop)"
  info "Routes served: /  and  /404  (add more under src/pages/)"
  export PORT
  exec "$PM" run dev -- --port "$PORT"
}

run_prod() {
  ensure_pm2
  info "Building production bundle..."
  "$PM" run build

  local next_bin="./node_modules/next/dist/bin/next"
  if [[ ! -x "$next_bin" && ! -f "$next_bin" ]]; then
    err "Cannot find Next.js binary at $next_bin"
    exit 1
  fi

  if pm2_app_exists; then
    info "Reloading pm2 app '$PM2_NAME' (zero-downtime)..."
    pm2 reload "$PM2_NAME" --update-env
  else
    info "Starting pm2 app '$PM2_NAME' on port $PORT..."
    PORT="$PORT" pm2 start "$next_bin" \
      --name "$PM2_NAME" \
      --cwd "$PROJECT_DIR" \
      --time \
      -- start --port "$PORT"
  fi

  pm2 save --force >/dev/null
  ok "App is live at http://localhost:$PORT"
  info "Handy: ./run.sh logs | ./run.sh status | ./run.sh restart | ./run.sh stop"
  info "To survive reboots (one-time): run 'pm2 startup' and follow its instructions."
  pm2 status "$PM2_NAME" || true
}

# -- main ---------------------------------------------------------------------
info "Palacioj portfolio — one-shot runner"
info "Project: $PROJECT_DIR"
info "Mode: $MODE | Port: $PORT | pm2 name: $PM2_NAME"
[[ -n "$PKG_MGR" ]] && ok "Distro pkg manager: $PKG_MGR" || warn "No distro pkg manager detected (Node install may fail)."

case "$MODE" in
  stop)    cmd_stop;    exit 0 ;;
  restart) cmd_restart; exit 0 ;;
  logs)    cmd_logs ;;   # exec's
  status)  cmd_status;  exit 0 ;;
esac

check_node
choose_pm
install_deps

if [[ "$MODE" == "dev" ]]; then
  run_dev
else
  run_prod
fi
