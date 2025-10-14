import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Wifi,
  Coffee,
  Car,
  Printer,
  Monitor,
} from "lucide-react";
import { BookRoomModal } from "../components";
import { getRoomById, type Room as RoomType } from "../service/roomService";
import {
  createReservation,
  type CreateReservationData,
} from "../service/reservationService";

export const RoomDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Buscar quarto por ID
  useEffect(() => {
    if (id) {
      loadRoom();
    }
  }, [id]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      setError("");
      const roomData = await getRoomById(parseInt(id!));
      setRoom(roomData);
    } catch (err: any) {
      setError(
        "Erro ao carregar quarto: " + (err.message || "Erro desconhecido")
      );
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = () => {
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
      navigate(`/client/booking/${room?.id}`);
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
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
        roomId: room?.id || 0,
      };

      await createReservation(reservationData);
      setIsBookingModalOpen(false);
      // Opcional: mostrar mensagem de sucesso
    } catch (err: any) {
      setError(
        "Erro ao criar reserva: " + (err.message || "Erro desconhecido")
      );
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Gerar dados mockados baseados no quarto
  const getMockDescription = (room: RoomType) => {
    const descriptions = [
      `Sala moderna e equipada para reuniões importantes, com tecnologia de ponta e ambiente profissional. Ideal para apresentações, reuniões executivas e eventos corporativos.`,
      `Ambiente colaborativo com infraestrutura completa para equipes criativas. Espaço amplo e iluminado, perfeito para trabalho em equipe e brainstorming.`,
      `Ideal para workshops e treinamentos corporativos. Sala ampla com equipamentos de áudio e vídeo de alta qualidade para apresentações.`,
      `Espaço aconchegante e funcional, perfeito para reuniões pequenas e apresentações íntimas. Ambiente silencioso e bem iluminado.`,
      `Sala de conferência com tecnologia de ponta, ideal para videoconferências e reuniões importantes. Equipamentos de última geração.`,
    ];
    return descriptions[room.id % descriptions.length];
  };

  const getMockAmenities = (room: RoomType) => {
    const allAmenities = [
      "Wi-Fi",
      "Projetor",
      "Ar Condicionado",
      "Café",
      "Estacionamento",
      "Impressora",
      "Flipchart",
      "Videoconferência",
      "Quadro Branco",
      "Música Ambiente",
    ];

    // Retornar 3-5 amenidades aleatórias baseadas no ID do quarto
    const numAmenities = 3 + (room.id % 3);
    const shuffled = allAmenities.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numAmenities);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wi-fi":
        return <Wifi size={16} />;
      case "café":
        return <Coffee size={16} />;
      case "estacionamento":
        return <Car size={16} />;
      case "impressora":
        return <Printer size={16} />;
      case "projetor":
      case "videoconferência":
        return <Monitor size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando detalhes do quarto...
        </Typography>
      </Container>
    );
  }

  if (!room) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h4" color="text.secondary">
            Quarto não encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            O quarto que você está procurando não existe ou foi removido.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 3 }}
          >
            Voltar para Quartos
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header com navegação */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate("/")}
          sx={{ mb: 2 }}
        >
          Voltar para Espaços
        </Button>
      </Box>

      {/* Banner de login para usuários não logados */}
      {!localStorage.getItem("token") && (
        <Alert
          severity="info"
          sx={{ mb: 4 }}
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
            <strong>Faça login</strong> para reservar este quarto
          </Typography>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Coluna da Esquerda - Informações */}
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {room.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MapPin size={16} style={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    {room.location}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Users size={16} style={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    Até {room.capacity} pessoas
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {getMockDescription(room)}
              </Typography>
            </CardContent>
          </Card>

          {/* Amenidades */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Amenidades
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {getMockAmenities(room).map((amenity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {getAmenityIcon(amenity)}
                    <Typography variant="body2">{amenity}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Coluna da Direita - Preços e Reserva */}
        <Box sx={{ flex: { xs: 1, md: 1 } }}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Preços
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Por hora:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(room.pricePerHour)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Por dia:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(room.pricePerDay)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleBookRoom}
                sx={{
                  backgroundColor: "#1976d2",
                  py: 1.5,
                  mb: 2,
                }}
              >
                <Calendar size={20} style={{ marginRight: 8 }} />
                Reservar Agora
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Cancelamento gratuito até 24h antes
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Modal de Reserva */}
      <BookRoomModal
        open={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onSubmit={handleBookingSubmit}
        room={room}
      />
    </Container>
  );
};
