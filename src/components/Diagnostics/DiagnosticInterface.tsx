import React, { useState, useRef } from 'react';
import { Upload, Image, Zap, Eye, Download, AlertCircle } from 'lucide-react';
import { mockPatients, mockDiagnostics } from '../../data/mockData';
import { Patient, Diagnostic } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const DiagnosticInterface: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Diagnostic[]>([]);

  const patients = mockPatients.filter(p => 
    user?.role === 'medecin' ? p.medecinId === user.id : true
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const simulateAnalysis = async (file: File): Promise<Diagnostic> => {
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    const results = [0, 1, 2, 3, 4] as const;
    const probabilities = [0.92, 0.87, 0.74, 0.68, 0.83];
    const randomIndex = Math.floor(Math.random() * results.length);
    
    return {
      id: Date.now().toString() + Math.random(),
      patientId: selectedPatient,
      medecinId: user?.id || '',
      date: new Date().toISOString().split('T')[0],
      modeleUtilise: 'Vision Transformer v2.1',
      resultat: results[randomIndex],
      probabilite: probabilities[randomIndex],
      imageUrl: URL.createObjectURL(file),
      notes: `Analyse automatique - ${new Date().toLocaleString('fr-FR')}`
    };
  };

  const analyzeImages = async () => {
    if (!selectedPatient || selectedImages.length === 0) return;

    setIsAnalyzing(true);
    const newResults: Diagnostic[] = [];

    for (const image of selectedImages) {
      try {
        const result = await simulateAnalysis(image);
        newResults.push(result);
      } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
      }
    }

    setResults(newResults);
    setIsAnalyzing(false);
  };

  const getFibroseLabel = (stage: number) => {
    const labels = {
      0: { label: 'F0 - Normal', color: 'text-green-600 bg-green-50' },
      1: { label: 'F1 - Fibrose légère', color: 'text-yellow-600 bg-yellow-50' },
      2: { label: 'F2 - Fibrose modérée', color: 'text-orange-600 bg-orange-50' },
      3: { label: 'F3 - Fibrose sévère', color: 'text-red-600 bg-red-50' },
      4: { label: 'F4 - Cirrhose', color: 'text-red-800 bg-red-100' }
    };
    return labels[stage as keyof typeof labels];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interface de Diagnostic</h1>
        <p className="mt-2 text-gray-600">
          Analysez les images échographiques pour détecter la fibrose hépatique
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de gauche - Upload et configuration */}
        <div className="space-y-6">
          {/* Sélection du patient */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sélection du patient</h3>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Choisir un patient...</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.prenom} {patient.nom} - {patient.id}
                </option>
              ))}
            </select>
          </div>

          {/* Upload d'images */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Images échographiques</h3>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">
                Cliquez pour sélectionner des images
              </p>
              <p className="text-sm text-gray-500">
                Formats supportés: JPEG, PNG, DICOM
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Aperçu des images */}
            {selectedImages.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Images sélectionnées ({selectedImages.length})
                </h4>
                <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton d'analyse */}
            <div className="mt-6">
              <button
                onClick={analyzeImages}
                disabled={!selectedPatient || selectedImages.length === 0 || isAnalyzing}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Lancer l'analyse IA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Panel de droite - Résultats */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Résultats de l'analyse</h3>
            
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Les résultats d'analyse apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.map((result, index) => {
                  const fibroseInfo = getFibroseLabel(result.resultat);
                  return (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={result.imageUrl}
                          alt={`Analyse ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${fibroseInfo.color}`}>
                              {fibroseInfo.label}
                            </span>
                            <span className="text-sm text-gray-600">
                              {Math.round(result.probabilite * 100)}% confiance
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            Modèle: {result.modeleUtilise}
                          </div>
                          
                          {result.resultat >= 3 && (
                            <div className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Suivi médical rapproché recommandé
                            </div>
                          )}
                          
                          <div className="flex space-x-2 mt-3">
                            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              Détails
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 text-sm flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              Rapport
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Historique récent */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Diagnostics récents</h3>
            <div className="space-y-3">
              {mockDiagnostics.slice(0, 3).map((diagnostic) => {
                const patient = patients.find(p => p.id === diagnostic.patientId);
                const fibroseInfo = getFibroseLabel(diagnostic.resultat);
                
                return (
                  <div key={diagnostic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient?.prenom} {patient?.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(diagnostic.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${fibroseInfo.color}`}>
                      {fibroseInfo.label.split(' - ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticInterface;