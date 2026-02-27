import { Navigate, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BookingApp from "./pages/BookingApp.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import About from "./pages/About.jsx";
import Policies from "./pages/Policies.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/app" element={<BookingApp />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
