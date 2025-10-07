import React from "react";

export default function RouteTest() {
  React.useEffect(() => {
    console.log("RouteTest component mounted");
  }, []);
  
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem',
        color: '#333'
      }}>
        Route Test
      </h1>
      <p style={{ 
        fontSize: '1.2rem',
        color: '#666'
      }}>
        If you can see this message, the route is working correctly.
      </p>
    </div>
  );
}