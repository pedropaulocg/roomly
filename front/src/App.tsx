import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import HomePage from "./pages/Home";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <RequireAuth>
        <Route path="/" element={<HomePage />} />
      </RequireAuth>
    </BrowserRouter>
  );
}

export default App;
