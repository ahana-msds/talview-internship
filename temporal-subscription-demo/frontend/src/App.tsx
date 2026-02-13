import { useState, useEffect } from 'react';
import './App.css';
import WorkflowDashboard from './components/WorkflowDashboard';

const API_BASE = 'http://localhost:3002/api';

interface EtherealInfo {
  user: string;
  pass: string;
  web: string;
}

function App() {
  const [etherealInfo, setEtherealInfo] = useState<EtherealInfo | null>(null);

  useEffect(() => {
    // Fetch Ethereal email info
    fetch(`${API_BASE}/email-info`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.etherealInfo) {
          setEtherealInfo(data.etherealInfo);
        }
      })
      .catch(err => console.error('Failed to fetch email info:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            temporal subscription management
          </h1>
          <p className="text-gray-600">
            real-time workflow visualization and monitoring
          </p>

          {etherealInfo && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                email testing with ethereal
              </p>
              <p className="text-xs text-blue-800">
                all emails are sent to a test inbox. view them at:{' '}
                <a
                  href={etherealInfo.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  {etherealInfo.web}
                </a>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                login: {etherealInfo.user} / {etherealInfo.pass}
              </p>
            </div>
          )}
        </header>

        <WorkflowDashboard />
      </div>
    </div>
  );
}

export default App;
