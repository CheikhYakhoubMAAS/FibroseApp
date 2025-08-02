import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Eye, AlertTriangle } from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'system'>('users');
  
  // Données simulées pour la démonstration
  const [users] = useState<User[]>([
    {
      id: '1',
      nom: 'Dr. Martin Dubois',
      email: 'martin.dubois@hopital.fr',
      role: 'medecin',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      nom: 'Dr. Sophie Laurent',
      email: 'sophie.laurent@hopital.fr',
      role: 'medecin',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      nom: 'Admin Système',
      email: 'admin@hopital.fr',
      role: 'admin',
      createdAt: '2024-01-01'
    }
  ]);

  const auditLogs = [
    {
      id: '1',
      action: 'Connexion utilisateur',
      user: 'Dr. Martin Dubois',
      timestamp: '2024-02-20 14:30:25',
      ip: '192.168.1.100',
      status: 'Succès'
    },
    {
      id: '2',
      action: 'Création patient',
      user: 'Dr. Sophie Laurent',
      timestamp: '2024-02-20 11:15:43',
      ip: '192.168.1.101',
      status: 'Succès'
    },
    {
      id: '3',
      action: 'Diagnostic réalisé',
      user: 'Dr. Martin Dubois',
      timestamp: '2024-02-20 09:22:17',
      ip: '192.168.1.100',
      status: 'Succès'
    },
    {
      id: '4',
      action: 'Tentative connexion échouée',
      user: 'admin@hopital.fr',
      timestamp: '2024-02-19 23:45:12',
      ip: '203.0.113.42',
      status: 'Échec'
    }
  ];

  const systemMetrics = {
    uptime: '15 jours 7h 23min',
    activeSessions: 12,
    totalDiagnostics: 342,
    errorRate: '0.2%',
    responseTime: '145ms'
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'super-admin': 'bg-purple-100 text-purple-800',
      'admin': 'bg-blue-100 text-blue-800',
      'medecin': 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'Succès' 
      ? 'text-green-600 bg-green-50' 
      : 'text-red-600 bg-red-50';
  };

  if (user?.role !== 'admin' && user?.role !== 'super-admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Accès non autorisé</h2>
          <p className="text-red-700">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panneau d'Administration</h1>
        <p className="mt-2 text-gray-600">
          Gestion des utilisateurs, supervision système et journaux d'audit
        </p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'users', name: 'Utilisateurs', icon: Users },
            { id: 'logs', name: 'Journaux d\'audit', icon: Eye },
            { id: 'system', name: 'Système', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </button>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.nom}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Journaux d'audit</h2>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Métriques système</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Temps de fonctionnement</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{systemMetrics.uptime}</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Sessions actives</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{systemMetrics.activeSessions}</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Diagnostics totaux</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{systemMetrics.totalDiagnostics}</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Taux d'erreur</h3>
              <p className="text-2xl font-semibold text-green-600 mt-2">{systemMetrics.errorRate}</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Temps de réponse moyen</h3>
              <p className="text-2xl font-semibold text-blue-600 mt-2">{systemMetrics.responseTime}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">
                  Maintenance programmée
                </h3>
                <p className="mt-2 text-yellow-700">
                  Une maintenance système est prévue le 25 février 2024 de 02h00 à 04h00. 
                  Les services pourront être temporairement indisponibles.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;