import React from "react";

export default function RootTest() {
  React.useEffect(() => {
    console.log("RootTest component mounted");
    // Check if the component is actually being rendered
    const element = document.getElementById("root-test-element");
    if (element) {
      element.textContent = "RootTest component is working!";
      console.log("RootTest element found and updated");
    } else {
      console.log("RootTest element not found");
    }
  }, []);

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <h1>Root Test Component</h1>
      <p>This component is used to test if the root rendering is working.</p>
      <div 
        id="root-test-element" 
        style={{ 
          padding: "1rem", 
          backgroundColor: "white", 
          border: "1px solid #ccc",
          marginTop: "1rem"
        }}
      >
        If you see this text, the component is rendering but the effect hasn't run yet.
      </div>
    </div>
  );
}