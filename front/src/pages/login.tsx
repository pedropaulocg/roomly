import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOffIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { login } from "../service/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Verificar se há mensagem de sucesso do registro
  const successMessage = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const loginData = await login({ email, password });
      console.log(loginData);
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));
      localStorage.setItem("userType", loginData.user.role);
      setIsLoading(false);
      navigate("/");
    } catch (error: any) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais."
      );
    } finally {
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
            Bem vindo, faça login para continuar
          </Typography>

          {successMessage && (
            <Box sx={{ color: "success.main", mb: 2 }}>
              <Typography variant="body2">{successMessage}</Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ color: "error.main", mb: 2 }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {isLoading ? "Entrando..." : "Login"}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Não tem uma conta?{" "}
              <Link to="/register" style={{ textDecoration: "none" }}>
                Registre-se
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
