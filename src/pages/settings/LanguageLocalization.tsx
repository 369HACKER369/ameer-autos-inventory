import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getSetting, updateSetting } from '@/db/database';
import { toast } from 'sonner';
import { Globe, Calendar, Banknote, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ur', label: 'اردو (Urdu)' },
];

const DATE_FORMATS = [
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (31/12/2024)' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (12/31/2024)' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2024-12-31)' },
  { value: 'dd-MMM-yyyy', label: 'DD-MMM-YYYY (31-Dec-2024)' },
];

const CURRENCY_FORMATS = [
  { value: 'Rs', label: 'Rs (Rs 1,000)' },
  { value: '₨', label: '₨ (₨ 1,000)' },
  { value: 'PKR', label: 'PKR (PKR 1,000)' },
];

export default function LanguageLocalization() {
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('dd/MM/yyyy');
  const [currencyFormat, setCurrencyFormat] = useState('Rs');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedLanguage = await getSetting<string>('language');
        const savedDateFormat = await getSetting<string>('dateFormat');
        const savedCurrencyFormat = await getSetting<string>('currencyFormat');
        
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedDateFormat) setDateFormat(savedDateFormat);
        if (savedCurrencyFormat) setCurrencyFormat(savedCurrencyFormat);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateSetting('language', language),
        updateSetting('dateFormat', dateFormat),
        updateSetting('currencyFormat', currencyFormat),
      ]);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Header title="Language & Localization" showBack />
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Language & Localization" showBack />

      <div className="p-4 space-y-4">
        {/* Language Selection */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              Select your preferred language for the app interface
            </p>
          </CardContent>
        </Card>

        {/* Date Format */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Date Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              Choose how dates are displayed throughout the app
            </p>
          </CardContent>
        </Card>

        {/* Currency Format */}
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Currency Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={currencyFormat} onValueChange={setCurrencyFormat}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency format" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              Pakistan Rupee (Rs) is used for all transactions
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Check className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </AppLayout>
  );
}
