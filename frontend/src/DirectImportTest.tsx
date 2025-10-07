import { useEffect, useState } from "react";

// Direct import to test if there are any import issues
import SupplierDashboard from "./pages/supplier/Dashboard";

export default function DirectImportTest() {
  const [importSuccess, setImportSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // If we reach this point, the import was successful
      setImportSuccess(true);
    } catch (err: any) {
      setError(`Import error: ${err.message}`);
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Direct Import Test</h1>
      {error ? (
        <div className="text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : importSuccess ? (
        <div className="text-green-500">
          <p>Import successful! Component should render below:</p>
          <div className="mt-4 border p-4">
            <SupplierDashboard />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}