import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notes from "./components/notes/Notes";
import Todos from "./components/todos/Todos";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthPage from "./components/auth/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/notes" element={<ProtectedRoute>
      <Notes />
    </ProtectedRoute>} />
        <Route path="/todos" element={<ProtectedRoute>
      <Todos />
    </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
