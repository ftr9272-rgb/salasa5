import React from "react";
// Direct import without alias
import SupplierDashboard from "./pages/supplier/Dashboard";

export default function DirectImportSupplierTest() {
  console.log("DirectImportSupplierTest component loaded");
  
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <h1 style={{ padding: "1rem", backgroundColor: "#e2e8f0" }}>
        Direct Import Test for Supplier Dashboard
      </h1>
      <SupplierDashboard />
    </div>
  );
}