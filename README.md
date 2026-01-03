# Lee-Tee_Book1_Episode1
interactive reading

## Deploying updates from this workspace to your GitHub repo

The changes in this workspace (including the fixed “Lesson Map” bar in `episode1.html`) only live locally until you push them to your GitHub repository. Use the steps below to publish them to `https://github.com/marlithaw/Lee-Tee_Prototype` so your live site can redeploy.

1. **Add the remote (one-time)**
   ```bash
   cd /workspace/Lee-Tee_Prototype
   git remote add origin https://github.com/marlithaw/Lee-Tee_Prototype.git
   ```

2. **Confirm branches**
   ```bash
   git fetch origin
   git branch -a
   ```
   Identify the branch your site deploys from (often `main` or `gh-pages`).

3. **Push the current work branch to the deploy branch**
   ```bash
   # Example pushes current branch to main; adjust if your deploy branch differs
   git push -u origin work:main
   ```

4. **Trigger the host to redeploy**
   - GitHub Pages: make sure Pages is configured to use the branch you just pushed.
   - Netlify/Vercel/Cloudflare Pages: pushing to the configured branch will kick off a build automatically.

5. **Verify live**
   After the deploy finishes, open `episode1.html` on the live site and confirm the top sticky “Lesson Map” bar appears and stays fixed while scrolling.
