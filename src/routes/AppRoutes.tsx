import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Admissions from "../pages/Admissions";
import Contact from "../pages/Contact";
import Programmes from "../pages/Programmes";

export  function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/admissions" element={<Admissions />} />
      <Route path="/programmes" element={<Programmes />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
