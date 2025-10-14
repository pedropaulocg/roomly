import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Search, MapPin, Users, Eye } from "lucide-react";
import { BookRoomModal } from "../components";
import { getAllRooms, type Room as RoomType } from "../service/roomService";
import {
  createReservation,
  type CreateReservationData,
} from "../service/reservationService";

export const ClientReservationsPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");

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

  const handleViewRoom = (room: RoomType) => {
    navigate(`/room/${room.id}`);
  };

  const handleBookRoom = (room: RoomType) => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token) {
      // Redirecionar para login se não estiver logado
      window.location.href = "/login";
      return;
    }

    if (userType === "CLIENT") {
      // Redirecionar para página de reserva
      navigate(`/client/booking/${room.id}`);
      return;
    }

    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
  };

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      setError("");
      // Obter o ID do usuário logado do localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const reservationData: CreateReservationData = {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        type: bookingData.type,
        totalPrice: bookingData.totalPrice,
        clientId: user.id,
        roomId: selectedRoom?.id || 0,
      };

      await createReservation(reservationData);
      setIsBookingModalOpen(false);
      setSelectedRoom(null);
      // Opcional: mostrar mensagem de sucesso
    } catch (err: any) {
      setError(
        "Erro ao criar reserva: " + (err.message || "Erro desconhecido")
      );
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterBy === "low-price") {
      matchesFilter = room.pricePerHour < 100;
    } else if (filterBy === "high-capacity") {
      matchesFilter = room.capacity >= 10;
    } else if (filterBy === "medium-capacity") {
      matchesFilter = room.capacity >= 5 && room.capacity < 10;
    } else if (filterBy === "small-capacity") {
      matchesFilter = room.capacity < 5;
    }

    return matchesSearch && matchesFilter;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.pricePerHour - b.pricePerHour;
      case "price-high":
        return b.pricePerHour - a.pricePerHour;
      case "capacity":
        return b.capacity - a.capacity;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando quartos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Encontre o Espaço Perfeito
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reserve salas de reunião, coworking e espaços para eventos
        </Typography>

        {/* Banner de login */}
        {!localStorage.getItem("token") && (
          <Alert
            severity="info"
            sx={{ mt: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => (window.location.href = "/login")}
              >
                Fazer Login
              </Button>
            }
          >
            <Typography variant="body2">
              <strong>Faça login</strong> para reservar espaços e gerenciar suas
              reservas
            </Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Filtros e Busca */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <TextField
              fullWidth
              placeholder="Buscar por nome ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                label="Filtrar por"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="low-price">Preço Baixo</MenuItem>
                <MenuItem value="small-capacity">Pequena Capacidade</MenuItem>
                <MenuItem value="medium-capacity">Média Capacidade</MenuItem>
                <MenuItem value="high-capacity">Grande Capacidade</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Ordenar por"
              >
                <MenuItem value="name">Nome</MenuItem>
                <MenuItem value="price-low">Menor Preço</MenuItem>
                <MenuItem value="price-high">Maior Preço</MenuItem>
                <MenuItem value="capacity">Capacidade</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: "0 0 auto", minWidth: "150px" }}>
            <Typography variant="body2" color="text.secondary">
              {sortedRooms.length} espaços encontrados
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Grid de Acomodações */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {sortedRooms.map((room) => (
          <Box key={room.id} sx={{ flex: "1 1 300px", maxWidth: "400px" }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {room.name}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <MapPin size={16} style={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    {room.location}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Users size={16} style={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    Até {room.capacity} pessoas
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatPrice(room.pricePerHour)}/hora
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(room.pricePerDay)}/dia
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ gap: 1, p: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Eye size={16} />}
                  onClick={() => handleViewRoom(room)}
                  sx={{ flex: 1 }}
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleBookRoom(room)}
                  sx={{ flex: 1, backgroundColor: "#1976d2" }}
                >
                  Reservar
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {sortedRooms.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum espaço encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tente ajustar os filtros de busca
          </Typography>
        </Box>
      )}

      {/* Modal de Reserva */}
      <BookRoomModal
        open={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onSubmit={handleBookingSubmit}
        room={selectedRoom}
      />
    </Container>
  );
};
