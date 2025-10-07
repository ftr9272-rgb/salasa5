import React from "react";

export default function UltraMinimalSupplier() {
  console.log("UltraMinimalSupplier component loaded");
  
  return (
    <div style={{ 
      padding: "2rem", 
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      direction: "rtl"
    }}>
      <h1 style={{ 
        fontSize: "2rem", 
        fontWeight: "bold",
        marginBottom: "1rem"
      }}>
        لوحة تحكم المورد - نسخة مبسطة جداً
      </h1>
      <p>إذا كنت ترى هذا النص، فهذا يعني أن المكون يعمل بشكل صحيح.</p>
    </div>
  );
}