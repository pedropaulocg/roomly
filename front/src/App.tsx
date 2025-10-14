import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/Home";
import { RequireAuth, PublicNavbar, UserBasedRouter } from "./components";
import { RoomListOwner } from "./pages/RoomListOwner";
import { ReservationsPage } from "./pages/ReservationsPage";
import { ClientReservationsPage } from "./pages/ClientReservationsPage";
import { RoomDetailPage } from "./pages/RoomDetailPage";
import { BookingPage } from "./pages/BookingPage";
import { MyReservationsPage } from "./pages/MyReservationsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Página pública de reservas (sem login) */}
        <Route
          path="/public"
          element={
            <>
              <PublicNavbar />
              <ClientReservationsPage />
            </>
          }
        />

        {/* Página de detalhes da sala (pública) */}
        <Route
          path="/room/:id"
          element={
            <>
              <PublicNavbar />
              <RoomDetailPage />
            </>
          }
        />

        {/* Rotas para Proprietários (OWNER) */}
        <Route
          path="/owner"
          element={
            <UserBasedRouter>
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            </UserBasedRouter>
          }
        />
        <Route
          path="/owner/rooms"
          element={
            <UserBasedRouter>
              <RequireAuth>
                <RoomListOwner />
              </RequireAuth>
            </UserBasedRouter>
          }
        />
        <Route
          path="/owner/reservations"
          element={
            <UserBasedRouter>
              <RequireAuth>
                <ReservationsPage />
              </RequireAuth>
            </UserBasedRouter>
          }
        />

        {/* Rotas para Clientes (CLIENT) */}
        <Route
          path="/client"
          element={
            <UserBasedRouter>
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            </UserBasedRouter>
          }
        />
        <Route
          path="/client/reservations"
          element={
            <UserBasedRouter>
              <RequireAuth>
                <ClientReservationsPage />
              </RequireAuth>
            </UserBasedRouter>
          }
        />
        <Route
          path="/client/booking/:id"
          element={
            <UserBasedRouter>
              <RequireAuth>
                <BookingPage />
              </RequireAuth>
            </UserBasedRouter>
          }
        />
        <Route
          path="/client/my-reservations"
          element={
            <UserBasedRouter>
              <RequireAuth>
                <MyReservationsPage />
              </RequireAuth>
            </UserBasedRouter>
          }
        />

        {/* Rota raiz com redirecionamento baseado no tipo de usuário */}
        <Route
          path="/"
          element={
            <UserBasedRouter>
              <div />
            </UserBasedRouter>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
