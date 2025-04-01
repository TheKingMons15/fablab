import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/MainContent';
import Footer from './components/Footer';

import Eventos from './pages/Eventos/index.tsx';
import Clubs from './pages/Clubs/index.tsx';
import Cursos from './pages/Cursos/index.tsx';
import MediaLab from './pages/Laboratorios/MediaLab/index.tsx';
import LabElectronica from './pages/Laboratorios/Electronica/index.tsx';
import LabDiseno from './pages/Laboratorios/DisenoEstructura/index.tsx';
import RealidadVirtual from './pages/Laboratorios/RealidadVirtual/index.tsx';
import FabLab from './pages/Laboratorios/Fablab/index.tsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/laboratorios/medialab" element={<MediaLab/>} />
            <Route path="/laboratorios/electronica" element={<LabElectronica/>} />
            <Route path="/laboratorios/diseno" element={<LabDiseno/>} />
            <Route path="/laboratorios/realidad-virtual" element={<RealidadVirtual/>} />
            <Route path="/laboratorios/fablab" element={<FabLab/>} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/cursos" element={<Cursos />} />
          </Routes>
        </main>
        <Footer /> {/* Llamamos al componente Footer aquí */}
      </div>
    </BrowserRouter>
  );
}

export default App;
