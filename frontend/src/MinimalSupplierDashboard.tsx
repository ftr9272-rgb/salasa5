import React from "react";

export default function MinimalSupplierDashboard() {
  console.log("MinimalSupplierDashboard component loaded");
  
  return (
    <div style={{ 
      padding: "2rem", 
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      direction: "rtl"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <h1 style={{ 
          fontSize: "2rem", 
          fontWeight: "bold"
        }}>
          لوحة تحكم المورد
        </h1>
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{ 
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h3 style={{ 
              fontSize: "0.875rem", 
              fontWeight: "500",
              color: "#64748b"
            }}>
              إجمالي الإيرادات
            </h3>
            <div style={{ 
              width: "1rem", 
              height: "1rem",
              color: "#94a3b8"
            }}>
              $
            </div>
          </div>
          <div style={{ 
            fontSize: "1.5rem", 
            fontWeight: "bold",
            marginBottom: "0.25rem"
          }}>
            45,231.89 ر.س
          </div>
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#94a3b8"
          }}>
            +20.1% من الشهر الماضي
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h3 style={{ 
              fontSize: "0.875rem", 
              fontWeight: "500",
              color: "#64748b"
            }}>
              الطلبات الجديدة
            </h3>
            <div style={{ 
              width: "1rem", 
              height: "1rem",
              color: "#94a3b8"
            }}>
              🛒
            </div>
          </div>
          <div style={{ 
            fontSize: "1.5rem", 
            fontWeight: "bold",
            marginBottom: "0.25rem"
          }}>
            +2350
          </div>
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#94a3b8"
          }}>
            +180.1% من الشهر الماضي
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h3 style={{ 
              fontSize: "0.875rem", 
              fontWeight: "500",
              color: "#64748b"
            }}>
              إجمالي المنتجات
            </h3>
            <div style={{ 
              width: "1rem", 
              height: "1rem",
              color: "#94a3b8"
            }}>
              📦
            </div>
          </div>
          <div style={{ 
            fontSize: "1.5rem", 
            fontWeight: "bold",
            marginBottom: "0.25rem"
          }}>
            1,245
          </div>
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#94a3b8"
          }}>
            منتج متوفر
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h3 style={{ 
              fontSize: "0.875rem", 
              fontWeight: "500",
              color: "#64748b"
            }}>
              التجار النشطون
            </h3>
            <div style={{ 
              width: "1rem", 
              height: "1rem",
              color: "#94a3b8"
            }}>
              👥
            </div>
          </div>
          <div style={{ 
            fontSize: "1.5rem", 
            fontWeight: "bold",
            marginBottom: "0.25rem"
          }}>
            +573
          </div>
          <p style={{ 
            fontSize: "0.75rem", 
            color: "#94a3b8"
          }}>
            +201 منذ الربع الأخير
          </p>
        </div>
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "2fr 1fr",
        gap: "1rem"
      }}>
        <div style={{ 
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ 
            fontSize: "1rem", 
            fontWeight: "600",
            marginBottom: "1rem"
          }}>
            نظرة عامة على الطلبات
          </h3>
          <div style={{ 
            height: "350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f1f5f9",
            borderRadius: "0.25rem"
          }}>
            <p style={{ color: "#64748b" }}>
              مخطط الطلبات (سيتم عرضه عند تثبيت المكتبات المناسبة)
            </p>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ 
            fontSize: "1rem", 
            fontWeight: "600",
            marginBottom: "1rem"
          }}>
            الطلبات الأخيرة
          </h3>
          <div style={{ 
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <p style={{ 
              fontSize: "0.875rem", 
              color: "#94a3b8"
            }}>
              لا توجد طلبات حديثة لعرضها.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}