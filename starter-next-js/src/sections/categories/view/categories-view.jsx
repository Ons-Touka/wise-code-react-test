'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import DialogContentText from '@mui/material/DialogContentText';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from 'src/services/category-service';

// ----------------------------------------------------------------------

export function CategoriesView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal Créer/Modifier
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    order: 0,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Modal Suppression
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // États pour les erreurs de validation
  const [fieldErrors, setFieldErrors] = useState({});

  // Notification
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Flag pour éviter les doubles chargements en développement
  const hasLoadedRef = useRef(false);

  // Charger les catégories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      console.log('📥 Données reçues de l\'API:', response);

      // Extraire le tableau de catégories selon la structure de la réponse
      const categoriesData = Array.isArray(response) ? response :
                            response.data ? response.data :
                            response.categories ? response.categories : [];

      console.log('📋 Catégories extraites:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      showNotification('Erreur lors du chargement des catégories', 'error');
      console.error('❌ Erreur fetchCategories:', error);
    } finally {
      setLoading(false);
    }
  }, []); // ← Dépendances vides pour éviter les re-créations

  useEffect(() => {
    // Éviter le double chargement en développement (React StrictMode)
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    fetchCategories();
  }, [fetchCategories]);

  // Afficher une notification
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Ouvrir le modal créer/modifier
  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        slug: category.slug || '',
        order: category.display_order || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        slug: '',
        order: 0,
      });
    }
    setFieldErrors({}); // Reset des erreurs
    setOpenModal(true);
  };

  // Fermer le modal créer/modifier
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCategory(null);
    setFieldErrors({});
    setFormData({
      name: '',
      description: '',
      slug: '',
      order: 0,
    });
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFieldErrors({}); // Reset des erreurs avant soumission

    try {
      // Préparer les données
      const cleanData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        display_order: parseInt(formData.order, 10) || 0,
      };

      // ⚠️ IMPORTANT : Le slug est OBLIGATOIRE pour la modification
      // Si vide, utiliser le nom en minuscules sans espaces
      if (editingCategory) {
        // Mode modification : slug obligatoire
        cleanData.slug = formData.slug?.trim() || formData.name.trim().toLowerCase().replace(/\s+/g, '-');
      } else {
        // Mode création : slug optionnel (l'API peut le générer)
        if (formData.slug?.trim()) {
          cleanData.slug = formData.slug.trim();
        }
      }

      console.log('📤 Données envoyées:', cleanData);

      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, cleanData);
        console.log('✅ Réponse modification:', result);
        showNotification('Catégorie modifiée avec succès');
      } else {
        result = await createCategory(cleanData);
        console.log('✅ Réponse création:', result);
        showNotification('Catégorie créée avec succès');
      }

      handleCloseModal();

      // Rafraîchir la liste après un court délai
      setTimeout(() => {
        fetchCategories();
      }, 300);

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      console.error('❌ Réponse:', error.response?.data);

      // Gérer les différents types d'erreurs
      let errorMessage = 'Erreur lors de l\'opération';

      if (error.response?.data) {
        const errorData = error.response.data;

        // Cas 1 : Message d'erreur direct
        if (errorData.message) {
          errorMessage = errorData.message;
        }

        // Cas 2 : Erreurs de validation multiples
        if (errorData.errors && typeof errorData.errors === 'object') {
          const errors = {};
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            // Extraire le premier message d'erreur
            const message = Array.isArray(messages) ? messages[0] : messages;

            // Traduire les messages en français
            let translatedMessage = message;
            if (message.includes('has already been taken')) {
              const fieldName = field === 'slug' ? 'Le slug' : field === 'name' ? 'Le nom' : 'Ce champ';
              translatedMessage = `${fieldName} est déjà utilisé`;
            } else if (message.includes('is required')) {
              const fieldName = field === 'slug' ? 'Le slug' : field === 'name' ? 'Le nom' : 'Ce champ';
              translatedMessage = `${fieldName} est obligatoire`;
            }

            errors[field] = translatedMessage;
          });

          setFieldErrors(errors);

          // Message récapitulatif pour la notification
          const errorList = Object.values(errors).join('\n');
          errorMessage = errorList;
        }
      }

      showNotification(errorMessage, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Ouvrir le dialog de suppression
  const handleOpenDeleteDialog = (category) => {
    setDeleteDialog({ open: true, category });
  };

  // Fermer le dialog de suppression
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, category: null });
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!deleteDialog.category) return;

    setDeleteLoading(true);
    try {
      await deleteCategory(deleteDialog.category.id);
      showNotification('Catégorie supprimée avec succès');
      handleCloseDeleteDialog();

      // Rafraîchir la liste après suppression
      setTimeout(() => {
        fetchCategories();
      }, 200);
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Erreur lors de la suppression',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardContent>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Gestion des Catégories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleOpenModal()}
        >
          Ajouter une catégorie
        </Button>
      </Box>

      {/* Table */}
      <Card>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Box p={5} textAlign="center">
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune catégorie
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Commencez par créer votre première catégorie
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell align="center">Ordre</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{category.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {category.description || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            {category.slug || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {category.display_order ?? 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenModal(category)}
                          >
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(category)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              page={page}
              component="div"
              count={categories.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Card>

      {/* Modal Créer/Modifier */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Nom de la catégorie *"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (fieldErrors.name) {
                  setFieldErrors({ ...fieldErrors, name: '' });
                }
              }}
              required
              margin="normal"
              error={!!fieldErrors.name}
              helperText={fieldErrors.name || ''}
            />
            <TextField
              fullWidth
              label="Description (optionnel)"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (fieldErrors.description) {
                  setFieldErrors({ ...fieldErrors, description: '' });
                }
              }}
              multiline
              rows={3}
              margin="normal"
              error={!!fieldErrors.description}
              helperText={fieldErrors.description || ''}
            />
            <TextField
              fullWidth
              label={editingCategory ? "Slug *" : "Slug (optionnel)"}
              value={formData.slug}
              onChange={(e) => {
                setFormData({ ...formData, slug: e.target.value });
                if (fieldErrors.slug) {
                  setFieldErrors({ ...fieldErrors, slug: '' });
                }
              }}
              required={!!editingCategory}
              margin="normal"
              error={!!fieldErrors.slug}
              helperText={
                fieldErrors.slug
                  ? fieldErrors.slug
                  : editingCategory
                    ? "Le slug est obligatoire"
                    : "Ex: ma-categorie (laissez vide pour génération auto)"
              }
            />
            <TextField
              fullWidth
              type="number"
              label="Ordre d'affichage"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              inputProps={{ min: 0 }}
              margin="normal"
              helperText="L'ordre d'affichage des catégories (0 = premier)"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} disabled={formLoading}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" disabled={formLoading}>
              {formLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Chargement...
                </>
              ) : (
                editingCategory ? 'Modifier' : 'Créer'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Confirmation de Suppression */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Iconify icon="solar:trash-bin-trash-bold" width={24} color="error.main" />
            <Typography variant="h6">Confirmer la suppression</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la catégorie{' '}
            <strong>"{deleteDialog.category?.name}"</strong> ?
          </DialogContentText>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Cette action est irréversible et supprimera définitivement cette catégorie.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <Iconify icon="solar:trash-bin-trash-bold" />}
          >
            {deleteLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
