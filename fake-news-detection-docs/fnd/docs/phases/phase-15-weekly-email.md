# Phase 15: Weekly email digest (optional — cut first if short on time)

**Goal:** registered users get a weekly email listing the most-checked articles.
**Prerequisites:** Phases 10–13 done (14 not required).
**Only start this if Phases 10–13 are solid.** A half-built fact-check feature
graded worse than a missing email feature.

## Tasks
1. Enable 2FA on the sending Gmail account, generate an **App Password**
   (Google Account → Security → App passwords), put it in `.env` as
   `SMTP_APP_PASSWORD` alongside `SMTP_USER`.
2. `server/src/services/mailer.js`:
   ```js
   const nodemailer = require("nodemailer");
   const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: { user: config.smtpUser, pass: config.smtpAppPassword },
   });
   async function sendDigest(to, items) {
     const html = `<h2>This week's most-checked articles</h2><ol>${
       items.map(i => `<li>${i.textPreview}… — <b>${i.nlpLabel}</b>${i.factCheck ? ` (fact-check: ${i.factCheck.verdict})` : ""}, checked ${i.checkCount} times</li>`).join("")
     }</ol>`;
     return transporter.sendMail({ from: config.smtpUser, to, subject: "Weekly Fake News Digest", html });
   }
   module.exports = { sendDigest };
   ```
3. `server/src/jobs/weeklyDigest.js`:
   ```js
   const cron = require("node-cron");
   async function runDigest() {
     const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
     const top = await Check.find({ lastCheckedAt: { $gte: since } }).sort({ checkCount: -1 }).limit(5);
     if (top.length === 0) return;
     const users = await User.find({ emailOptIn: true });
     for (const user of users) {
       try { await sendDigest(user.email, top); }
       catch (err) { console.error(`Digest failed for ${user.email}:`, err.message); }
     }
   }
   function schedule() { cron.schedule("0 9 * * 1", runDigest); }
   module.exports = { schedule, runDigest };
   ```
   Call `schedule()` once from `server.js` on startup.
4. Add a **manual trigger for testing**: `POST /api/admin/run-digest` (no real
   admin auth needed for a college project — just don't expose it publicly;
   gate it behind `requireAuth` at minimum, or remove before any public demo).
5. Add an `emailOptIn` toggle somewhere in the UI (even a simple checkbox on a
   basic profile/settings page) so users can opt out.

## Files
`server/src/{services/mailer.js, jobs/weeklyDigest.js}`, a route to trigger it manually, a small opt-out UI control.

## Definition of Done
- [ ] Calling the manual trigger route sends a real email to a test account with real top-checked articles
- [ ] A user with `emailOptIn: false` does not receive it
- [ ] One failed send (bad email) doesn't stop the others from sending
- [ ] The cron schedule is set but you don't need to wait a week to prove it works — the manual trigger is the actual verification

## Pitfalls
- Gmail will silently reject or flag sends without an App Password — a regular password will not work with 2FA on.
- Don't commit the App Password. It's already in `.env`, which is gitignored.

## Kickoff prompt
> Read docs/TWO_DAY_PLAN.md, docs/ARCHITECTURE_EXT.md and docs/phases/phase-15-weekly-email.md. Do only Phase 15. Confirm Phases 10-13 are done before starting.
