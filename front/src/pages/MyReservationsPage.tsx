import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react";
import {
  getAllReservations,
  updateReservation,
  deleteReservation,
  type Reservation,
} from "../service/reservationService";
import { getRoomById, type Room as RoomType } from "../service/roomService";
import { CreateReservationModal } from "../components";

export const MyReservationsPage = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);

  // Buscar reservas do cliente ao carregar o componente
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const reservationsData = await getAllReservations();

      // Filtrar apenas as reservas do cliente logado
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clientReservations = reservationsData.filter(
        (reservation) => reservation.clientId === user.id
      );

      setReservations(clientReservations);
    } catch (err: any) {
      setError(
        "Erro ao carregar reservas: " + (err.message || "Erro desconhecido")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = () => {
    setEditingReservation(null);
    setIsModalOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleUpdateReservation = async (reservationData: any) => {
    try {
      setError("");
      if (editingReservation) {
        await updateReservation(editingReservation.id, reservationData);
      }
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

  const confirmDeleteReservation = async () => {
    if (reservationToDelete) {
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
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReservation(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getTypeLabel = (type: string) => {
    return type === "HOURLY" ? "Por Hora" : "Por Dia";
  };

  const getTypeColor = (type: string) => {
    return type === "HOURLY" ? "primary" : "secondary";
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando suas reservas...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Minhas Reservas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie suas reservas de quartos
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Botão de Nova Reserva */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleCreateReservation}
          sx={{ backgroundColor: "#1976d2" }}
        >
          Nova Reserva
        </Button>
      </Box>

      {/* Lista de Reservas */}
      {reservations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma reserva encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Você ainda não possui reservas. Que tal fazer sua primeira
              reserva?
            </Typography>
            <Button
              variant="contained"
              onClick={handleCreateReservation}
              sx={{ backgroundColor: "#1976d2" }}
            >
              Fazer Primeira Reserva
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quarto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Período</TableCell>
                <TableCell>Preço Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MapPin size={16} style={{ color: "#666" }} />
                      <Typography variant="body2">
                        Quarto #{reservation.roomId}
                      </Typography>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Calendar size={16} style={{ color: "#666" }} />
                      <Typography variant="body2">
                        {formatDateTime(reservation.startDate)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Clock size={16} style={{ color: "#666" }} />
                      <Typography variant="body2">
                        {formatDateTime(reservation.endDate)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DollarSign size={16} style={{ color: "#666" }} />
                      <Typography variant="body2" fontWeight="bold">
                        {formatPrice(reservation.totalPrice)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label="Ativa" color="success" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleEditReservation(reservation)}
                        color="primary"
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteReservation(reservation)}
                        color="error"
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
      )}

      {/* Modal de Edição/Criação */}
      <CreateReservationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleUpdateReservation}
        editingReservation={editingReservation}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Trash2 size={20} />
            Confirmar Exclusão
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza que deseja excluir esta reserva? Esta ação não pode ser
            desfeita.
          </Typography>
          {reservationToDelete && (
            <Box
              sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Reserva:</strong> Quarto #{reservationToDelete.roomId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Período:</strong>{" "}
                {formatDateTime(reservationToDelete.startDate)} -{" "}
                {formatDateTime(reservationToDelete.endDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Valor:</strong>{" "}
                {formatPrice(reservationToDelete.totalPrice)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={confirmDeleteReservation}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
