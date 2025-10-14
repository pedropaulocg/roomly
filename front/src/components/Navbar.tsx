import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { LogOut, Home } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  const handleNavigateToRooms = () => {
    navigate("/owner/rooms");
  };

  const handleNavigateToReservations = () => {
    if (userType === "OWNER") {
      navigate("/owner/reservations");
    } else {
      navigate("/client/reservations");
    }
  };

  const handleNavigateToMyReservations = () => {
    navigate("/client/my-reservations");
  };

  const handleNavigateToHome = () => {
    if (userType === "OWNER") {
      navigate("/owner");
    } else {
      navigate("/client");
    }
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
            Home
          </Button>

          {userType === "OWNER" && (
            <Button
              color="inherit"
              onClick={handleNavigateToRooms}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Quartos
            </Button>
          )}

          <Button
            color="inherit"
            onClick={handleNavigateToReservations}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            {userType === "OWNER" ? "Gerenciar Reservas" : "Reservar Espaços"}
          </Button>

          {userType === "CLIENT" && (
            <Button
              color="inherit"
              onClick={handleNavigateToMyReservations}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Minhas Reservas
            </Button>
          )}

          {/* Botão de Logout */}
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            title="Sair"
          >
            <LogOut size={20} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
