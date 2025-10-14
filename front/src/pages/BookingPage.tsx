import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  MapPin,
  Users,
} from "lucide-react";
import { getRoomById, type Room as RoomType } from "../service/roomService";
import {
  createReservation,
  type CreateReservationData,
} from "../service/reservationService";

interface BookingData {
  roomId: number;
  type: "HOURLY" | "DAILY";
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  paymentMethod: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  observations: string;
}

export const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState<BookingData>({
    roomId: 0,
    type: "HOURLY",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    totalPrice: 0,
    paymentMethod: "credit",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    observations: "",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

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
      setBookingData((prev) => ({ ...prev, roomId: roomData.id }));
    } catch (err: any) {
      setError(
        "Erro ao carregar quarto: " + (err.error || "Erro desconhecido")
      );
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "CLIENT") {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    if (!room || !bookingData.startDate) return 0;

    if (bookingData.type === "HOURLY") {
      if (!bookingData.startTime || !bookingData.endTime) return 0;

      const startDateTime = new Date(
        `${bookingData.startDate}T${bookingData.startTime}`
      );
      const endDateTime = new Date(
        `${bookingData.startDate}T${bookingData.endTime}`
      );

      const hours =
        (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      return hours * room.pricePerHour;
    } else {
      if (!bookingData.endDate) return 0;

      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);

      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return days * room.pricePerDay;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getDuration = () => {
    if (!bookingData.startDate) return "";

    if (bookingData.type === "HOURLY") {
      if (!bookingData.startTime || !bookingData.endTime) return "";

      const startDateTime = new Date(
        `${bookingData.startDate}T${bookingData.startTime}`
      );
      const endDateTime = new Date(
        `${bookingData.startDate}T${bookingData.endTime}`
      );

      const hours =
        (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      return `${hours} horas`;
    } else {
      if (!bookingData.endDate) return "";

      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);

      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${days} dias`;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Obter o ID do usuário logado do localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Combinar data e hora para criar datetime
      let startDateTime: Date;
      let endDateTime: Date;

      if (bookingData.type === "HOURLY") {
        startDateTime = new Date(
          `${bookingData.startDate}T${bookingData.startTime}`
        );
        endDateTime = new Date(
          `${bookingData.startDate}T${bookingData.endTime}`
        );
      } else {
        startDateTime = new Date(bookingData.startDate);
        endDateTime = new Date(bookingData.endDate);
      }

      const reservationData: CreateReservationData = {
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        type: bookingData.type,
        totalPrice: calculateTotal(),
        clientId: user.id,
        roomId: room?.id || 0,
      };

      await createReservation(reservationData);
      setBookingConfirmed(true);
    } catch (err: any) {
      setError(
        "Erro ao criar reserva: " + (err.message || "Erro desconhecido")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    "Selecionar Data e Horário",
    "Observações",
    "Pagamento",
    "Confirmar",
  ];

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

  if (bookingConfirmed) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CheckCircle
            size={80}
            style={{ color: "#4caf50", marginBottom: 24 }}
          />
          <Typography variant="h4" color="success.main" gutterBottom>
            Reserva Confirmada!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sua reserva foi realizada com sucesso. Você receberá um email de
            confirmação em breve.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Ver Outros Espaços
            </Button>
            <Button variant="contained" onClick={() => navigate("/client")}>
              Minhas Reservas
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" gutterBottom>
          Finalizar Reserva
        </Typography>
      </Box>

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
        {/* Coluna da Esquerda - Formulário */}
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          <Card>
            <CardContent>
              {/* Stepper */}
              <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1: Selecionar Data */}
              {currentStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <Calendar
                      size={20}
                      style={{ marginRight: 8, verticalAlign: "middle" }}
                    />
                    Selecionar Data
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 3,
                    }}
                  >
                    <Box sx={{ flex: { xs: 1, md: 1 } }}>
                      <FormControl fullWidth>
                        <InputLabel>Tipo de Reserva</InputLabel>
                        <Select
                          value={bookingData.type}
                          onChange={(e) =>
                            handleInputChange("type", e.target.value)
                          }
                          label="Tipo de Reserva"
                        >
                          <MenuItem value="HOURLY">Por Hora</MenuItem>
                          <MenuItem value="DAILY">Por Dia</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {bookingData.type === "HOURLY" ? (
                      <>
                        <Box sx={{ flex: { xs: 1, md: 1 } }}>
                          <TextField
                            fullWidth
                            label="Data"
                            type="date"
                            value={bookingData.startDate}
                            onChange={(e) =>
                              handleInputChange("startDate", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box sx={{ flex: { xs: 1, md: 1 } }}>
                          <TextField
                            fullWidth
                            label="Horário de Início"
                            type="time"
                            value={bookingData.startTime}
                            onChange={(e) =>
                              handleInputChange("startTime", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box sx={{ flex: { xs: 1, md: 1 } }}>
                          <TextField
                            fullWidth
                            label="Horário de Fim"
                            type="time"
                            value={bookingData.endTime}
                            onChange={(e) =>
                              handleInputChange("endTime", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{ flex: { xs: 1, md: 1 } }}>
                          <TextField
                            fullWidth
                            label="Data de Início"
                            type="date"
                            value={bookingData.startDate}
                            onChange={(e) =>
                              handleInputChange("startDate", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box sx={{ flex: { xs: 1, md: 1 } }}>
                          <TextField
                            fullWidth
                            label="Data de Fim"
                            type="date"
                            value={bookingData.endDate}
                            onChange={(e) =>
                              handleInputChange("endDate", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              )}

              {/* Step 2: Observações */}
              {currentStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <Clock
                      size={20}
                      style={{ marginRight: 8, verticalAlign: "middle" }}
                    />
                    Observações Adicionais
                  </Typography>

                  <Box>
                    <TextField
                      fullWidth
                      label="Observações (opcional)"
                      multiline
                      rows={4}
                      value={bookingData.observations}
                      onChange={(e) =>
                        handleInputChange("observations", e.target.value)
                      }
                      placeholder="Alguma observação especial para sua reserva? Informações sobre o evento, necessidades especiais, etc."
                    />
                  </Box>
                </Box>
              )}

              {/* Step 3: Pagamento */}
              {currentStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <CreditCard
                      size={20}
                      style={{ marginRight: 8, verticalAlign: "middle" }}
                    />
                    Informações de Pagamento
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    <Box>
                      <FormControl fullWidth>
                        <InputLabel>Método de Pagamento</InputLabel>
                        <Select
                          value={bookingData.paymentMethod}
                          onChange={(e) =>
                            handleInputChange("paymentMethod", e.target.value)
                          }
                          label="Método de Pagamento"
                        >
                          <MenuItem value="credit">Cartão de Crédito</MenuItem>
                          <MenuItem value="debit">Cartão de Débito</MenuItem>
                          <MenuItem value="pix">PIX</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {bookingData.paymentMethod !== "pix" && (
                      <>
                        <Box>
                          <TextField
                            fullWidth
                            label="Número do Cartão"
                            value={bookingData.cardNumber}
                            onChange={(e) =>
                              handleInputChange("cardNumber", e.target.value)
                            }
                            placeholder="1234 5678 9012 3456"
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 3,
                          }}
                        >
                          <Box sx={{ flex: { xs: 1, md: 2 } }}>
                            <TextField
                              fullWidth
                              label="Nome no Cartão"
                              value={bookingData.cardName}
                              onChange={(e) =>
                                handleInputChange("cardName", e.target.value)
                              }
                            />
                          </Box>
                          <Box sx={{ flex: { xs: 1, md: 1 } }}>
                            <TextField
                              fullWidth
                              label="Validade"
                              value={bookingData.cardExpiry}
                              onChange={(e) =>
                                handleInputChange("cardExpiry", e.target.value)
                              }
                              placeholder="MM/AA"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: 1, md: 1 } }}>
                            <TextField
                              fullWidth
                              label="CVV"
                              value={bookingData.cardCvv}
                              onChange={(e) =>
                                handleInputChange("cardCvv", e.target.value)
                              }
                              placeholder="123"
                            />
                          </Box>
                        </Box>
                      </>
                    )}

                    {bookingData.paymentMethod === "pix" && (
                      <Box>
                        <Alert severity="info">
                          <Typography variant="body2">
                            <strong>PIX:</strong> Você receberá o QR Code para
                            pagamento após confirmar a reserva.
                          </Typography>
                        </Alert>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* Step 4: Confirmar */}
              {currentStep === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <CheckCircle
                      size={20}
                      style={{ marginRight: 8, verticalAlign: "middle" }}
                    />
                    Confirmar Reserva
                  </Typography>

                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Importante:</strong> Ao confirmar, você será
                      cobrado imediatamente. Cancelamentos são gratuitos até 24h
                      antes da reserva.
                    </Typography>
                  </Alert>

                  <Typography variant="body1" color="text.secondary">
                    Verifique todas as informações antes de confirmar sua
                    reserva.
                  </Typography>
                </Box>
              )}

              {/* Navegação */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button onClick={handlePrevStep} disabled={currentStep === 0}>
                  Anterior
                </Button>
                <Button
                  variant="contained"
                  onClick={
                    currentStep === 3 ? handleConfirmBooking : handleNextStep
                  }
                  disabled={isLoading}
                  sx={{ backgroundColor: "#1976d2" }}
                >
                  {isLoading
                    ? "Processando..."
                    : currentStep === 3
                    ? "Confirmar Reserva"
                    : "Próximo"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Coluna da Direita - Resumo */}
        <Box sx={{ flex: { xs: 1, md: 1 } }}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo da Reserva
              </Typography>

              {/* Informações do Espaço */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {room.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <MapPin size={14} style={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    {room.location}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Users size={14} style={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    Até {room.capacity} pessoas
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Detalhes da Reserva */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Período
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {bookingData.type === "HOURLY"
                    ? bookingData.startDate &&
                      bookingData.startTime &&
                      bookingData.endTime
                      ? `${new Date(bookingData.startDate).toLocaleDateString(
                          "pt-BR"
                        )} - ${bookingData.startTime} às ${bookingData.endTime}`
                      : "Selecione a data e horários"
                    : bookingData.startDate && bookingData.endDate
                    ? `${new Date(bookingData.startDate).toLocaleDateString(
                        "pt-BR"
                      )} - ${new Date(bookingData.endDate).toLocaleDateString(
                        "pt-BR"
                      )}`
                    : "Selecione as datas"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Duração
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {getDuration() || "Selecione as datas"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tipo
                </Typography>
                <Chip
                  label={bookingData.type === "HOURLY" ? "Por Hora" : "Por Dia"}
                  color="primary"
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Preço Total */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {formatPrice(calculateTotal())}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center" }}
              >
                Cancelamento gratuito até 24h antes
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};
