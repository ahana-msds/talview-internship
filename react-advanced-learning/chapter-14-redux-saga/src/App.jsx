
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { fetchUserRequest, cancelUserFetch } from './store/actions/userActions';

// separate component to use hooks
const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Chapter 14: Redux Saga Patterns</h1>

      <div className="controls" style={{ marginBottom: '20px' }}>
        <button
          onClick={() => dispatch(fetchUserRequest(1))}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          {loading ? 'fetching...' : 'fetch user 1'}
        </button>

        {/* triggering cancellation manually (though takeLatest handles auto-cancel) */}
        <button
          onClick={() => dispatch(fetchUserRequest(2))}
          disabled={loading}
        >
          fetch user 2 (interrupts user 1)
        </button>
      </div>

      <div className="status" style={{ border: '1px solid #ccc', padding: '10px', minHeight: '100px' }}>
        {loading && <p style={{ color: 'blue' }}>loading data...</p>}
        {error && <p style={{ color: 'red' }}>error: {error}</p>}
        {user && (
          <div>
            <h3>User Profile</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Activity:</strong> {user.activityLog.join(', ')}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
        <p>check console logs to see saga effects in action (race, select, etc)</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <UserDashboard />
    </Provider>
  );
};

export default App;
