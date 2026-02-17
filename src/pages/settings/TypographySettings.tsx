import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Type, Maximize, LayoutGrid, ChevronDown } from 'lucide-react';
import { useTypography } from '@/contexts/TypographyContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const SCALE_LABELS: Record<number, string> = { 0.85: '85%', 1: '100%', 1.15: '115%', 1.3: '130%' };
const SCALE_STEPS = [0.85, 1, 1.15, 1.3];

function ScaleSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const pct = Math.round(value * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm">{label}</Label>
        <span className="text-xs text-muted-foreground font-mono">{pct}%</span>
      </div>
      <Slider
        min={85}
        max={130}
        step={5}
        value={[pct]}
        onValueChange={([v]) => onChange(v / 100)}
      />
    </div>
  );
}

const PAGE_NAMES = ['dashboard', 'inventory', 'reports', 'settings'] as const;

export default function TypographySettings() {
  const typo = useTypography();
  const [openPages, setOpenPages] = useState<Record<string, boolean>>({});

  if (!typo) {
    return (
      <AppLayout>
        <Header title="Typography & Icons" showBack />
        <div className="p-4 text-muted-foreground text-center">Loading...</div>
      </AppLayout>
    );
  }

  const { scale, setGlobalScale, setIconSize, setPageScale, setSectionScale } = typo;

  return (
    <AppLayout>
      <Header title="Typography & Icons" showBack />
      <div className="p-4 space-y-4 pb-24">
        {/* Global Text Size */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              Global Text Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScaleSlider label="Scale all text" value={scale.global} onChange={setGlobalScale} />
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              {SCALE_STEPS.map(s => <span key={s}>{SCALE_LABELS[s]}</span>)}
            </div>
          </CardContent>
        </Card>

        {/* Icon Size */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Maximize className="h-5 w-5 text-primary" />
              Icon Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              type="single"
              value={scale.iconSize}
              onValueChange={(v) => v && setIconSize(v as any)}
              className="justify-start"
            >
              <ToggleGroupItem value="small" className="text-xs">Small</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="text-xs">Medium</ToggleGroupItem>
              <ToggleGroupItem value="large" className="text-xs">Large</ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground mt-2">
              Applies to dashboard cards, activity icons, inventory & nav icons.
            </p>
          </CardContent>
        </Card>

        {/* Section-level controls */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              Section Text Sizes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScaleSlider label="Card Main Value" value={scale.sections.cardMainValue} onChange={(v) => setSectionScale('cardMainValue', v)} />
            <ScaleSlider label="Card Label" value={scale.sections.cardLabel} onChange={(v) => setSectionScale('cardLabel', v)} />
            <ScaleSlider label="Chart Legend" value={scale.sections.chartLegend} onChange={(v) => setSectionScale('chartLegend', v)} />
          </CardContent>
        </Card>

        {/* Per-page controls */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              Per-Page Customization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PAGE_NAMES.map(page => (
              <Collapsible
                key={page}
                open={openPages[page]}
                onOpenChange={(o) => setOpenPages(p => ({ ...p, [page]: o }))}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium capitalize">{page}</span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openPages[page] && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-3 pr-1 pb-3 space-y-3">
                  <ScaleSlider label="Title size" value={scale.pages[page].title} onChange={(v) => setPageScale(page, 'title', v)} />
                  <ScaleSlider label="Body size" value={scale.pages[page].body} onChange={(v) => setPageScale(page, 'body', v)} />
                  <ScaleSlider label="Card value size" value={scale.pages[page].cardValue} onChange={(v) => setPageScale(page, 'cardValue', v)} />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
