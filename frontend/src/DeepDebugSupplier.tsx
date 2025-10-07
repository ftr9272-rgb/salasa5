import { useState, useEffect } from "react";

export default function DeepDebugSupplier() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Log to console for debugging
      console.log("DeepDebugSupplier component mounted");
      
      // Check if required dependencies are available
      const checkDependencies = () => {
        const deps = {
          window: typeof window !== 'undefined',
          document: typeof document !== 'undefined',
        };
        return deps;
      };

      // Check if components can be imported
      const checkImports = async () => {
        try {
          await import("@/components/ui/card");
          console.log("Card component imported successfully");
          return true;
        } catch (err) {
          console.error("Error importing Card component:", err);
          return false;
        }
      };

      // Check if CSS is loaded
      const checkCSS = () => {
        const stylesheets = Array.from(document.styleSheets);
        const tailwindLoaded = stylesheets.some(sheet => 
          sheet.href && (sheet.href.includes('tailwind') || sheet.href.includes('index.css'))
        );
        return tailwindLoaded;
      };

      // Gather debug information
      const info = {
        timestamp: new Date().toISOString(),
        dependencies: checkDependencies(),
        cssLoaded: checkCSS(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        online: navigator.onLine,
      };

      setDebugInfo(info);
      
      // Try to import the SupplierDashboard component
      import("./pages/supplier/Dashboard")
        .then((module) => {
          console.log("SupplierDashboard imported successfully:", module);
          setDebugInfo((prev: any) => ({ ...prev, dashboardImport: "success" }));
        })
        .catch((err) => {
          console.error("Error importing SupplierDashboard:", err);
          setError(`Error importing SupplierDashboard: ${err.message}`);
          setDebugInfo((prev: any) => ({ ...prev, dashboardImport: "failed", error: err.message }));
        });
    } catch (err: any) {
      console.error("Error in DeepDebugSupplier:", err);
      setError(`Error in DeepDebugSupplier: ${err.message}`);
    }
  }, []);

  return (
    <div className="p-8" dir="ltr">
      <h1 className="text-2xl font-bold mb-4">Deep Debug Supplier Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
        <pre className="bg-white p-2 rounded overflow-auto max-h-96">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Console Output</h2>
        <p>Please check the browser console for detailed logs.</p>
      </div>
    </div>
  );
}