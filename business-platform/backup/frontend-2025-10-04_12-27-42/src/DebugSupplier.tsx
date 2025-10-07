import { useState, useEffect } from "react";

export default function DebugSupplier() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Try to dynamically import the SupplierDashboard component
      import("./pages/supplier/Dashboard")
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setError(`Error importing SupplierDashboard: ${err.message}`);
          setLoading(false);
        });
    } catch (err: any) {
      setError(`Error in useEffect: ${err.message}`);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Debug Error</h1>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Supplier Dashboard</h1>
      <p>No errors detected during import.</p>
    </div>
  );
}