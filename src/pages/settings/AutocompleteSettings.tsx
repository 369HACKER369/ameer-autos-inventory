import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllEntries, removeEntry, clearAllEntries, type AutocompleteField } from '@/services/autocompleteService';
import type { AutocompleteEntry } from '@/types';
import { Trash2, User, Phone, Tag, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const FIELD_CONFIG: { field: AutocompleteField; label: string; icon: React.ElementType }[] = [
  { field: 'customerName', label: 'Customer Names', icon: User },
  { field: 'customerPhone', label: 'Phone Numbers', icon: Phone },
  { field: 'brand', label: 'Brands', icon: Tag },
  { field: 'category', label: 'Categories', icon: FolderOpen },
];

export default function AutocompleteSettings() {
  const [entries, setEntries] = useState<Record<AutocompleteField, AutocompleteEntry[]>>({
    customerName: [],
    customerPhone: [],
    brand: [],
    category: [],
  });

  const loadAll = async () => {
    const results = await Promise.all(
      FIELD_CONFIG.map(async ({ field }) => ({
        field,
        data: await getAllEntries(field),
      }))
    );
    const next: Record<string, AutocompleteEntry[]> = {};
    results.forEach(r => (next[r.field] = r.data));
    setEntries(next as any);
  };

  useEffect(() => { loadAll(); }, []);

  const handleRemove = async (id: string) => {
    await removeEntry(id);
    await loadAll();
    toast.success('Entry removed');
  };

  const handleClearAll = async (field: AutocompleteField, label: string) => {
    await clearAllEntries(field);
    await loadAll();
    toast.success(`All ${label.toLowerCase()} cleared`);
  };

  const totalEntries = Object.values(entries).reduce((s, arr) => s + arr.length, 0);

  return (
    <AppLayout>
      <Header title="Smart Autocomplete" showBack />
      <div className="p-4 space-y-4 pb-24">
        <p className="text-sm text-muted-foreground">
          Manage saved autocomplete suggestions. {totalEntries} total entries.
        </p>

        {FIELD_CONFIG.map(({ field, label, icon: Icon }) => {
          const items = entries[field];
          return (
            <Card key={field} className="bg-card">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                    <Badge variant="secondary" className="text-[10px] h-5">{items.length}</Badge>
                  </CardTitle>
                  {items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={() => handleClearAll(field, label)}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-2">
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-3">No saved entries</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(item => (
                      <Badge
                        key={item.id}
                        variant="outline"
                        className="gap-1 pr-1 text-xs font-normal"
                      >
                        {item.value}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
