# Working on this repo

Start with HANDOVER.md for full context and the verification list.

- This is a Claude Code skill. Keep `skills/ship-ready-web/SKILL.md` under 400 words; put detail in CHECKLIST.md, references/, or adapters/.
- Never add a real key, token, or URL with credentials anywhere, including examples. Use obvious placeholders.
- Every change to `scripts/audit.sh` must keep the rule: print locations, never values.
- Adapters are framework-specific and self-contained. A new adapter gets its own folder and README.
- Prefer deleting over adding. Success criteria over instructions.
