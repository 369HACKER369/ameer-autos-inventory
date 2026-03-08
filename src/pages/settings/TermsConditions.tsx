import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FileText, CheckCircle2, Database, AlertTriangle, Copyright, 
  Mail, RefreshCw, Smartphone, Cloud, Receipt, Gavel, Phone, type LucideIcon
} from 'lucide-react';

interface TermSection {
  number: number;
  icon: LucideIcon;
  title: string;
  content: string[];
}

const sections: TermSection[] = [
  {
    number: 1,
    icon: CheckCircle2,
    title: 'Acceptance of Terms',
    content: [
      'By downloading, installing, or using the Inventory Manager App ("the App"), you agree to be bound by these Terms and Conditions.',
      'If you do not agree with any part of these terms, you must discontinue use of the App immediately.',
      'Continued use of the App after any modifications to these terms constitutes acceptance of those changes.',
    ],
  },
  {
    number: 2,
    icon: Smartphone,
    title: 'Use of the App',
    content: [
      'The App is designed as an offline-first inventory and sales management tool for spare parts and hardware businesses in Pakistan.',
      'The App is intended for lawful business use only. You agree not to use it for any unlawful or fraudulent purpose.',
      'You are responsible for maintaining the security of your device, including passwords, screen locks, and physical access.',
      'The App does not require an internet connection for core functionality. All features work fully offline.',
    ],
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: 'User Responsibilities',
    content: [
      'You are responsible for the accuracy of all data entered into the App, including part names, prices, quantities, and sales records.',
      'It is your responsibility to regularly back up your data using the Backup & Restore feature in Settings.',
      'You must ensure your device has sufficient storage space for the App and its local database.',
      'If you enable Google Drive sync, you are responsible for managing your API key and Google Drive storage.',
    ],
  },
  {
    number: 4,
    icon: Database,
    title: 'Data Integrity & Storage',
    content: [
      'All data is stored locally on your device using IndexedDB, a browser-native database technology.',
      'The App implements crash-safe write operations to protect data integrity during unexpected closures.',
      'All deletions use a soft-delete system — items are archived rather than permanently removed, protecting against accidental data loss.',
      'The App does not guarantee data recovery in cases of device damage, factory reset, or browser data clearing without prior backup.',
    ],
  },
  {
    number: 5,
    icon: Copyright,
    title: 'Intellectual Property',
    content: [
      'All design, code, features, branding, and intellectual property of the App are owned by Zeeshan Khan.',
      'You may not copy, modify, distribute, sell, or reverse-engineer any part of the App without prior written permission.',
      'The App name, logo, and associated branding are trademarks of Zeeshan Khan.',
    ],
  },
  {
    number: 6,
    icon: Cloud,
    title: 'Cloud Sync Disclaimer',
    content: [
      'Google Drive synchronization is an optional feature that must be explicitly enabled by the user.',
      'The App is not responsible for data loss, corruption, or unauthorized access that occurs within your Google Drive account.',
      'Your Google Drive API key is encrypted and stored locally. The developer does not have access to your API key or synced data.',
      'Sync operations are asynchronous and may be delayed. The App is not liable for sync failures due to network or Google service issues.',
    ],
  },
  {
    number: 7,
    icon: Receipt,
    title: 'Billing & Exports',
    content: [
      'Bills are generated locally on your device and can be exported as PDF or image files.',
      'The accuracy of bill content (prices, quantities, customer details) is entirely your responsibility.',
      'Exported reports (PDF, Excel, CSV) are generated from your local data and are not verified by the App.',
    ],
  },
  {
    number: 8,
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: [
      'The developer is not liable for any financial losses resulting from incorrect data entry, miscalculations, or mismanagement of inventory.',
      'The App is provided "as is" without warranties of any kind, express or implied.',
      'The developer is not responsible for data loss caused by device failure, operating system updates, browser data clearing, or user error.',
      'In no event shall the developer\'s total liability exceed the amount paid by you for the App (if any).',
    ],
  },
  {
    number: 9,
    icon: RefreshCw,
    title: 'Modifications to Terms',
    content: [
      'These Terms may be updated from time to time. Changes will be reflected in the Settings > About section of the App.',
      'Continued use of the App after modifications constitutes acceptance of the updated terms.',
      'Major changes will be communicated through in-app notifications when possible.',
    ],
  },
  {
    number: 10,
    icon: Gavel,
    title: 'Governing Law',
    content: [
      'These Terms and Conditions are governed by and construed in accordance with the laws of Pakistan.',
      'Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Pakistan.',
    ],
  },
];

export default function TermsConditions() {
  return (
    <AppLayout>
      <Header title="Terms & Conditions" showBack />
      <div className="p-4 space-y-4 pb-8">
        {/* Hero */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto ring-2 ring-primary/20">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-bold">Terms & Conditions 📜</h1>
              <Badge variant="secondary" className="text-[11px]">Effective: March 2026</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Please read these terms carefully before using the Inventory Manager App. 
              By using the App, you agree to be bound by these terms.
            </p>
          </div>
        </Card>

        {/* Accordion Sections */}
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {sections.map((s) => (
                <AccordionItem key={s.number} value={`section-${s.number}`}>
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2.5 text-left">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 font-mono">
                        {s.number}
                      </Badge>
                      <s.icon className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">{s.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-1">
                      {s.content.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Contact & Support</p>
            </div>
            <p className="text-xs text-muted-foreground">
              For questions about these Terms, or to report issues, please contact the developer:
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:zeeshankhan25102006@gmail.com" className="text-primary underline text-xs">
                zeeshankhan25102006@gmail.com
              </a>
            </div>
            <Separator />
            <p className="text-[11px] text-muted-foreground text-center">Last updated: March 2026</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
