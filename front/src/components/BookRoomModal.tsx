import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { X, Calendar, Clock, Users, MapPin, Star } from "lucide-react";

interface BookRoomModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => void;
  room: any;
}

interface BookingFormData {
  startDate: string;
  endDate: string;
  type: "HOURLY" | "DAILY";
  totalPrice: number;
  notes: string;
}

export const BookRoomModal = ({
  open,
  onClose,
  onSubmit,
  room,
}: BookRoomModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: "",
    endDate: "",
    type: "HOURLY",
    totalPrice: 0,
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  const steps = ["Selecionar Data", "Confirmar Reserva"];

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setFormData({
        startDate: "",
        endDate: "",
        type: "HOURLY",
        totalPrice: 0,
        notes: "",
      });
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (
    field: keyof BookingFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Calcular preço automaticamente
    if (field === "startDate" || field === "endDate" || field === "type") {
      calculatePrice();
    }
  };

  const calculatePrice = () => {
    if (!formData.startDate || !formData.endDate || !room) {
      setFormData((prev) => ({ ...prev, totalPrice: 0 }));
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    let price = 0;
    if (formData.type === "HOURLY") {
      const hours =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      price = hours * room.pricePerHour;
    } else {
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      price = days * room.pricePerDay;
    }

    setFormData((prev) => ({ ...prev, totalPrice: price }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<BookingFormData> = {};

    if (step === 0) {
      if (!formData.startDate) {
        newErrors.startDate = "Data de início é obrigatória";
      }

      if (!formData.endDate) {
        newErrors.endDate = "Data de fim é obrigatória";
      }

      if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        if (endDate <= startDate) {
          newErrors.endDate = "Data de fim deve ser posterior à data de início";
        }

        // Verificar se a data não é no passado
        const now = new Date();
        if (startDate < now) {
          newErrors.startDate = "Data de início não pode ser no passado";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormData({
      startDate: "",
      endDate: "",
      type: "HOURLY",
      totalPrice: 0,
      notes: "",
    });
    setErrors({});
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return "";

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (formData.type === "HOURLY") {
      const hours =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      return `${hours} horas`;
    } else {
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${days} dias`;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Reservar Espaço</Typography>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Informações do Espaço */}
            {room && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
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
                    <MapPin size={16} style={{ color: "#666" }} />
                    <Typography variant="body2" color="text.secondary">
                      {room.location}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Users size={16} style={{ color: "#666" }} />
                    <Typography variant="body2" color="text.secondary">
                      Até {room.capacity} pessoas
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Star size={16} style={{ color: "#ffc107" }} />
                    <Typography variant="body2" color="text.secondary">
                      {room.rating} ({room.reviews} avaliações)
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">
                      <strong>Por hora:</strong>{" "}
                      {formatPrice(room.pricePerHour)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Por dia:</strong> {formatPrice(room.pricePerDay)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Tipo de Reserva */}
            <FormControl fullWidth>
              <InputLabel>Tipo de Reserva</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) =>
                  handleInputChange(
                    "type",
                    e.target.value as "HOURLY" | "DAILY"
                  )
                }
                label="Tipo de Reserva"
              >
                <MenuItem value="HOURLY">Por Hora</MenuItem>
                <MenuItem value="DAILY">Por Dia</MenuItem>
              </Select>
            </FormControl>

            {/* Data de Início */}
            <TextField
              label="Data de Início"
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              error={!!errors.startDate}
              helperText={errors.startDate}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {/* Data de Fim */}
            <TextField
              label="Data de Fim"
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              error={!!errors.endDate}
              helperText={errors.endDate}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {/* Observações */}
            <TextField
              label="Observações (opcional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              fullWidth
              placeholder="Informações adicionais sobre sua reserva..."
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Resumo da Reserva */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumo da Reserva
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Espaço:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {room?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Período:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatDate(formData.startDate)} -{" "}
                    {formatDate(formData.endDate)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Duração:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {getDuration()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Tipo:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formData.type === "HOURLY" ? "Por Hora" : "Por Dia"}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(formData.totalPrice)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Termos e Condições */}
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Termos e Condições:</strong>
                <br />
                • Cancelamento gratuito até 24h antes da reserva
                <br />
                • Pagamento na entrada do espaço
                <br />• Respeite o horário de início e fim da reserva
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} variant="outlined">
            Voltar
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            sx={{ backgroundColor: "#1976d2" }}
          >
            Próximo
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: "#1976d2" }}
          >
            Confirmar Reserva
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

