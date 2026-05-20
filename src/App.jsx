import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/simulator" element={<Simulator />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}