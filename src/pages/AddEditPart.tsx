import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { db } from '@/db/database';
import { createPart, updatePart, isSkuUnique } from '@/services/inventoryService';
import { createBrand } from '@/services/brandService';
import { createCategory } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Camera, X, Image as ImageIcon } from 'lucide-react';
import type { UnitType } from '@/types';

const partSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  sku: z.string().min(2, 'SKU must be at least 2 characters').max(50),
  brandId: z.string().min(1, 'Please select a brand'),
  categoryId: z.string().min(1, 'Please select a category'),
  unitType: z.enum(['piece', 'set', 'pair', 'box', 'custom']),
  customUnit: z.string().optional(),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  minStockLevel: z.coerce.number().int().min(0),
  buyingPrice: z.coerce.number().min(0, 'Price cannot be negative'),
  sellingPrice: z.coerce.number().min(0, 'Price cannot be negative'),
  location: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

type PartFormValues = z.infer<typeof partSchema>;

export default function AddEditPart() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Load existing part if editing
  const existingPart = useLiveQuery(
    () => id ? db.parts.get(id) : undefined,
    [id]
  );

  // Load brands and categories
  const brands = useLiveQuery(() => db.brands.toArray(), []) ?? [];
  const categories = useLiveQuery(() => db.categories.toArray(), []) ?? [];

  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: '',
      sku: '',
      brandId: '',
      categoryId: '',
      unitType: 'piece',
      customUnit: '',
      quantity: 0,
      minStockLevel: 5,
      buyingPrice: 0,
      sellingPrice: 0,
      location: '',
      notes: '',
    },
  });

  // Update form when existing part loads
  useLiveQuery(() => {
    if (existingPart) {
      form.reset({
        name: existingPart.name,
        sku: existingPart.sku,
        brandId: existingPart.brandId,
        categoryId: existingPart.categoryId,
        unitType: existingPart.unitType,
        customUnit: existingPart.customUnit || '',
        quantity: existingPart.quantity,
        minStockLevel: existingPart.minStockLevel,
        buyingPrice: existingPart.buyingPrice,
        sellingPrice: existingPart.sellingPrice,
        location: existingPart.location || '',
        notes: existingPart.notes || '',
      });
      setImages(existingPart.images || []);
    }
  }, [existingPart]);

  const onSubmit = async (data: PartFormValues) => {
    setIsSubmitting(true);
    try {
      // Check SKU uniqueness
      const skuUnique = await isSkuUnique(data.sku, id);
      if (!skuUnique) {
        form.setError('sku', { message: 'This SKU already exists' });
        setIsSubmitting(false);
        return;
      }

      const partData = {
        name: data.name,
        sku: data.sku,
        brandId: data.brandId,
        categoryId: data.categoryId,
        unitType: data.unitType,
        customUnit: data.customUnit,
        quantity: data.quantity,
        minStockLevel: data.minStockLevel,
        buyingPrice: data.buyingPrice,
        sellingPrice: data.sellingPrice,
        location: data.location || '',
        notes: data.notes || '',
        images,
      };

      if (isEditing && id) {
        await updatePart(id, partData);
        toast.success('Part updated successfully');
      } else {
        await createPart(partData);
        toast.success('Part added successfully');
      }

      navigate('/inventory');
    } catch (error) {
      console.error('Failed to save part:', error);
      toast.error('Failed to save part');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    try {
      const brand = await createBrand(newBrandName);
      form.setValue('brandId', brand.id);
      setNewBrandName('');
      setShowAddBrand(false);
      toast.success('Brand added');
    } catch (error) {
      toast.error('Failed to add brand');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const category = await createCategory(newCategoryName);
      form.setValue('categoryId', category.id);
      setNewCategoryName('');
      setShowAddCategory(false);
      toast.success('Category added');
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const watchUnitType = form.watch('unitType');

  return (
    <AppLayout hideNav>
      <Header 
        title={isEditing ? 'Edit Part' : 'Add Part'} 
        showBack 
      />

      <div className="p-4 pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Images */}
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-3">Images (max 5)</p>
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, index) => (
                    <div key={index} className="relative h-16 w-16">
                      <img 
                        src={img} 
                        alt={`Part ${index + 1}`}
                        className="h-full w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="h-16 w-16 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground mt-1">Add</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        multiple
                        className="hidden"
                        onChange={handleImageCapture}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Brake Pad Set" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BP-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand *</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map(brand => (
                                <SelectItem key={brand.id} value={brand.id}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => setShowAddBrand(true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => setShowAddCategory(true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stock & Pricing */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="piece">Piece</SelectItem>
                            <SelectItem value="set">Set</SelectItem>
                            <SelectItem value="pair">Pair</SelectItem>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchUnitType === 'custom' && (
                    <FormField
                      control={form.control}
                      name="customUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Unit</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Dozen" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Stock Level</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="buyingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buying Price (Rs)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price (Rs)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Shelf A3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? 'Update Part' : 'Add Part'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Add Brand Dialog */}
      <Dialog open={showAddBrand} onOpenChange={setShowAddBrand}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Brand name"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBrand(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand}>Add Brand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
