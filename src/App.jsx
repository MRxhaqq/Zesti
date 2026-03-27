import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ZestiProvider } from "./context/ZestiContext";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import CustomCursor from "./components/CustomCursor";

function App() {
  return (
    <ZestiProvider>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </BrowserRouter>
    </ZestiProvider>
  );
}

export default App;
