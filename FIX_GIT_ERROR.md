# 🛑 FIX for "fatal: No configured push destination"

This error means your computer has the code, but it doesn't know **where** to send it (it's not connected to GitHub yet).

## ✅ Step 1: Create a Repo (If you haven't)
1.  Go to [GitHub.com/new](https://github.com/new).
2.  Name it: `visual-ai-platform` (or anything you like).
3.  Click **Create repository**.
4.  **Copy the HTTPS URL** (It looks like: `https://github.com/YOUR_NAME/visual-ai-platform.git`).

## ✅ Step 2: Connect it
Run these commands in your terminal (replace the URL with yours):

```powershell
# 1. Connect to GitHub
git remote add origin <PASTE_YOUR_GITHUB_URL_HERE>

# 2. Rename branch to main
git branch -M main

# 3. Push your code
git push -u origin main
```

**Example:**
`git remote add origin https://github.com/karthik/visual-ai.git`

## ❓ "Remote origin already exists"?
If you get this error, it means you linked it to the wrong place before. Fix it with:
`git remote set-url origin <PASTE_YOUR_NEW_GITHUB_URL_HERE>`
