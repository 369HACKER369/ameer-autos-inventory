// Color Picker Component
// HSL-based color picker with preview and validation

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { parseHSL, hslToHex, hexToHsl, getContrastRatio } from '@/utils/themeUtils';
import { Check, AlertTriangle, RotateCcw } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  contrastWith?: string;
  defaultValue?: string;
  disabled?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  label,
  description,
  contrastWith,
  defaultValue,
  disabled = false,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hsl, setHsl] = useState({ h: 0, s: 50, l: 50 });
  const [hexInput, setHexInput] = useState('');

  // Parse current value
  useEffect(() => {
    const parsed = parseHSL(value);
    if (parsed) {
      setHsl(parsed);
      setHexInput(hslToHex(value));
    }
  }, [value]);

  // Update color from HSL sliders
  const updateFromHSL = useCallback((newHsl: typeof hsl) => {
    setHsl(newHsl);
    const hslStr = `${newHsl.h} ${newHsl.s}% ${newHsl.l}%`;
    onChange(hslStr);
    setHexInput(hslToHex(hslStr));
  }, [onChange]);

  // Update color from hex input
  const handleHexChange = (hex: string) => {
    setHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const hslStr = hexToHsl(hex);
      onChange(hslStr);
      const parsed = parseHSL(hslStr);
      if (parsed) setHsl(parsed);
    }
  };

  // Calculate contrast
  const contrast = contrastWith ? getContrastRatio(value, contrastWith) : null;

  const currentHex = hslToHex(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {defaultValue && value !== defaultValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultValue)}
            className="h-7 px-2 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            className={cn(
              'w-full h-12 rounded-lg border-2 flex items-center gap-3 px-3 transition-colors',
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:border-primary/50',
              isOpen ? 'border-primary' : 'border-border'
            )}
          >
            <div
              className="h-8 w-8 rounded-md shadow-inner border"
              style={{ background: `hsl(${value})` }}
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-mono">{currentHex}</p>
              <p className="text-xs text-muted-foreground font-mono">
                hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
              </p>
            </div>
            {contrast && (
              <div className={cn(
                'flex items-center gap-1 text-xs px-2 py-1 rounded',
                contrast.aa ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              )}>
                {contrast.aa ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                <span>{contrast.ratio}:1</span>
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            {/* Color preview */}
            <div
              className="h-16 rounded-lg shadow-inner"
              style={{ background: `hsl(${value})` }}
            />

            {/* Hue slider */}
            <div className="space-y-2">
              <Label className="text-xs">Hue ({hsl.h}°)</Label>
              <div
                className="h-3 rounded-full"
                style={{
                  background: 'linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))',
                }}
              >
                <Slider
                  value={[hsl.h]}
                  onValueChange={([h]) => updateFromHSL({ ...hsl, h })}
                  min={0}
                  max={360}
                  step={1}
                  className="[&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2"
                />
              </div>
            </div>

            {/* Saturation slider */}
            <div className="space-y-2">
              <Label className="text-xs">Saturation ({hsl.s}%)</Label>
              <div
                className="h-3 rounded-full"
                style={{
                  background: `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`,
                }}
              >
                <Slider
                  value={[hsl.s]}
                  onValueChange={([s]) => updateFromHSL({ ...hsl, s })}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            {/* Lightness slider */}
            <div className="space-y-2">
              <Label className="text-xs">Lightness ({hsl.l}%)</Label>
              <div
                className="h-3 rounded-full"
                style={{
                  background: `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`,
                }}
              >
                <Slider
                  value={[hsl.l]}
                  onValueChange={([l]) => updateFromHSL({ ...hsl, l })}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            {/* Hex input */}
            <div className="space-y-2">
              <Label className="text-xs">Hex Color</Label>
              <Input
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#000000"
                className="font-mono text-sm"
              />
            </div>

            {/* Contrast warning */}
            {contrast && !contrast.aa && (
              <div className="flex items-start gap-2 p-2 rounded bg-warning/10 text-warning text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Low contrast ({contrast.ratio}:1)</p>
                  <p className="text-warning/80">WCAG AA requires at least 4.5:1</p>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
