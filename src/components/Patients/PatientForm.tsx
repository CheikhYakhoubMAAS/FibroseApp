import React, { useState } from 'react';
import { X, Save, User } from 'lucide-react';
import { Patient } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PatientFormProps {
  patient?: Patient;
  onClose: () => void;
  onSave: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onClose, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nom: patient?.nom || '',
    prenom: patient?.prenom || '',
    dateNaissance: patient?.dateNaissance || '',
    sexe: (patient?.sexe || 'M') as 'M' | 'F',
    telephone: patient?.telephone || '',
    email: patient?.email || '',
    adresse: patient?.adresse || '',
    medecinId: patient?.medecinId || user?.id || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (formData.telephone && !/^[\d\s\+\-\(\)]+$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              {patient ? 'Modifier le patient' : 'Nouveau patient'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.nom ? 'border-red-300' : ''
                }`}
                placeholder="Nom de famille"
              />
              {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
            </div>

            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.prenom ? 'border-red-300' : ''
                }`}
                placeholder="Prénom"
              />
              {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
            </div>

            <div>
              <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
                Date de naissance *
              </label>
              <input
                type="date"
                id="dateNaissance"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.dateNaissance ? 'border-red-300' : ''
                }`}
              />
              {errors.dateNaissance && <p className="mt-1 text-sm text-red-600">{errors.dateNaissance}</p>}
            </div>

            <div>
              <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">
                Sexe *
              </label>
              <select
                id="sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.telephone ? 'border-red-300' : ''
                }`}
                placeholder="01 23 45 67 89"
              />
              {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : ''
                }`}
                placeholder="patient@email.fr"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <textarea
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Adresse complète du patient"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {patient ? 'Mettre à jour' : 'Créer le patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;