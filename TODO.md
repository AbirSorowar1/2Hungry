# TODO

## Plan (SPA fix for Vercel MIME type error)
1. ✅ Update `vercel.json` to avoid rewriting JS/CSS asset requests to `/`.
2. ⏳ Redeploy to Vercel.
3. ⏳ Verify in DevTools → Network that module JS bundle returns `200` with `Content-Type: application/javascript` (not HTML).


