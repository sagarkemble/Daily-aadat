# Feature 10 — Onboarding

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [Activities](../01-activities/FEATURE.md) · [Templates](../02-templates/FEATURE.md) · [Day plan](../03-day-plan/FEATURE.md) · [Splash](../11-splash/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Goal

First-run flow that:
1. Asks a few light **About you** questions (optional / skippable)  
2. Builds **at least one template** (usually **Home**)  
3. Lands on **Today**  

Skip is always allowed — empty Today remains usable. More onboarding questions can be **added later while building** without blocking v1.

---

## Steps

### 1. Welcome
- Daily Aadat one-liner: everyday habits, flexible days  

### 2. About you (skip-friendly)
Max ~4 questions; not a gate.

| Question | Input |
|----------|--------|
| What’s your main goal with Daily Aadat? | Select (up to 2 or single): steady rhythm · habits + todos together · track time (gym/work) · no rigid clocks · Other (text) |
| How did you hear about us? | Single: Friend/family · Social · Search · Blog/newsletter/PH · College · Other (text) |
| Who is this mainly for? | Just me · Me + sharing later |
| What does a typical day look like? (optional) | Mostly at home · College/work out · Mix |

Store on user/profile (or local flags). Skipping About you is OK.

### 3. Pick activities
- Multi-select from Activities library + create custom  

### 4. Sort into slots
- Assign into Early morning → Night  
- Soft guide times shown lightly; **not enforced**  

### 5. Name template
- Default **Home**  
- Note: add College later in Templates  

### 6. Done
- → Today  
- If Today empty → **auto-apply** Home  

**Skip** on any step → Today (no forced template). Skip still marks onboarding as finished so Splash doesn’t loop (see Splash).

---

## Rules

- Playful, short copy — not a long survey or tutorial  
- About you is optional product learning, not required for access  
- Do not create College in onboarding  
- Re-run onboarding: **not in v1** (edit via Templates)  
- Auth not part of this feature  
- **Later while building:** extra questions OK to add  

---

## Acceptance criteria

- [ ] Full flow → About answers saved (if answered) + Home template with slotted activities  
- [ ] Today auto-applies Home when empty  
- [ ] Skip About you; still complete template  
- [ ] Skip all → Today usable; onboarding not shown again on next launch  
- [ ] Custom activity from onboarding appears in Activities library  

---

## Out of scope (v1)

- Long demographic forms  
- Forced College template  
- Re-entering full onboarding from settings  
- UI mockup images  
