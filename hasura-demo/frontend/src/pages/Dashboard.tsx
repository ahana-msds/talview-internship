import React from 'react';
import { PackageTracker } from '../components/PackageTracker';
import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';

const TOTAL_STATS_SUBSCRIPTION = gql`
  subscription GetTotalStats {
    packages_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const IN_TRANSIT_STATS_SUBSCRIPTION = gql`
  subscription GetInTransitStats {
    packages_aggregate(where: {status: {_eq: "in_transit"}}) {
      aggregate {
        count
      }
    }
  }
`;

const DELIVERED_STATS_SUBSCRIPTION = gql`
  subscription GetDeliveredStats {
    packages_aggregate(where: {status: {_eq: "delivered"}}) {
      aggregate {
        count
      }
    }
  }
`;

interface DashboardProps {
  onOpenModal: () => void;
  role: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenModal, role }) => {
  const { data: totalData, loading: totalLoading, error: totalError } = useSubscription<any>(TOTAL_STATS_SUBSCRIPTION);
  const { data: inTransitData, loading: inTransitLoading, error: inTransitError } = useSubscription<any>(IN_TRANSIT_STATS_SUBSCRIPTION);
  const { data: deliveredData, loading: deliveredLoading, error: deliveredError } = useSubscription<any>(DELIVERED_STATS_SUBSCRIPTION);

  const loading = totalLoading || inTransitLoading || deliveredLoading;
  const error = totalError || inTransitError || deliveredError;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', opacity: 0.5 }}>
      <h3>Loading Command Center metrics...</h3>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', border: '2px solid var(--danger)', borderRadius: '12px', background: 'white' }}>
      <h3 style={{ color: 'var(--danger)' }}>Metric Sync Failed</h3>
      <p>{error.message}</p>
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background)', fontSize: '0.85rem' }}>
        <strong>Troubleshooting:</strong>
        <ul>
          <li>Ensure the database is connected as 'default' in Hasura Console.</li>
          <li>Verify 'Track All' was clicked in the public schema.</li>
        </ul>
      </div>
    </div>
  );

  const stats = [
    { label: 'Total Shipments', value: totalData?.packages_aggregate?.aggregate?.count || 0, icon: '📦', color: 'var(--primary)' },
    { label: 'In Transit', value: inTransitData?.packages_aggregate?.aggregate?.count || 0, icon: '🚛', color: 'var(--warning)' },
    { label: 'Delivered', value: deliveredData?.packages_aggregate?.aggregate?.count || 0, icon: '✅', color: 'var(--success)' },
    { label: 'System Health', value: '100%', icon: '🛡️', color: 'var(--primary)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              fontSize: '2rem',
              width: '60px',
              height: '60px',
              backgroundColor: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tracker Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Active Shipments</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="card" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Filters</button>
            {role !== 'agent' && (
              <button
                onClick={onOpenModal}
                style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                + New Shipment
              </button>
            )}
          </div>
        </div>
        <PackageTracker />
      </div>
    </div>
  );
};
