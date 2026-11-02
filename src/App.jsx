// src/App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Inicio from './pages/inicio/inicio';
import Tienda from './pages/tienda/tienda';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/tienda" element={<Tienda />} />
                {/* cualquier otra ruta vuelve al inicio */}
                <Route path="*" element={<Inicio />} />
            </Routes>
        </BrowserRouter>
    );
}