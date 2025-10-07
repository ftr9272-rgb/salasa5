import React from "react";
import SupplierDashboard from "./pages/supplier/Dashboard";

export default function DirectSupplierTest() {
  console.log("DirectSupplierTest component loaded");
  
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <h1 style={{ padding: "1rem", backgroundColor: "#e2e8f0" }}>
        Test Wrapper for Supplier Dashboard
      </h1>
      <SupplierDashboard />
    </div>
  );
}