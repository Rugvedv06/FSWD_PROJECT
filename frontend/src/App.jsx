import { useState, useEffect } from 'react';
import { healthCheck } from './services/api';

function App() {
  const [status, setStatus] = useState('Checking...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await healthCheck();
        setStatus(response.data.message);
      } catch (error) {
        setStatus('API not connected');
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">LifeOS Finance</h1>
        <p className="text-xl text-gray-400">AI-Powered Financial Decision System</p>
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-lg">Status: {loading ? 'Loading...' : status}</p>
        </div>
      </div>
    </div>
  );
}

export default App;