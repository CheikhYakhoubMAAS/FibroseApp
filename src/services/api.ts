const API_BASE_URL = 'http://localhost:8000/api';

// Types pour les réponses API
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Service d'authentification
export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de connexion' };
    }
  },

  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token invalide');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de récupération utilisateur' };
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};

// Service pour les patients
export const patientService = {
  async getPatients(search?: string): Promise<ApiResponse<any[]>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const url = new URL(`${API_BASE_URL}/patients/`);
      if (search) {
        url.searchParams.append('search', search);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des patients');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de récupération des patients' };
    }
  },

  async createPatient(patientData: any): Promise<ApiResponse<any>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création du patient');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de création du patient' };
    }
  },

  async updatePatient(id: number, patientData: any): Promise<ApiResponse<any>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la mise à jour du patient');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de mise à jour du patient' };
    }
  },

  async deletePatient(id: number): Promise<ApiResponse<void>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du patient');
      }

      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de suppression du patient' };
    }
  }
};

// Service pour les diagnostics
export const diagnosticService = {
  async getDiagnostics(patientId?: number, resultat?: number): Promise<ApiResponse<any[]>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const url = new URL(`${API_BASE_URL}/diagnostics/`);
      if (patientId) {
        url.searchParams.append('patient_id', patientId.toString());
      }
      if (resultat !== undefined) {
        url.searchParams.append('resultat', resultat.toString());
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des diagnostics');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de récupération des diagnostics' };
    }
  },

  async createDiagnostic(
    patientId: number,
    image: File,
    modeleUtilise: string = "Vision Transformer v2.1",
    notes?: string
  ): Promise<ApiResponse<any>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const formData = new FormData();
      formData.append('patient_id', patientId.toString());
      formData.append('modele_utilise', modeleUtilise);
      formData.append('image', image);
      if (notes) {
        formData.append('notes', notes);
      }

      const response = await fetch(`${API_BASE_URL}/diagnostics/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création du diagnostic');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de création du diagnostic' };
    }
  },

  async deleteDiagnostic(id: number): Promise<ApiResponse<void>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const response = await fetch(`${API_BASE_URL}/diagnostics/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du diagnostic');
      }

      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de suppression du diagnostic' };
    }
  }
};

// Service pour les statistiques
export const statsService = {
  async getStatistics(startDate?: string, endDate?: string, medecinId?: number): Promise<ApiResponse<any>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const url = new URL(`${API_BASE_URL}/stats/`);
      if (startDate) {
        url.searchParams.append('start_date', startDate);
      }
      if (endDate) {
        url.searchParams.append('end_date', endDate);
      }
      if (medecinId) {
        url.searchParams.append('medecin_id', medecinId.toString());
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de récupération des statistiques' };
    }
  },

  async getMedecinStats(): Promise<ApiResponse<any[]>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const response = await fetch(`${API_BASE_URL}/stats/medecins`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques médecins');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de récupération des statistiques médecins' };
    }
  },

  async getModelPerformance(): Promise<ApiResponse<any[]>> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token non trouvé');

      const response = await fetch(`${API_BASE_URL}/stats/performance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des performances des modèles');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Erreur de récupération des performances des modèles' };
    }
  }
}; 