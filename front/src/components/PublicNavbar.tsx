import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { LogIn, Home } from "lucide-react";

export const PublicNavbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleNavigateToHome = () => {
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Logo/Nome do Sistema */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={handleNavigateToHome}
        >
          Roomly
        </Typography>

        {/* Botões de Navegação */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<Home size={20} />}
            onClick={handleNavigateToHome}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Início
          </Button>

          <Button
            color="inherit"
            startIcon={<LogIn size={20} />}
            onClick={handleLogin}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Entrar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

