# 🌐 How to Make Your Website Permanent (Free Cloud Hosting)

To make your website run permanently on the internet (not just on your laptop), you need to upload it to a **Cloud Host**. We will use **Render.com** because it is free, easy, and supports our Full-Stack setup.

### ✅ Prerequisites
I have already prepared your code for this:
1.  Git repository is initialized.
2.  Configuration files are ready for cloud hosting.

---

### 🚀 Step-by-Step Guide

#### 1. Create a GitHub Repository
1.  Go to [GitHub.com](https://github.com) and sign in (or sign up).
2.  Click the **+** icon (top right) -> **New repository**.
3.  Name it `karthik-ai-platform`.
4.  Make it **Public**.
5.  Click **Create repository**.
6.  **Copy** the HTTPS URL (it looks like `https://github.com/yourname/karthik-ai-platform.git`).

#### 2. Upload Your Code
Open a terminal in your project folder (`c:\Users\ADMIN\Desktop\karthik`) and run these 3 commands one by one (replace the URL with yours):

```bash
git remote add origin https://github.com/YOUR_USERNAME/karthik-ai-platform.git
git branch -M main
git push -u origin main
```

#### 3. Deploy to Render (The "Permanent" Part)
1.  Go to [Render.com](https://render.com) and creating an account (you can sign in with GitHub).
2.  Click **"New +"** -> **"Web Service"**.
3.  Select "Build and deploy from a Git repository".
4.  Connect your GitHub account and select `karthik-ai-platform`.
5.  **Important Settings**:
    *   **Name**: `karthik-ai` (this will be your URL: `karthik-ai.onrender.com`)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`  *(Render might auto-fill this, verify it matches)*
    *   **Start Command**: `npm start`
    *   **Instance Type**: Free
6.  Click **Create Web Service**.

### 🎉 That's it!
Render will take about 2-3 minutes to "Build" your site.
Once it's done, it will give you a link like **`https://karthik-ai.onrender.com`**.

**This link is:**
*   **Permanent**: It runs 24/7.
*   **Public**: Anyone in the world can open it.
*   **Mobile Ready**: Works on phones.
*   **Independent**: You can turn off your laptop, and the site will stay online.
