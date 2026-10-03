# Feature 11 — Splash / returning user

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [Onboarding](../10-onboarding/FEATURE.md) · [Day plan](../03-day-plan/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Goal

Brand entry point and routing: first-time users go to **Onboarding**; returning users go to **Today**.

---

## Behaviour

1. Show **Daily Aadat** splash (brief or near-instant — no long animation required)  
2. If `onboardingComplete` is false / unset → **Onboarding**  
3. If `onboardingComplete` is true → **Today** (Day home)  

### Onboarding complete flag
- Set `onboardingComplete = true` when the user **finishes** onboarding **or Skip**s it  
- Prevents splash → onboarding loop forever  

### Not in v1 splash
- Account login / signup (local-first or later tech)  
- Required PWA install prompt on splash (optional later via browser)  

---

## Acceptance criteria

- [ ] Fresh install → splash → onboarding  
- [ ] After finish or skip onboarding → next open → splash → Today  
- [ ] No infinite onboarding loop after skip  

---

## Out of scope (v1)

- Auth walls  
- Marketing carousel  
- Forced install prompts  
- UI mockup images  
