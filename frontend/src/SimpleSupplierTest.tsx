import React from "react";

export default function SimpleSupplierTest() {
  return (
    <div style={{ 
      padding: "2rem", 
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      direction: "rtl"
    }}>
      <h1 style={{ 
        fontSize: "2rem", 
        fontWeight: "bold",
        marginBottom: "1rem"
      }}>
        لوحة تحكم المورد - نسخة اختبار بسيطة
      </h1>
      <p>إذا كنت ترى هذا النص، فهذا يعني أن المسار يعمل بشكل صحيح.</p>
      <div style={{ 
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ 
          fontSize: "1.25rem", 
          fontWeight: "600",
          marginBottom: "0.5rem"
        }}>
          معلومات الاختبار
        </h2>
        <p>هذه نسخة مبسطة من لوحة تحكم المورد للتحقق من أن المسار يعمل بشكل صحيح.</p>
      </div>
    </div>
  );
}