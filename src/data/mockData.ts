import { Patient, Diagnostic, Statistics } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    nom: 'Dupont',
    prenom: 'Jean',
    dateNaissance: '1975-05-15',
    sexe: 'M',
    telephone: '01 23 45 67 89',
    email: 'jean.dupont@email.fr',
    adresse: '123 Rue de la Santé, 75014 Paris',
    medecinId: '1',
    createdAt: '2024-02-01'
  },
  {
    id: '2',
    nom: 'Martin',
    prenom: 'Marie',
    dateNaissance: '1982-09-22',
    sexe: 'F',
    telephone: '01 98 76 54 32',
    email: 'marie.martin@email.fr',
    adresse: '456 Avenue du Bien-être, 69001 Lyon',
    medecinId: '1',
    createdAt: '2024-02-03'
  },
  {
    id: '3',
    nom: 'Bernard',
    prenom: 'Pierre',
    dateNaissance: '1968-12-10',
    sexe: 'M',
    telephone: '04 56 78 90 12',
    medecinId: '2',
    createdAt: '2024-02-05'
  }
];

export const mockDiagnostics: Diagnostic[] = [
  {
    id: '1',
    patientId: '1',
    medecinId: '1',
    date: '2024-02-15',
    modeleUtilise: 'Vision Transformer v2.1',
    resultat: 1,
    probabilite: 0.87,
    imageUrl: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400',
    notes: 'Fibrose légère détectée'
  },
  {
    id: '2',
    patientId: '2',
    medecinId: '1',
    date: '2024-02-18',
    modeleUtilise: 'Vision Transformer v2.1',
    resultat: 0,
    probabilite: 0.92,
    imageUrl: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400',
    notes: 'Pas de fibrose détectée'
  },
  {
    id: '3',
    patientId: '3',
    medecinId: '2',
    date: '2024-02-20',
    modeleUtilise: 'Vision Transformer v2.0',
    resultat: 3,
    probabilite: 0.74,
    imageUrl: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400',
    notes: 'Fibrose sévère - suivi rapproché recommandé'
  }
];

export const mockStatistics: Statistics = {
  totalPatients: 156,
  totalDiagnostics: 342,
  repartitionFibrose: {
    0: 142,
    1: 89,
    2: 67,
    3: 32,
    4: 12
  },
  diagnosticsParMois: [
    { mois: 'Jan', count: 28 },
    { mois: 'Fév', count: 35 },
    { mois: 'Mar', count: 42 },
    { mois: 'Avr', count: 38 },
    { mois: 'Mai', count: 45 },
    { mois: 'Jun', count: 52 }
  ]
};