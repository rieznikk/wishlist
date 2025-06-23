# 🧩 Pull Request Summary

<!-- Describe WHAT you’ve changed and WHY. Keep it concise. -->
<!-- Example: Refactored `UserMenu.vue` and added Supabase session refresh logic on mount. -->

---

# 🧪 How to Test

<!-- Write clear instructions so reviewers can easily test this PR. -->
1. Run `yarn dev`
2. Navigate to `/account`
3. Verify that user session is refreshed silently if expired
4. Run Supabase local via `supabase start` *(if needed)*

---

# ✅ Checklist

- [ ] Code is self-reviewed and tested locally
- [ ] No console warnings or TypeScript errors
- [ ] UI changes were manually verified across major screen sizes
- [ ] Supabase rules (RLS, policies) updated if needed
- [ ] New composables/stores are documented
- [ ] Tests added or updated
- [ ] Relevant types/interfaces are updated
- [ ] No sensitive data or secrets are committed
- [ ] Ticket is linked and status updated (if applicable)

---

# 🧠 Notes for Reviewers

<!-- Optional: Anything specific you want reviewers to look at? -->
<!-- Example: Watch for potential edge cases with token expiration logic -->

---

# 📸 UI / Screenshots (if applicable)

<!-- Paste screenshots, or use a tool like Loom to explain complex behavior -->

---

# 📦 Deployment Notes

<!-- Example: -->
- Run `supabase db push` after deployment
- Add `SUPABASE_ANON_KEY` to `.env`
