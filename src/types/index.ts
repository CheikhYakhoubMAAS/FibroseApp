export interface User {
  id: string;
  nom: string;
  email: string;
  role: 'medecin' | 'admin' | 'super-admin';
  createdAt: string;
}

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  telephone?: string;
  email?: string;
  adresse?: string;
  medecinId: string;
  createdAt: string;
}

export interface Diagnostic {
  id: string;
  patientId: string;
  medecinId: string;
  date: string;
  modeleUtilise: string;
  resultat: 0 | 1 | 2 | 3 | 4; // Stade de fibrose
  probabilite: number;
  imageUrl: string;
  notes?: string;
}

export interface Statistics {
  totalPatients: number;
  totalDiagnostics: number;
  repartitionFibrose: Record<number, number>;
  diagnosticsParMois: Array<{ mois: string; count: number }>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}