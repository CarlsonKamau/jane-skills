# Security policy

This repo contains no secrets and must never contain any. CI runs gitleaks on every push.

If you find a security issue in the skill, the adapter code, or the audit script, open a private security advisory on GitHub rather than a public issue.

The audit script prints file paths and line numbers of suspected secrets, never the values themselves. Keep it that way in any contribution.
