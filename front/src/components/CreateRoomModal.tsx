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
} from "@mui/material";
import { X, Upload } from "lucide-react";

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (roomData: RoomFormData) => void;
  initialData?: RoomFormData | null;
}

interface RoomFormData {
  name: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  pricePerDay: number;
  photo: string | null;
}

export const CreateRoomModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: CreateRoomModalProps) => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: "",
    capacity: 1,
    location: "",
    pricePerHour: 0,
    pricePerDay: 0,
    photo: null,
  });

  const [errors, setErrors] = useState<Partial<RoomFormData>>({});

  // Carregar dados iniciais quando o modal abrir para edição
  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
    } else if (open && !initialData) {
      // Resetar formulário para criação
      setFormData({
        name: "",
        capacity: 1,
        location: "",
        pricePerHour: 0,
        pricePerDay: 0,
        photo: null,
      });
    }
    setErrors({});
  }, [open, initialData]);

  const handleInputChange = (
    field: keyof RoomFormData,
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
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RoomFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (formData.capacity < 1) {
      newErrors.capacity = "Capacidade deve ser pelo menos 1";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Localização é obrigatória";
    }

    if (formData.pricePerHour <= 0) {
      newErrors.pricePerHour = "Preço por hora deve ser maior que 0";
    }

    if (formData.pricePerDay <= 0) {
      newErrors.pricePerDay = "Preço por dia deve ser maior que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      capacity: 1,
      location: "",
      pricePerHour: 0,
      pricePerDay: 0,
      photo: null,
    });
    setErrors({});
    onClose();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          photo: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {initialData ? "Editar Quarto" : "Criar Novo Quarto"}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Nome do Quarto */}
          <TextField
            label="Nome do Quarto"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          {/* Capacidade */}
          <TextField
            label="Capacidade (pessoas)"
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              handleInputChange("capacity", parseInt(e.target.value) || 1)
            }
            error={!!errors.capacity}
            helperText={errors.capacity}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />

          {/* Localização */}
          <TextField
            label="Localização"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
            required
          />

          {/* Preço por Hora */}
          <TextField
            label="Preço por Hora (R$)"
            type="number"
            value={formData.pricePerHour}
            onChange={(e) =>
              handleInputChange("pricePerHour", parseFloat(e.target.value) || 0)
            }
            error={!!errors.pricePerHour}
            helperText={errors.pricePerHour}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
          />

          {/* Preço por Dia */}
          <TextField
            label="Preço por Dia (R$)"
            type="number"
            value={formData.pricePerDay}
            onChange={(e) =>
              handleInputChange("pricePerDay", parseFloat(e.target.value) || 0)
            }
            error={!!errors.pricePerDay}
            helperText={errors.pricePerDay}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
          />

          {/* Upload de Foto */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Foto do Quarto (opcional)
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload size={20} />}
                fullWidth
              >
                {formData.photo ? "Alterar Foto" : "Selecionar Foto"}
              </Button>
            </label>
            {formData.photo && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={formData.photo}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
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
          {initialData ? "Salvar Alterações" : "Criar Quarto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
