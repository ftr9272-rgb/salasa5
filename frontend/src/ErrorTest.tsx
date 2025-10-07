import React, { useState, useEffect } from "react";

export default function ErrorTest() {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string>("Component loaded successfully");

  useEffect(() => {
    try {
      // Test basic JavaScript functionality
      console.log("ErrorTest component mounted");
      setInfo("Component mounted and useEffect executed");
      
      // Test if window object is available
      if (typeof window !== "undefined") {
        setInfo(prev => prev + " | Window object available");
      }
      
      // Test if document object is available
      if (typeof document !== "undefined") {
        setInfo(prev => prev + " | Document object available");
      }
      
      // Test if React is working
      setInfo(prev => prev + " | React is working");
    } catch (err: any) {
      console.error("Error in ErrorTest:", err);
      setError(`Error: ${err.message}`);
    }
  }, []);

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
        Error Test Component
      </h1>
      
      {error ? (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#fee2e2",
          color: "#b91c1c",
          borderRadius: "0.5rem",
          marginBottom: "1rem"
        }}>
          <h2 style={{ 
            fontSize: "1.25rem", 
            fontWeight: "bold",
            marginBottom: "0.5rem"
          }}>
            Error Detected
          </h2>
          <p>{error}</p>
        </div>
      ) : null}
      
      <div style={{ 
        padding: "1rem", 
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        borderRadius: "0.5rem"
      }}>
        <h2 style={{ 
          fontSize: "1.25rem", 
          fontWeight: "bold",
          marginBottom: "0.5rem"
        }}>
          Component Status
        </h2>
        <p>{info}</p>
      </div>
    </div>
  );
}