import { useEffect } from "react";

export default function UltraSimpleSupplier() {
  useEffect(() => {
    console.log("UltraSimpleSupplier component mounted");
  }, []);

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem',
        color: '#333'
      }}>
        لوحة تحكم المورد
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem',
        marginBottom: '2rem',
        color: '#666'
      }}>
        إذا كنت ترى هذا النص، فهذا يعني أن المكون الأساسي يعمل.
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem' 
      }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#333'
          }}>
            إجمالي الإيرادات
          </h3>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: '#2563eb'
          }}>
            45,231.89 ر.س
          </p>
          <p style={{ 
            fontSize: '0.9rem',
            color: '#666'
          }}>
            +20.1% من الشهر الماضي
          </p>
        </div>
      </div>
    </div>
  );
}