import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateCar from "./pages/CreateCar";
import CarDetail from "./pages/CarDetail";
import DeleteCar from "./pages/DeleteCar";
import EditCar from "./pages/EditCar";
import Header from "./components/Header"; // Import Header component

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

// Separate component to handle layout (Header visibility)
function MainLayout() {
  const location = useLocation();
  const noHeaderRoutes = ["/login", "/signup"];

  return (
    <div className="m-0">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-car" element={<CreateCar />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/delete-car/:id" element={<DeleteCar />} />
        <Route path="/edit-car/:id" element={<EditCar />} />
      </Routes>
    </div>
  );
}

export default App;
