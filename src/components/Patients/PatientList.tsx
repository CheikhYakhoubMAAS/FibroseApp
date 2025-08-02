import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Calendar } from 'lucide-react';
import { mockPatients } from '../../data/mockData';
import { Patient } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PatientListProps {
  onNewPatient: () => void;
  onEditPatient: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({ onNewPatient, onEditPatient }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState(mockPatients);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Les médecins ne voient que leurs patients
    const matchesDoctor = user?.role === 'medecin' ? patient.medecinId === user.id : true;
    
    return matchesSearch && matchesDoctor;
  });

  const calculateAge = (dateNaissance: string) => {
    const today = new Date();
    const birth = new Date(dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Patients</h1>
            <p className="mt-2 text-gray-600">
              {filteredPatients.length} patient{filteredPatients.length > 1 ? 's' : ''} trouvé{filteredPatients.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onNewPatient}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Patient
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, prénom ou email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Liste des patients */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Âge / Sexe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.prenom} {patient.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {patient.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {calculateAge(patient.dateNaissance)} ans
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.telephone}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEditPatient(patient)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="Voir le dossier"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditPatient(patient)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">Aucun patient trouvé</p>
              <p className="mt-2">
                {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter un nouveau patient'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;