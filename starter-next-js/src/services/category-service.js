import axios from 'axios';

const API_URL = 'https://rezervy.io/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    console.log('🔄 Chargement des catégories...');
    const response = await api.get('/categories');
    console.log('📥 Catégories reçues:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors du chargement des catégories:', error);
    throw error;
  }
};

// Créer une catégorie
export const createCategory = async (data) => {
  try {
    console.log('📤 Création catégorie:', data);
    const response = await api.post('/categories', data);
    console.log('✅ Catégorie créée:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur création:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      errors: error.response?.data?.errors,
      fullData: error.response?.data,
    });
    throw error;
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (id, data) => {
  try {
    console.log(`📤 Modification catégorie #${id}:`, data);

    // Utiliser PUT au lieu de PATCH pour envoyer TOUTES les données
    const response = await api.put(`/categories/${id}`, data);

    console.log('✅ Catégorie modifiée - Réponse complète:', response.data);

    // Retourner les données mises à jour
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message,
      errors: error.response?.data?.errors,
    });
    throw error;
  }
};

// Supprimer une catégorie
export const deleteCategory = async (id) => {
  try {
    console.log(`🗑️ Suppression catégorie #${id}`);
    const response = await api.delete(`/categories/${id}`);
    console.log('✅ Catégorie supprimée');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
};
