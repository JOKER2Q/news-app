import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";

import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import Category from "./pages/Category";
import Read from "./pages/Read";
import Login from "./pages/Login";

function App() {
  const loader = () => {
    const loader = document.querySelector(".loader");
    loader.style.opacity = 0;
    loader.style.zIndex = -1;
    document.body.style.overflowY = "auto";
    console.log(1);
    
  };
  return (
    <div onLoad={loader} className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/category" element={<Category />} />
        <Route path="/read" element={<Read />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
