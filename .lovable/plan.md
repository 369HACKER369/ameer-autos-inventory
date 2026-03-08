

# Bill Footer Redesign — Match Reference Image

## Reference Analysis
The image shows a distinct footer design with:
1. A **red banner bar** with rounded corners floating horizontally across the top of the teal footer area — icons sit centered on this bar
2. Three icon circles in graduating red shades (bright red → dark red → bright red) positioned on the banner
3. Text below each icon on the dark teal background
4. A thin **red horizontal line** separating the content area from the footer

## Current vs Required

**Current**: Icons float individually on a flat teal background — no connecting bar.

**Required**: A curved/rounded red bar connects all three icon circles, creating a cohesive visual element that bridges the content area and footer.

## Changes

### 1. `src/components/bill/BillPreviewTemplate.tsx` — Footer section (lines 284–336)

Replace the footer with:
- A thin red line across the full width as a separator
- Dark teal background below
- A **red rounded banner bar** positioned at the top, overlapping the boundary — using shaded red sections (3 segments with slightly different red tones: left bright, center darker, right bright)
- Icon circles centered on the banner
- Contact text below on the teal background

### 2. `src/utils/billPdf.ts` — Footer drawing (lines ~225–270)

Replicate the same visual in PDF:
- Draw a thin red line separator above the footer
- Draw a rounded red bar across the top of the footer area
- Three red circles on the bar with white icons
- Text below on teal background

### Files Modified
| File | Change |
|------|--------|
| `src/components/bill/BillPreviewTemplate.tsx` | Redesign footer to match reference |
| `src/utils/billPdf.ts` | Redesign PDF footer to match reference |

