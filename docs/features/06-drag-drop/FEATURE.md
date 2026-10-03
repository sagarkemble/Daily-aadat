# Feature 6 — Drag and drop

**Status:** Locked for v1  
**Product:** Daily Aadat  
**Related:** [Day plan](../03-day-plan/FEATURE.md) · [Todos](../05-todos/FEATURE.md) · [Templates](../02-templates/FEATURE.md)

No UI mockups for this feature (spec only).

---

## Goal

Make reordering the day **easy and interactive**: drag activities and todos within a slot, across the five slots, and between slots and the **Todos** catch-all — so the day reads as one flexible timeline.

---

## Where it appears

1. **Day plan — Edit day mode** — drag to rearrange; live Done / Start / +1 stay on the default view  
2. **Template editor** — same drag behaviour for template items (no todos on templates)  

Not on Activities tab, Week, or Month grids.

---

## What can be dragged

| Item | Day plan | Template editor |
|------|----------|-----------------|
| Activity row | Yes | Yes |
| Todo row | Yes | N/A |

---

## Behaviours

### Reorder within a slot
- Drag up/down inside Early morning / Morning / Afternoon / Evening / Night  
- Updates `order` among siblings  

### Move across slots
- Drag an activity or todo from one slot onto another slot section  
- Lands at drop position (end of slot if dropped on section header)  

### Todos ↔ slots
- Drag **unslotted** todo into a slot → gets that `slot`  
- Drag todo from a slot into **Todos** section → `unslotted`  
- Drag activity into Todos section → **not allowed** (activities always belong in a slot; show no-drop / snap back)  

### Visual feedback
- Drag ghost / lifted row  
- Valid drop targets highlighted (slots + Todos for todos only)  
- Invalid target: snap back  

---

## Rules and edge cases

- **Ended day:** drag disabled until re-open  
- **Day live view:** no drag handles; enter **Edit day** first  
- **Running timed item:** may still be reordered (slot is organizational only); timer keeps running  
- Dropping onto a slot that already has the **same activity id** once: reject (once per slot); type does not allow a second Gym in the same slot  
- Same activity in **different** slots remains allowed via drag  
- Keyboard/accessibility: v1 pointer drag is enough; basic move via menu **not required** in v1  
- Touch (PWA): long-press or handle to drag so vertical scroll still works  
- After drop, persist new `slot` + `order` immediately  

---

## Acceptance criteria

- [ ] Reorder two activities within Afternoon  
- [ ] Drag Gym from Early morning to Morning  
- [ ] Drag unslotted todo into Afternoon; drag back to Todos  
- [ ] Cannot drop an activity into the Todos section  
- [ ] Cannot drop a duplicate of the same activity into a slot that already has it  
- [ ] Drag disabled on ended day until re-open  
- [ ] Same drag works in template editor for activities  

---

## Out of scope (this feature)

- Dragging items between **different dates** (use Week/Month + add instead)  
- Drag from Activities library onto the day (picker tap-to-add remains)  
- Multi-select drag  
- UI mockup images  
