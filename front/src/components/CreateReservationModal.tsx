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
  CircularProgress,
} from "@mui/material";
import { X, User, Building2 } from "lucide-react";
import { getAllUsers, type User as UserType } from "../service/userService";
import { getAllRooms, type Room } from "../service/roomService";

interface CreateReservationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reservationData: ReservationFormData) => void;
  editingReservation?: ReservationFormData | null;
}

interface ReservationFormData {
  startDate: string;
  endDate: string;
  type: "HOURLY" | "DAILY";
  totalPrice: number;
  clientId: number;
  roomId: number;
}

export const CreateReservationModal = ({
  open,
  onClose,
  onSubmit,
  editingReservation,
}: CreateReservationModalProps) => {
  const [formData, setFormData] = useState<ReservationFormData>({
    startDate: "",
    endDate: "",
    type: "HOURLY",
    totalPrice: 0,
    clientId: 0,
    roomId: 0,
  });

  const [errors, setErrors] = useState<Partial<ReservationFormData>>({});
  const [priceError, setPriceError] = useState<string>("");
  const [clients, setClients] = useState<UserType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verificar se o usuário é um cliente
  const userType = localStorage.getItem("userType");
  const isClient = userType === "CLIENT";

  // Carregar dados quando o modal abrir
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  // Carregar dados iniciais quando o modal abrir para edição
  useEffect(() => {
    if (open && editingReservation) {
      setFormData(editingReservation);
    } else if (open && !editingReservation) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setFormData({
        startDate: "",
        endDate: "",
        type: "HOURLY",
        totalPrice: 0,
        clientId: isClient ? user.id : 0,
        roomId: 0,
      });
    }
    setErrors({});
    setPriceError("");
    setError("");
  }, [open, editingReservation, isClient]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (isClient) {
        // Se for cliente, carregar apenas quartos
        const roomsData = await getAllRooms();
        setRooms(roomsData);

        // Definir o clientId como o ID do usuário logado
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setFormData((prev) => ({ ...prev, clientId: user.id }));
      } else {
        // Se for owner, carregar clientes e quartos
        const [clientsData, roomsData] = await Promise.all([
          getAllUsers(),
          getAllRooms(),
        ]);

        // Filtrar apenas clientes (role: CLIENT)
        const clientUsers = clientsData.filter(
          (user) => user.role === "CLIENT"
        );
        setClients(clientUsers);
        setRooms(roomsData);
      }
    } catch (err: any) {
      setError(
        "Erro ao carregar dados: " + (err.message || "Erro desconhecido")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ReservationFormData,
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
    if (
      field === "startDate" ||
      field === "endDate" ||
      field === "type" ||
      field === "roomId"
    ) {
      calculatePrice();
    }
  };

  const calculatePrice = () => {
    if (!formData.startDate || !formData.endDate || !formData.roomId) {
      setFormData((prev) => ({ ...prev, totalPrice: 0 }));
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const selectedRoom = rooms.find((r) => r.id === formData.roomId);

    if (!selectedRoom) return;

    let price = 0;
    if (formData.type === "HOURLY") {
      const hours =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      price = hours * selectedRoom.pricePerHour;
    } else {
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      price = days * selectedRoom.pricePerDay;
    }

    setFormData((prev) => ({ ...prev, totalPrice: price }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReservationFormData> = {};

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
    }

    if (!isClient && !formData.clientId) {
      newErrors.clientId = "Cliente é obrigatório" as unknown as number;
    }

    if (!formData.roomId) {
      newErrors.roomId = "Quarto é obrigatório" as unknown as number;
    }
    if (!formData.roomId) {
      newErrors.roomId = "Quarto é obrigatório" as unknown as number;
    }

    if (formData.totalPrice <= 0) {
      setPriceError("Preço total deve ser maior que zero");
    } else {
      setPriceError("");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !priceError;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      startDate: "",
      endDate: "",
      type: "HOURLY",
      totalPrice: 0,
      clientId: 0,
      roomId: 0,
    });
    setErrors({});
    setPriceError("");
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);

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
          <Typography variant="h6">
            {editingReservation ? "Editar Reserva" : "Nova Reserva"}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            {/* Cliente - apenas para owners */}
            {!isClient && (
              <FormControl fullWidth error={!!errors.clientId}>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={formData.clientId}
                  onChange={(e) =>
                    handleInputChange("clientId", Number(e.target.value))
                  }
                  label="Cliente"
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <User size={16} />
                        {client.name} - {client.email}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.clientId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.clientId}
                  </Typography>
                )}
              </FormControl>
            )}

            {/* Quarto */}
            <FormControl fullWidth error={!!errors.roomId}>
              <InputLabel>Quarto</InputLabel>
              <Select
                value={formData.roomId}
                onChange={(e) =>
                  handleInputChange("roomId", Number(e.target.value))
                }
                label="Quarto"
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Building2 size={16} />
                      {room.name} - {room.capacity} pessoas
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.roomId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.roomId}
                </Typography>
              )}
            </FormControl>

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

            {/* Informações do Preço */}
            {selectedRoom && (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Preços do Quarto:</strong>
                  <br />
                  Por hora: {formatPrice(selectedRoom.pricePerHour)}
                  <br />
                  Por dia: {formatPrice(selectedRoom.pricePerDay)}
                </Typography>
              </Alert>
            )}

            {/* Preço Total */}
            <TextField
              label="Preço Total"
              type="number"
              value={formData.totalPrice}
              onChange={(e) =>
                handleInputChange("totalPrice", parseFloat(e.target.value) || 0)
              }
              error={!!priceError}
              helperText={priceError || "O preço é calculado automaticamente"}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
              }}
            />

            {formData.totalPrice > 0 && (
              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Preço Total:</strong>{" "}
                  {formatPrice(formData.totalPrice)}
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: "#1976d2" }}
        >
          {editingReservation ? "Salvar Alterações" : "Criar Reserva"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
