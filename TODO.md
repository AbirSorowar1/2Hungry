# TODO

## Plan (SPA fix for Vercel MIME type error)
1. ✅ Update `vercel.json` to avoid rewriting JS/CSS asset requests to `/`.
2. ⏳ Redeploy to Vercel.
3. ⏳ Confirm `assets/*.js` (module script) returns `200` with `Content-Type: application/javascript` (not HTML).
4. If still failing: remove old Vercel cache/build and ensure Vercel is using Vite framework + `npm run build` and `dist/` output.



