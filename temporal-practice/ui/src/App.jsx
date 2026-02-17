import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Coffee,
  Play,
  Pause,
  XCircle,
  RefreshCcw,
  Settings,
  History,
  Activity,
  AlertCircle,
  CheckCircle2,
  Package
} from 'lucide-react';

const API_BASE = 'http://localhost:4000';

function App() {
  const [email, setEmail] = useState('user@example.com');
  const [workflowId, setWorkflowId] = useState(null);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Poll for status if we have a workflowId
  useEffect(() => {
    let interval;
    if (workflowId) {
      fetchStatus();
      interval = setInterval(fetchStatus, 2000);
    }
    return () => clearInterval(interval);
  }, [workflowId]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/status/${workflowId}`);
      setStatus(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching status', err);
    }
  };

  const fetchHistory = async () => {
    if (!workflowId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/history/${workflowId}`);
      setHistory(res.data);
    } catch (err) {
      console.error('History fetch error:', err);
      const msg = err.response?.data?.error || err.message;
      setError(`Failed to fetch history: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const startSubscription = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/subscribe`, {
        email,
        product: 'Premium Coffee Blend',
        amount: 25,
        intervalMs: 10000,
        maxIterations: 10
      });
      setWorkflowId(res.data.workflowId);
      setStatus(null);
      setHistory([]);
    } catch (err) {
      setError('Failed to start subscription');
    } finally {
      setLoading(false);
    }
  };

  const sendSignal = async (signal) => {
    try {
      await axios.post(`${API_BASE}/signal/${workflowId}/${signal}`);
      fetchStatus();
    } catch (err) {
      setError(`Failed to send ${signal} signal`);
    }
  };

  return (
    <div className="dashboard">
      <h1>Temporal Practice: Coffee Subscription</h1>

      {/* Control Panel */}
      <div className="card">
        <h2><Settings size={24} color="#818cf8" /> Control Panel</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Subscriber Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            disabled={workflowId && status?.status !== 'CANCELLED' && status?.status !== 'COMPLETED'}
          />
          <button
            className="btn btn-primary"
            onClick={startSubscription}
            disabled={loading || (workflowId && status?.status === 'ACTIVE')}
            style={{ width: '100%' }}
          >
            {loading ? <RefreshCcw className="animate-spin" /> : <Play size={18} />}
            Start New Subscription
          </button>
        </div>

        {workflowId && status && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {status.status === 'ACTIVE' && (
              <button className="btn btn-outline" onClick={() => sendSignal('pause')}>
                <Pause size={18} /> Pause
              </button>
            )}
            {status.status === 'PAUSED' && (
              <button className="btn btn-primary" onClick={() => sendSignal('resume')}>
                <Play size={18} /> Resume
              </button>
            )}
            {status.status !== 'CANCELLED' && (
              <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => sendSignal('cancel')}>
                <XCircle size={18} /> Cancel
              </button>
            )}
          </div>
        )}

        {error && (
          <div style={{ marginTop: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
      </div>

      {/* Subscription Status */}
      <div className="card">
        <h2><Activity size={24} color="#10b981" /> Live Workflow State</h2>
        {!workflowId ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No active workflow. Start one to see the magic.</p>
        ) : !status ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <RefreshCcw className="animate-spin" style={{ color: '#818cf8' }} />
            <p style={{ marginTop: '1rem' }}>Querying Temporal Server...</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>WORKFLOW ID</p>
                <code style={{ color: '#818cf8', fontWeight: 'bold' }}>{status.subscriptionId}</code>
              </div>
              <span className={`badge badge-${status.status.toLowerCase()}`}>
                {status.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ITERATION</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{status.iteration}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DETERMINISTIC</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>TRUE</p>
              </div>
            </div>

            <h3><Package size={18} style={{ marginRight: '0.5rem' }} /> Delivered Orders</h3>
            <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
              {status.orders.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Waiting for first delivery...</p>
              ) : (
                status.orders.map((order, i) => (
                  <div key={i} className="order-item">
                    <span>{order.product}</span>
                    <span style={{ color: '#10b981' }}>{order.status} <CheckCircle2 size={12} inline /></span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* History / Event Sourcing */}
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2><History size={24} color="#c084fc" /> Event Sourcing Model (Workflow History)</h2>
          <button className="btn btn-outline" onClick={fetchHistory} disabled={!workflowId || loading}>
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh History
          </button>
        </div>

        {history.length > 0 ? (
          <div className="history-list">
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Temporal records every event. This enables <strong>Reliability</strong> and <strong>Replayability</strong>.
            </p>
            {history.slice(-10).reverse().map((event, i) => (
              <div key={i} className="history-item">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: '#c084fc' }}>{event.eventType}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Event ID: {event.eventId}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {JSON.stringify(event.attributes || {}).substring(0, 100)}...
                </div>
              </div>
            ))}
            {history.length > 10 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>Showing last 10 of {history.length} events</p>}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <History size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>Click "Refresh History" to see the Event Sourcing model in action.</p>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
