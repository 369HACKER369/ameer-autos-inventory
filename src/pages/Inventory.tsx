import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { db } from '@/db/database';
import { formatCurrency } from '@/utils/currency';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Package, 
  Grid3X3, 
  List,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StockStatus, ViewMode, Part } from '@/types';

export default function Inventory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<StockStatus>(
    (searchParams.get('status') as StockStatus) || 'all'
  );

  // Live queries
  const parts = useLiveQuery(() => db.parts.toArray(), []) ?? [];
  const brands = useLiveQuery(() => db.brands.toArray(), []) ?? [];
  const categories = useLiveQuery(() => db.categories.toArray(), []) ?? [];

  // Filter and search parts
  const filteredParts = useMemo(() => {
    let result = [...parts];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      );
    }

    // Brand filter
    if (brandFilter && brandFilter !== 'all') {
      result = result.filter(p => p.brandId === brandFilter);
    }

    // Category filter
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(p => p.categoryId === categoryFilter);
    }

    // Stock status filter
    if (stockFilter !== 'all') {
      result = result.filter(p => {
        switch (stockFilter) {
          case 'in-stock':
            return p.quantity > p.minStockLevel;
          case 'low-stock':
            return p.quantity > 0 && p.quantity <= p.minStockLevel;
          case 'out-of-stock':
            return p.quantity === 0;
          default:
            return true;
        }
      });
    }

    // Sort by name
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [parts, search, brandFilter, categoryFilter, stockFilter]);

  const hasActiveFilters = brandFilter !== 'all' || categoryFilter !== 'all' || stockFilter !== 'all';

  const clearFilters = () => {
    setBrandFilter('all');
    setCategoryFilter('all');
    setStockFilter('all');
    setSearchParams({});
  };

  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || 'Unknown';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getStockBadge = (part: Part) => {
    if (part.quantity === 0) {
      return <Badge variant="destructive" className="text-[10px]">Out of Stock</Badge>;
    }
    if (part.quantity <= part.minStockLevel) {
      return <Badge className="bg-warning text-warning-foreground text-[10px]">Low Stock</Badge>;
    }
    return null;
  };

  return (
    <AppLayout>
      <Header 
        title="Inventory" 
        subtitle={`${filteredParts.length} items`}
        rightAction={
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? (
                <Grid3X3 className="h-5 w-5" />
              ) : (
                <List className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-9 w-9', hasActiveFilters && 'text-primary')}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        }
      />

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="bg-card">
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filters</span>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={clearFilters}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockStatus)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parts List/Grid */}
        {filteredParts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {parts.length === 0 ? 'No parts yet' : 'No parts match your search'}
            </p>
            {parts.length === 0 && (
              <Button
                className="mt-4"
                onClick={() => navigate('/inventory/add')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Part
              </Button>
            )}
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-2">
            {filteredParts.map((part) => (
              <Card 
                key={part.id}
                className="bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/inventory/${part.id}`)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    {/* Image placeholder */}
                    <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center shrink-0">
                      {part.images?.[0] ? (
                        <img 
                          src={part.images[0]} 
                          alt={part.name}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground/50" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{part.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {part.sku}</p>
                        </div>
                        {getStockBadge(part)}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{getBrandName(part.brandId)}</span>
                          <span>•</span>
                          <span>Qty: {part.quantity}</span>
                        </div>
                        <p className="font-semibold text-primary">
                          {formatCurrency(part.sellingPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredParts.map((part) => (
              <Card 
                key={part.id}
                className="bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/inventory/${part.id}`)}
              >
                <CardContent className="p-3">
                  {/* Image */}
                  <div className="aspect-square rounded-md bg-muted flex items-center justify-center mb-2">
                    {part.images?.[0] ? (
                      <img 
                        src={part.images[0]} 
                        alt={part.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-sm truncate">{part.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {part.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'text-xs',
                        part.quantity === 0 && 'text-destructive',
                        part.quantity > 0 && part.quantity <= part.minStockLevel && 'text-warning'
                      )}>
                        Qty: {part.quantity}
                      </span>
                      <span className="font-semibold text-sm text-primary">
                        {formatCurrency(part.sellingPrice)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-40"
        onClick={() => navigate('/inventory/add')}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Part</span>
      </Button>
    </AppLayout>
  );
}
