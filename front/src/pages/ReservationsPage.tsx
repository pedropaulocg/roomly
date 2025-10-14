import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Plus, Edit, Trash2, Calendar, User, Building2, X } from "lucide-react";
import { CreateReservationModal } from "../components/CreateReservationModal";
import {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  type Reservation,
  type CreateReservationData,
} from "../service/reservationService";

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);

  // Buscar reservas ao carregar o componente
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const reservationsData = await getAllReservations();
      setReservations(reservationsData);
    } catch (err: any) {
      setError(
        "Erro ao carregar reservas: " + (err.message || "Erro desconhecido")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = async (reservationData: any) => {
    try {
      setError("");
      await createReservation(reservationData);
      setIsModalOpen(false);
      loadReservations(); // Recarregar a lista
    } catch (err: any) {
      setError(
        "Erro ao criar reserva: " + (err.message || "Erro desconhecido")
      );
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleUpdateReservation = async (reservationData: any) => {
    if (!editingReservation) return;

    try {
      setError("");
      await updateReservation(editingReservation.id, reservationData);
      setIsModalOpen(false);
      setEditingReservation(null);
      loadReservations(); // Recarregar a lista
    } catch (err: any) {
      setError(
        "Erro ao atualizar reserva: " + (err.message || "Erro desconhecido")
      );
    }
  };

  const handleDeleteReservation = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!reservationToDelete) return;

    try {
      setError("");
      await deleteReservation(reservationToDelete.id);
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
      loadReservations(); // Recarregar a lista
    } catch (err: any) {
      setError(
        "Erro ao excluir reserva: " + (err.message || "Erro desconhecido")
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    return type === "HOURLY" ? "primary" : "secondary";
  };

  const getTypeLabel = (type: string) => {
    return type === "HOURLY" ? "Por Hora" : "Por Dia";
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando reservas...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciar Reservas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          sx={{ backgroundColor: "#1976d2" }}
          onClick={() => setIsModalOpen(true)}
        >
          Nova Reserva
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Quarto</TableCell>
                  <TableCell>Data Início</TableCell>
                  <TableCell>Data Fim</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Preço Total</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.id}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <User size={16} />
                        {reservation.clientName}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Building2 size={16} />
                        {reservation.roomName}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Calendar size={16} />
                        {formatDate(reservation.startDate)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Calendar size={16} />
                        {formatDate(reservation.endDate)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(reservation.type)}
                        color={getTypeColor(reservation.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatPrice(reservation.totalPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditReservation(reservation)}
                          sx={{ color: "#1976d2" }}
                        >
                          <Edit size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteReservation(reservation)}
                          sx={{ color: "#d32f2f" }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {reservations.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Nenhuma reserva encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Clique em "Nova Reserva" para criar a primeira reserva
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modal para criar/editar reserva */}
      <CreateReservationModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReservation(null);
        }}
        onSubmit={
          editingReservation ? handleUpdateReservation : handleCreateReservation
        }
        editingReservation={editingReservation}
      />

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Confirmar Exclusão
            <IconButton onClick={() => setDeleteDialogOpen(false)} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a reserva #{reservationToDelete?.id}?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
