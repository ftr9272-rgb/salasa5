import React from "react";
import SupplierDashboard from "./pages/supplier/Dashboard";

export default function FullProviderSupplierTest() {
  console.log("FullProviderSupplierTest component loaded");
  
  // Wrap the supplier dashboard in a div with the same styling as the main app
  return (
    <div 
      className="min-h-screen bg-gray-50" 
      style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8fafc",
        direction: "rtl",
        fontFamily: "Cairo, sans-serif"
      }}
    >
      <SupplierDashboard />
    </div>
  );
}