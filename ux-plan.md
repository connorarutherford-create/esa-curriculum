# ESA Curriculum Builder — Planned Implementations Log

## Session: June 30, 2026

---

### UX Research Phase

**Status:** In progress

**Planned changes (from initial UX analysis):**
1. Labeled progress steps (Receipt · Student · Scope · Materials · Lessons · Justification)
2. localStorage save/resume for partial form state
3. Relocate Pro upsell to non-intrusive position
4. More descriptive navigation button labels
5. Merge optional receipt into Step 2 as collapsible section (remove as standalone step 1)
6. Visual anchors/breaks to break up dark theme fatigue

**Pending research questions:**
- What's the ideal step count for ESA parents specifically?
- Should steps be reordered? (Receipt isn't the right step 1)
- Mobile-first concerns
- Accessibility requirements for older parents
- Form abandonment patterns in similar tools

---

## Research Findings

### From NN/G + Andrew Coyle (Wizard UX Research)

**Wizard is the right pattern** — infrequent, anxiety-inducing, non-technical users. Don't abandon it.

**Key recommendations that apply:**
1. Communicate clear mental model of the process — show step list, not just dots
2. Enforce sequential order (already doing this ✓)
3. Use descriptive button labels — replace generic "Next"/"Continue" with action labels ("Review & Justify")
4. Allow exit and save state — localStorage persistence is critical
5. Steps should be self-sufficient — don't require info from elsewhere without providing access
6. Reuse previous selections as defaults — remember last student/course
7. Keep under 10 steps (6 is fine, but could be consolidated)

### From Old Laptop (hermes3:8b)

**Step flow recommendations:**
1. Simplify navigation — use clear, concise step labels with progress indicator showing current + remaining
2. Offer reassurance — trust elements, encouraging messaging, help section
3. Improve form field design — clear fonts, proper labels, hints/examples

**Antipatterns to avoid:**
- Hidden required fields causing validation errors
- Inconsistent labels and error messages
- Clunky navigation between steps
- Mobile zoom issues breaking fields
- Poor contrast in dark mode
- No progress indicator or estimated time remaining
- No "Save & Continue Later" option

### Planned Implementation Order (Priority)

1. **Labeled progress steps** — Replace 6 unlabeled dots with text labels under each dot (Receipt · Student · Scope · Materials · Lessons · Justification). Low effort, high impact.

2. **localStorage save/resume** — Auto-save all form fields on every change. On page load, restore saved state. Add visual indicator ("Draft saved"). Medium effort, highest impact for anxious parents.

3. **Descriptive button labels** — Replace generic "Continue" with step-specific labels. Low effort.

4. **Restructure step flow** — Move optional Receipt into Step 2 as collapsible toggle. Step 1 becomes "Student & Course" — the essential start. Medium effort.

5. **Move Pro upsell** — Reduce permanent purple section to a subtle badge; full upsell only appears on AI button click. Low effort.

6. **Visual anchors** — Subtle section color anchors to break up dark theme fatigue. Low effort.

### Old Laptop Research (hermes3:8b, single thread)

**Step flow recommendation:** Move receipt to the end (before output) or merge into attachments step. Don't lead with an optional step — parents who skip feel disengaged. Start with essential info.
---
