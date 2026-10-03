# Feature 8 — End day

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [Day plan](../03-day-plan/FEATURE.md) · [Activity actions](../04-activity-actions/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Goal

Let the user **close a day** honestly: lock editing, show a short playful summary of what they did, and softly offer to plan tomorrow — without streaks or guilt.

---

## Where it appears

- **End day** on the Day header (when status is not already `ended`)  
- Soft banner **“End day?”** when all items are done or skipped (optional, not forced)  
- On an ended day: **View summary** · **Re-open to edit** · **Plan tomorrow?**  

---

## Flow

1. User taps **End day**  
2. If any timed item is **running** → **auto-stop** and save duration, then continue  
3. If any items are still `pending` (or otherwise open):  
   - Gentle warn: e.g. “3 still open — end anyway?”  
   - User can cancel or confirm  
4. On confirm → day `status = ended`; Start / Done / +1 / Skip / drag locked  
5. Show **summary** (sheet or screen):  
   - Done count · skipped count · left open count  
   - Timed: name + duration (e.g. Gym 1h 12m)  
   - Count habits: e.g. Water 8/10  
   - Todos done count  
6. CTAs: **Plan tomorrow?** (opens next calendar day) · back to Day · optional link toward Glance later  

---

## Re-open

- **Re-open to edit** → confirm  
- Day becomes editable again  
- Status set to **`in_progress`** (always — no special case back to `planned`)  
- User may **End day** again later  

---

## Rules and edge cases

- Ending does **not** change templates  
- Items still `pending` stay `pending` in data; summary labels them **“left open”** (do not auto-skip)  
- No punishing scores or streaks  
- Summary is light — not full Glance analytics  
- Plan tomorrow is skippable  

---

## Acceptance criteria

- [ ] End day with open items → warn → confirm → status ended + actions locked  
- [ ] Running Gym auto-stops; duration appears in summary  
- [ ] Summary shows done / skipped / left open, timed durations, count progress  
- [ ] Plan tomorrow opens the next calendar day’s Day plan  
- [ ] Re-open confirm → editable + status `in_progress`  
- [ ] Can End day again after re-open  

---

## Out of scope (this feature)

- Deep weekly/monthly analytics (Glance)  
- Auto-skipping incomplete items on end  
- UI mockup images  
- Quotes / decorative end-of-day copy beyond a simple playful summary  
