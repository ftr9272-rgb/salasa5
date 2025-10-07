Deployment steps for Vercel

1) Quick (Vercel CLI)

- Install Vercel CLI if you don't have it:
  npm i -g vercel

- From project root, build and deploy:
  vercel --prod

- The first run will ask which scope and project name to use. Vercel will detect the framework (Vite) and use `npm run build` by default because we provided `vercel.json`.

2) Git-based (recommended for production)

- Push your repo to GitHub/GitLab/Bitbucket.
- On Vercel dashboard, click "New Project" → Import Git Repository.
- Select the repo and the branch you want to deploy (e.g., `design/accessibility-performance`).
- Vercel will detect the build command and output directory from `vercel.json` or package.json scripts (`npm run build`, output `dist`).
- Set any environment variables required by your app in the Vercel project settings (e.g., API_URL, VITE_... vars). Use `VITE_` prefix for variables you want exposed client-side.

3) Notes

- Ensure `npm run build` produces files in `dist` (Vite default). The `build` script currently runs `tsc && vite build` which will produce `dist` for Vite but also requires `tsc` to succeed.
- If you have server-side secrets (API keys), set them in Vercel's Environment Variables and do not commit them.
- For SPA routing, `vercel.json` contains a rewrite to `index.html` so client-side routes work.

4) Troubleshooting

- If the build fails on Vercel due to `tsc`, consider changing `build` script to `vite build` and run type-checks separately in CI, or ensure TypeScript compiles in the hosted environment (Node version >=16 recommended).

*** End of file
