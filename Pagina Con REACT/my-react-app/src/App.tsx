  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import Header from './components/Header';
  import Home from './components/MainContent';
  import Footer from './components/Footer';

  import Eventos from './pages/Eventos';
  import Clubs from './pages/Clubs';
  import Cursos from './pages/Cursos';
  import MediaLab from './pages/Laboratorios/MediaLab';
  import LabElectronica from './pages/Laboratorios/Electronica';
  import LabDiseno from './pages/Laboratorios/DisenoEstructura';
  import RealidadVirtual from './pages/Laboratorios/RealidadVirtual';
  import FabLab from './pages/Laboratorios/Fablab';
  import Herramientas from './pages/Herramientas';
  import Test from './pages/Herramientas/Test';
    import ProCalculo6 from './pages/Herramientas/Test/ProCalculo6';
    import ProCalculo7 from './pages/Herramientas/Test/ProCalculo7';
    import ProCalculo8 from './pages/Herramientas/Test/ProCalculo8';
  import './App.css';

  function App() {
    return (
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="mainContent">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/laboratorios/medialab" element={<MediaLab />} />
              <Route path="/laboratorios/electronica" element={<LabElectronica />} />
              <Route path="/laboratorios/diseno" element={<LabDiseno />} />
              <Route path="/laboratorios/realidad-virtual" element={<RealidadVirtual />} />
              <Route path="/laboratorios/fablab" element={<FabLab />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/Herramientas" element={<Herramientas />} />
              <Route path="/Herramientas/test" element={<Test/>} /> 
              <Route path="/test/ProCalculo6" element={<ProCalculo6 />} />
              <Route path="/test/pro-calculo-7" element={<ProCalculo7 />} />
              <Route path="/test/pro-calculo-8" element={<ProCalculo8 />} />
            </Routes>
          </main>
          <Footer /> {/* Llamamos al componente Footer aquí */}
        </div>
      </BrowserRouter>
    );
  }

  export default App;
