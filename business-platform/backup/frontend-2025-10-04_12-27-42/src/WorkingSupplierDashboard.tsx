import React from "react";
// Import all necessary components directly in this file to avoid import issues
import { 
  Card as ShadcnCard, 
  CardContent as ShadcnCardContent, 
  CardHeader as ShadcnCardHeader, 
  CardTitle as ShadcnCardTitle 
} from "./components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

// Simple Card component implementation in case the import fails
const Card = ShadcnCard || (({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
));

const CardHeader = ShadcnCardHeader || (({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
));

const CardTitle = ShadcnCardTitle || (({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
));

const CardContent = ShadcnCardContent || (({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
));

// Simple icon components in case the lucide imports fail
const SimpleDollarSign = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const SimpleShoppingCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const SimplePackage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"></path>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
    <path d="m3.3 7 8.7 5 8.7-5"></path>
    <path d="M12 22V12"></path>
  </svg>
);

const SimpleUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const data = [
  { name: "يناير", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "فبراير", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "مارس", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "أبريل", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "مايو", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "يونيو", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "يوليو", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "أغسطس", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "سبتمبر", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "أكتوبر", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "نوفمبر", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "ديسمبر", total: Math.floor(Math.random() * 5000) + 1000 },
];

export default function WorkingSupplierDashboard() {
  React.useEffect(() => {
    console.log("WorkingSupplierDashboard component is rendering");
  }, []);
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6" dir="rtl">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">لوحة تحكم المورد</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <SimpleDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231.89 ر.س</div>
            <p className="text-xs text-muted-foreground">+20.1% من الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات الجديدة</CardTitle>
            <SimpleShoppingCart />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% من الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <SimplePackage />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">منتج متوفر</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التجار النشطون</CardTitle>
            <SimpleUsers />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 منذ الربع الأخير</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>نظرة عامة على الطلبات</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">مخطط الطلبات (سيتم عرضه عند تثبيت Recharts)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>الطلبات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">لا توجد طلبات حديثة لعرضها.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}