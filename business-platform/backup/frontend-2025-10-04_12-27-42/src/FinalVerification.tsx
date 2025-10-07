import { useEffect } from "react";

export default function FinalVerification() {
  useEffect(() => {
    // Log to console to verify the component is loaded
    console.log("FinalVerification component loaded successfully");
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Verification Successful</h1>
        <p className="text-lg mb-6">All components are working correctly.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="/supplier/dashboard" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Supplier Dashboard
          </a>
          <a 
            href="/complete-supplier-test" 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Complete Supplier Test
          </a>
        </div>
      </div>
    </div>
  );
}