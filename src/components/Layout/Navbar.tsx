import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Activity, Users, BarChart3, Settings } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { id: 'dashboard', name: 'Tableau de bord', icon: BarChart3 },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'diagnostics', name: 'Diagnostics', icon: Activity },
    ...(user?.role === 'admin' || user?.role === 'super-admin' 
      ? [{ id: 'admin', name: 'Administration', icon: Settings }] 
      : [])
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">FibroDetect</span>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:block">{user?.nom}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:block">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;