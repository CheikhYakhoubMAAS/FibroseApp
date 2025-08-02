import React from 'react';
import { Users, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import StatsCard from './StatsCard';
import FibroseChart from './FibroseChart';
import { mockStatistics } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = mockStatistics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue, {user?.nom}. Voici un aperçu de votre activité médicale.
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Patients totaux"
          value={stats.totalPatients}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Diagnostics réalisés"
          value={stats.totalDiagnostics}
          icon={Activity}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Cas sévères (F3-F4)"
          value={stats.repartitionFibrose[3] + stats.repartitionFibrose[4]}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Taux de détection"
          value="94.2%"
          icon={TrendingUp}
          color="green"
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <FibroseChart data={stats.repartitionFibrose} />
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution mensuelle des diagnostics
          </h3>
          <div className="space-y-4">
            {stats.diagnosticsParMois.map((item, index) => (
              <div key={item.mois} className="flex items-center">
                <div className="w-12 text-sm text-gray-600">{item.mois}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.count / Math.max(...stats.diagnosticsParMois.map(d => d.count))) * 100}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 text-right">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">
              Patients nécessitant un suivi
            </h3>
            <p className="mt-2 text-yellow-700">
              {stats.repartitionFibrose[3] + stats.repartitionFibrose[4]} patients présentent une fibrose sévère (F3-F4) 
              et nécessitent un suivi médical rapproché.
            </p>
            <button className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline">
              Voir la liste des patients →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;