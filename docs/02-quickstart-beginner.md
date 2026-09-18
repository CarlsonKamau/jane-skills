---
title: Quickstart for beginners
description: Zero to a checked website in an afternoon, with every term explained.
sidebar:
  order: 2
---

This page assumes you have never used a terminal. Skip to the step-by-step guide if you have.

## Words you will meet

- **Terminal**: a text window where you type commands. On Mac it is called Terminal, on Windows use PowerShell or the Windows Terminal app.
- **Repo (repository)**: a folder that git tracks. Git remembers every change so you can undo mistakes.
- **Claude Code**: Anthropic's command-line tool that lets Claude read and edit files in a folder on your computer.
- **Skill**: a folder of instructions Claude Code reads when a task matches. This project is a skill.
- **Deploy**: put the site on the internet. Vercel is a service that does this from your repo.
- **Env var (environment variable)**: a named value like a password or API key that lives outside your code so it is not committed to git.
- **Headers**: extra lines the server sends with each page that tell the browser how to behave (for example, "never show this page inside another site's frame").

## Step 1: install the tools (once)

1. Install Node.js from nodejs.org (the LTS version).
2. Install git from git-scm.com.
3. Install Claude Code by following the instructions at docs.claude.com/claude-code.
4. Optional but recommended: install `gitleaks` (a secret scanner). On Mac: `brew install gitleaks`. On Windows: download from github.com/gitleaks/gitleaks/releases.

## Step 2: install the skill (once)

Open a terminal and run:

```bash
git clone https://github.com/CarlsonKamau/jane-skills.git ~/ship-ready-web
mkdir -p ~/.claude/skills
cp -r ~/ship-ready-web/skills/ship-ready-web ~/.claude/skills/
```

That copies the skill folder into the place Claude Code looks. Restart Claude Code if it was open.

## Step 3: get a website to check

If you already have one, open its folder in the terminal:

```bash
cd path/to/your/site
```

If you want to practise first, use the demo bakery site in this repo, which is broken on purpose:

```bash
cd ~/ship-ready-web/examples/broken-site
```

## Step 4: run the audit

```bash
claude
```

Then type:

> Audit this site before handoff using the ship-ready-web skill. Fix what you safely can and write AUDIT.md.

Claude will run the checks, list what failed, fix the safe items, and stop to ask you about anything involving payments, personal data, or legal text. Answer its questions honestly; "I don't know" is a fine answer and it will tell you what to find out.

## Step 5: read AUDIT.md

The report has five sections. Anything under **Critical** means do not launch yet. Everything else is prioritised for you.

## Step 6: do the four manual checks

The script cannot do these, so a person must:

1. **Lighthouse**: open your deployed site in Chrome, press F12, click the Lighthouse tab, choose Mobile, click Analyze. Aim for 90+ in every category.
2. **axe**: install the axe DevTools browser extension, open it in the same F12 panel, click Scan. Fix anything marked critical or serious.
3. **Security headers**: go to securityheaders.com, paste your URL. Aim for an A.
4. **A real phone**: open the site on a cheap Android over mobile data, not wifi. If it feels slow, it is slow.

## Step 7: ship

When AUDIT.md has nothing under Critical and the four manual checks pass, deploy. Keep AUDIT.md; if you are doing this for a client, send it to them. It is proof of work.

## If something goes wrong

- "command not found: claude": Claude Code is not installed or the terminal needs restarting.
- "no such file or directory": you are in the wrong folder. Type `pwd` to see where you are.
- The audit says an `.env` file is tracked by git: that is the most important finding on the list. Read "Secrets" in the checklist explained page before doing anything else.
