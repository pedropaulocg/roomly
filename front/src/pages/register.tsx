import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOffIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { register } from "../service/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"OWNER" | "CLIENT">("CLIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validações
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      await register({ name, email, password, role });
      setIsLoading(false);
      navigate("/login", {
        state: {
          message: "Conta criada com sucesso! Faça login para continuar.",
        },
      });
    } catch (error: any) {
      console.error(error);
      setError(
        error.response?.data?.message || "Erro ao criar conta. Tente novamente."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card sx={{ maxWidth: 400, width: "100%", margin: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Roomly
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Crie sua conta para começar
          </Typography>

          {error && (
            <Box sx={{ color: "error.main", mb: 2 }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Tipo de usuário</InputLabel>
              <Select
                value={role}
                label="Tipo de usuário"
                onChange={(e) => setRole(e.target.value as "OWNER" | "CLIENT")}
              >
                <MenuItem value="CLIENT">Cliente</MenuItem>
                <MenuItem value="OWNER">Proprietário</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOffIcon /> : <Eye />}
                    </IconButton>
                  ),
                },
              }}
            />

            <TextField
              label="Confirmar senha"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <Eye />}
                    </IconButton>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Já tem uma conta?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Faça login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
