import { useState, useEffect } from "react";
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
} from "@mui/material";
import { Plus, Building2, Edit, Trash2, X } from "lucide-react";
import { CreateRoomModal } from "../components/CreateRoomModal";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  type Room,
  type CreateRoomData,
} from "../service/roomService";

export const RoomListOwner = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Buscar quartos ao carregar o componente
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const roomsData = await getAllRooms();
      setRooms(roomsData);
    } catch (err: any) {
      setError(
        "Erro ao carregar quartos: " + (err.message || "Erro desconhecido")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (roomData: any) => {
    try {
      setError("");
      // Obter o ID do usuário logado do localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const createData: CreateRoomData = {
        ...roomData,
        ownerId: user.id,
      };

      await createRoom(createData);
      setIsModalOpen(false);
      loadRooms(); // Recarregar a lista
    } catch (err: any) {
      setError("Erro ao criar quarto: " + (err.message || "Erro desconhecido"));
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsEditModalOpen(true);
  };

  const handleUpdateRoom = async (roomData: any) => {
    if (!editingRoom) return;

    try {
      setError("");
      const updateData = {
        ...roomData,
        ownerId: editingRoom.ownerId,
      };

      await updateRoom(editingRoom.id, updateData);
      setIsEditModalOpen(false);
      setEditingRoom(null);
      loadRooms(); // Recarregar a lista
    } catch (err: any) {
      setError(
        "Erro ao atualizar quarto: " + (err.message || "Erro desconhecido")
      );
    }
  };

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      setError("");
      await deleteRoom(roomToDelete.id);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
      loadRooms(); // Recarregar a lista
    } catch (err: any) {
      setError(
        "Erro ao excluir quarto: " + (err.message || "Erro desconhecido")
      );
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando quartos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciar Quartos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          sx={{ backgroundColor: "#1976d2" }}
          onClick={handleOpenModal}
        >
          Adicionar Quarto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* Lista de quartos */}
        {rooms.map((room) => (
          <Card key={room.id} sx={{ width: "300px", height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Building2 size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h2">
                  {room.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Capacidade: {room.capacity} pessoas
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Localização: {room.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Preço/hora: R$ {room.pricePerHour.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preço/dia: R$ {room.pricePerDay.toFixed(2)}
              </Typography>
              {room.photo && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={room.photo}
                    alt={room.name}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit size={16} />}
                  onClick={() => handleEditRoom(room)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<Trash2 size={16} />}
                  onClick={() => handleDeleteRoom(room)}
                >
                  Excluir
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Card vazio para adicionar novo quarto */}
        <Card
          sx={{
            width: "300px",
            height: "100%",
            border: "2px dashed #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#1976d2",
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
          onClick={handleOpenModal}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Plus size={48} style={{ color: "#ccc", marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary">
              Adicionar Novo Quarto
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Modal para criar quarto */}
      <CreateRoomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRoom}
      />

      {/* Modal para editar quarto */}
      <CreateRoomModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRoom(null);
        }}
        onSubmit={handleUpdateRoom}
        initialData={
          editingRoom
            ? {
                name: editingRoom.name,
                capacity: editingRoom.capacity,
                location: editingRoom.location,
                pricePerHour: editingRoom.pricePerHour,
                pricePerDay: editingRoom.pricePerDay,
                photo: editingRoom.photo,
              }
            : null
        }
      />

      {/* Dialog de confirmação para exclusão */}
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
            Tem certeza que deseja excluir o quarto "{roomToDelete?.name}"? Esta
            ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteRoom} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
