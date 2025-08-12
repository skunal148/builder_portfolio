import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Templates from "./pages/Templates";
import Editor from "./pages/Editor";
import Viewer from "./pages/Viewer";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/editor/:templateId" element={<Editor />} />
        <Route path="/editor/portfolio/:portfolioId" element={<Editor />} />
        <Route path="/view/:portfolioId" element={<Viewer />} />
      </Routes>
    </Router>
  );
}
