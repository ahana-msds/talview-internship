import { useState } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './apollo/client';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { NewShipmentModal } from './components/NewShipmentModal';
import { AuthPage } from './pages/AuthPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const role = currentUser?.role;

  if (!currentUser) {
    return (
      <ApolloProvider client={client}>
        <AuthPage />
      </ApolloProvider>
    );
  }

  const renderContent = () => {
    return <Dashboard onOpenModal={() => setShowModal(true)} role={role || 'customer'} />;
  };

  return (
    <ApolloProvider client={client}>
      <MainLayout activeTab={activeTab} onNavigate={setActiveTab}>
        {renderContent()}
      </MainLayout>
      {showModal && <NewShipmentModal onClose={() => setShowModal(false)} />}
    </ApolloProvider>
  );
}

export default App;
