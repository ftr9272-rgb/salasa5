import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  companyName: string;
  isVerified: boolean;
  createdAt: string;
}

export default function TestDashboard() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('business_platform_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Test Dashboard</h1>
      {user ? (
        <div>
          <p className="text-green-600">User is authenticated:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <div>
          <p className="text-red-600">No authenticated user found</p>
          <button 
            onClick={() => {
              // Set a mock user for testing
              const mockUser = {
                id: 'test-user',
                email: 'supplier@example.com',
                name: 'Test Supplier',
                role: 'supplier',
                companyName: 'Test Company',
                isVerified: true,
                createdAt: new Date().toISOString()
              };
              localStorage.setItem('business_platform_user', JSON.stringify(mockUser));
              setUser(mockUser);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Set Mock User
          </button>
        </div>
      )}
    </div>
  );
}