import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { db } from '@/db/database';
import { recordSale } from '@/services/salesService';
import { formatCurrency, calculateProfit } from '@/utils/currency';
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
import { toast } from 'sonner';
import { Loader2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const saleSchema = z.object({
  partId: z.string().min(1, 'Please select a part'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0, 'Price cannot be negative'),
  customerName: z.string().max(100).optional(),
  customerPhone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
});

type SaleFormValues = z.infer<typeof saleSchema>;

export default function RecordSale() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPart, setSelectedPart] = useState<{
    id: string;
    name: string;
    sku: string;
    quantity: number;
    sellingPrice: number;
    buyingPrice: number;
  } | null>(null);

  // Load parts with stock
  const parts = useLiveQuery(
    () => db.parts.filter(p => p.quantity > 0).toArray(),
    []
  ) ?? [];

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      partId: '',
      quantity: 1,
      unitPrice: 0,
      customerName: '',
      customerPhone: '',
      notes: '',
    },
  });

  const watchQuantity = form.watch('quantity');
  const watchUnitPrice = form.watch('unitPrice');

  const handlePartChange = (partId: string) => {
    const part = parts.find(p => p.id === partId);
    if (part) {
      setSelectedPart({
        id: part.id,
        name: part.name,
        sku: part.sku,
        quantity: part.quantity,
        sellingPrice: part.sellingPrice,
        buyingPrice: part.buyingPrice,
      });
      form.setValue('unitPrice', part.sellingPrice);
    }
  };

  const onSubmit = async (data: SaleFormValues) => {
    if (!selectedPart) return;
    
    if (data.quantity > selectedPart.quantity) {
      form.setError('quantity', { 
        message: `Only ${selectedPart.quantity} available in stock` 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const saleData = {
        partId: data.partId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        notes: data.notes,
      };
      const result = await recordSale(saleData);
      
      if ('error' in result) {
        toast.error(result.error);
        return;
      }
      
      toast.success('Sale recorded successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to record sale:', error);
      toast.error('Failed to record sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = watchQuantity * watchUnitPrice;
  const profit = selectedPart 
    ? calculateProfit(selectedPart.buyingPrice, watchUnitPrice, watchQuantity)
    : 0;

  return (
    <AppLayout hideNav>
      <Header title="Record Sale" showBack />

      <div className="p-4 pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Part Selection */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="partId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Part *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handlePartChange(value);
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a part" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parts.map(part => (
                            <SelectItem key={part.id} value={part.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{part.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({part.quantity} in stock)
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedPart && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-background flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{selectedPart.name}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {selectedPart.sku} • Stock: {selectedPart.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-primary">
                        {formatCurrency(selectedPart.sellingPrice)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quantity & Price */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max={selectedPart?.quantity || 999}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price (Rs) *</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sale Summary */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Profit</span>
                    <span className={cn(
                      profit >= 0 ? 'text-primary' : 'text-destructive'
                    )}>
                      {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info (Optional) */}
            <Card className="bg-card">
              <CardContent className="p-4 space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Customer Info (Optional)
                </p>

                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="03XX XXXXXXX" 
                          {...field} 
                        />
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
                          placeholder="Sale notes..." 
                          className="min-h-[60px]"
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
                disabled={isSubmitting || !selectedPart}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Record Sale • {formatCurrency(totalAmount)}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
