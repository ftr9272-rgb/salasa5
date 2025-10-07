import React from "react";
import SupplierDashboard from "./pages/supplier/Dashboard";
import "./index.css";

export default function MinimalSupplierWrapper() {
  React.useEffect(() => {
    console.log("MinimalSupplierWrapper mounted");
  }, []);
  
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SupplierDashboard />
    </div>
  );
}