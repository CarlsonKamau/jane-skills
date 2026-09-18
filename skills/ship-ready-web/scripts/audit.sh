#!/usr/bin/env bash
# audit.sh: deterministic pre-handoff checks. Run from the project root.
# Exit code 1 if any critical check fails. Never prints secret values.
set -uo pipefail

FAIL=0
pass() { printf '  PASS  %s\n' "$1"; }
fail() { printf '  FAIL  %s\n' "$1"; FAIL=1; }
warn() { printf '  WARN  %s\n' "$1"; }
skip() { printf '  SKIP  %s\n' "$1"; }

echo "== ship-ready-web audit =="

# 1. Env files committed?
echo "[1] Env files"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git ls-files | grep -Ev '\.env\.example$' | grep -Eq '(^|/)\.env(\.[a-z]+)?$' ; then
    fail "an .env file is tracked by git"
  else
    pass "no .env files tracked"
  fi
  if [ -f .gitignore ] && grep -q '^\.env' .gitignore; then pass ".env ignored"; else warn ".gitignore does not ignore .env*"; fi
  [ -f .env.example ] && pass ".env.example present" || warn "no .env.example"
else
  skip "not a git repo"
fi

# 2. Secret patterns in source (prints file:line only, never the value)
echo "[2] Secret patterns in source"
EXCL="--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=dist --exclude-dir=build --exclude-dir=out --exclude=*.lock --exclude=audit.sh --exclude=.env.example"
HIGH='(sk_live_[A-Za-z0-9]{8,}|sk_test_[A-Za-z0-9]{8,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|xox[bp]-[A-Za-z0-9-]{10,}|SUPABASE_SERVICE_ROLE_KEY=.{8,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY)'
HITS=$(grep -rEIn $EXCL "$HIGH" . 2>/dev/null | cut -d: -f1,2)
if [ -n "$HITS" ]; then
  fail "high-confidence secrets found (file:line):"; echo "$HITS" | sed 's/^/        /'
else
  pass "no high-confidence secret patterns"
fi
JWTS=$(grep -rEIn $EXCL 'eyJhbGciOi[A-Za-z0-9_-]{20,}' . 2>/dev/null | cut -d: -f1,2)
[ -n "$JWTS" ] && { warn "hardcoded JWT-shaped strings (anon keys belong in env, service keys never in client code):"; echo "$JWTS" | sed 's/^/        /'; } || pass "no hardcoded JWTs"
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --no-banner --redact -q >/dev/null 2>&1 && pass "gitleaks clean" || fail "gitleaks found leaks (run: gitleaks detect --redact)"
else
  skip "gitleaks not installed (brew install gitleaks)"
fi

# 3. Public env vars that look secret
echo "[3] Client-exposed env vars"
PUB=$(grep -rhoE --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git '(NEXT_PUBLIC|VITE|REACT_APP)_[A-Z0-9_]*(SECRET|SERVICE|PRIVATE|TOKEN|PASSWORD)[A-Z0-9_]*' . 2>/dev/null | sort -u)
if [ -n "$PUB" ]; then fail "public env vars with secret-like names:"; echo "$PUB" | sed 's/^/        /'; else pass "no suspicious public env names"; fi

# 4. Dependencies
echo "[4] Dependencies"
if [ -f package.json ]; then
  if [ -f package-lock.json ] || [ -f pnpm-lock.yaml ] || [ -f yarn.lock ] || [ -f bun.lockb ]; then pass "lockfile present"; else fail "no lockfile"; fi
  if [ -f package-lock.json ] && ! grep -q '"node_modules/' package-lock.json; then
    fail "package-lock.json has no resolved packages (run npm install and commit the lockfile)"
  elif command -v npm >/dev/null 2>&1 && [ -f package-lock.json ]; then
    npm audit --audit-level=high >/dev/null 2>&1; RC=$?
    if [ "$RC" -eq 0 ]; then pass "npm audit: no high/critical"
    elif [ "$RC" -eq 1 ]; then fail "npm audit found high/critical (run: npm audit)"
    else warn "npm audit could not run (offline or registry error), re-run with network"; fi
  else
    skip "npm audit (needs npm + package-lock.json)"
  fi
else
  skip "no package.json"
fi

# 5. Next.js specifics
echo "[5] Next.js config"
CFG=$(ls next.config.* 2>/dev/null | head -1)
if [ -n "$CFG" ]; then
  grep -q 'headers()' "$CFG" && pass "headers() defined" || fail "no headers() in $CFG"
  grep -q 'Strict-Transport-Security' "$CFG" && pass "HSTS set" || fail "HSTS missing"
  grep -q 'Content-Security-Policy' "$CFG" && pass "CSP present" || warn "no CSP"
  grep -q 'poweredByHeader: false' "$CFG" && pass "X-Powered-By disabled" || warn "poweredByHeader not disabled"
  { [ -f proxy.ts ] || [ -f src/proxy.ts ] || [ -f middleware.ts ] || [ -f src/middleware.ts ]; } && pass "proxy/middleware present" || warn "no proxy.ts or middleware.ts"
  grep -rqE --include='*.ts' --include='*.tsx' --exclude-dir=node_modules --exclude-dir=.next 'requireUser|getUser\(|getSession\(|auth\(\)' app src 2>/dev/null && pass "server-side session checks found in app code" || warn "no server-side session check found in app/ (protected data must be guarded where it is read)"
    has() { compgen -G "$1" >/dev/null || compgen -G "$2" >/dev/null; }
  has 'app/robots.*' 'src/app/robots.*' && pass "robots" || warn "no app/robots.ts"
  has 'app/sitemap.*' 'src/app/sitemap.*' && pass "sitemap" || warn "no app/sitemap.ts"
  has 'app/not-found.*' 'src/app/not-found.*' && pass "custom 404" || warn "no app/not-found.tsx"
else
  skip "not a Next.js project"
fi

# 6. Risky patterns
echo "[6] Risky code patterns"
DSI=$(grep -rln --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 'dangerouslySetInnerHTML' --include='*.tsx' --include='*.jsx' . 2>/dev/null)
[ -n "$DSI" ] && warn "dangerouslySetInnerHTML used in: $(echo $DSI | tr '\n' ' ') (verify input is trusted)" || pass "no dangerouslySetInnerHTML"
grep -rqE --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git 'localStorage\.setItem\([^)]*(token|jwt|secret)' . 2>/dev/null && fail "token stored in localStorage" || pass "no tokens in localStorage"

# 7. Public assets
echo "[7] Public assets"
{ [ -f public/og.jpg ] || [ -f public/og.png ]; } && pass "OG image" || warn "no public/og.jpg"
{ [ -f public/favicon.ico ] || compgen -G 'app/icon.*' >/dev/null; } && pass "favicon" || warn "no favicon"

echo
echo "Manual checks still required: Lighthouse mobile, axe, securityheaders.com, real-device test."
echo "See CHECKLIST.md."
[ "$FAIL" -eq 0 ] && { echo "RESULT: no critical failures"; exit 0; } || { echo "RESULT: critical failures found"; exit 1; }
