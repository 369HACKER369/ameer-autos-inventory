

## Plan: Rebuild Invoice to Match Reference Design

The reference design is fundamentally different from the current implementation. It uses a **clean, minimal, white-background** aesthetic -- not the dark header/orange banner style currently in place. Both the preview template and PDF generator need a complete rewrite.

### Reference Design Analysis

Key characteristics from the uploaded HTML:
- **White/light background** throughout (no dark header)
- **Circular logo** with olive/gold double-ring border on white background
- **Shop name** in dark olive/gold color, tagline in gray -- all on white
- **"Invoice From"** is a simple text line, not a colored banner
- **Invoice To block** has a thin gray border, minimal styling
- **Table** has gray header text (not white-on-dark), light row separators
- **Grand Total** is bold text with a line separator, not a split-color bar
- **Terms & Payment** side by side, payment box has dashed border
- **Footer** is light gray background with simple centered text columns (no icon pills, no dark bar)

### Changes Required

**File 1: `src/components/bill/BillPreviewTemplate.tsx`** -- Full rewrite

- Remove dark header, orange banner, dark footer
- White background header with circular bordered logo + olive/gold shop name
- Simple "Invoice From : SHOP NAME" text line below header
- Bordered "Invoice To" block with thin gray border
- Clean table with gray column headers (no dark background)
- Right-aligned subtotal/discount/grand total as simple text
- Terms & Payment section with dashed border on payment box
- Light gray footer with 3 text columns (address, phone, website) -- no icon pills

**File 2: `src/utils/billPdf.ts`** -- Full rewrite to match

- White header area with circular logo (gold border drawn via `doc.circle`)
- Shop name in dark olive color, tagline in gray
- Simple text "Invoice From" line
- Bordered invoice-to block
- Table via `autoTable` with light gray header (not dark fill)
- Text-based totals (no colored bars)
- Terms & payment sections matching preview
- Light gray footer strip with plain text columns
- Remove all geometric icon drawing functions (broken symbols fix)

### Color Palette (from reference)

```text
Logo border:    #C5A22E (olive gold)
Shop name:      #3D3D1B (dark olive)
Tagline:        #888888 (medium gray)
Table header:   #888888 (gray text, white bg)
Borders:        #E0E0E0 (light gray)
Footer bg:      #F0F0F0 (very light gray)
Footer text:    #999999
Grand total:    #3D3D1B (dark olive, bold)
```

### Technical Notes

- PDF icons replaced with NO icons -- the reference footer has plain text only
- Logo in PDF uses `doc.addImage()` with `parseLogoDataUrl()` inside a clipped circle
- Terms/Payment sections always rendered when enabled (current bug where they sometimes don't appear in PDF is fixed by ensuring the y-position calculation accounts for them before the footer)

