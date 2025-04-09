import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RoutePlanner from './pages/RoutePlanner';
import RouteDetails from './pages/RouteDetails';
import TubeJourneyDetails from './pages/TubeJourneyDetails';
import BusJourneyDetails from './pages/BusJourneyDetails';
import CarRouteDetails from './pages/CarRouteDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/plan" element={<RoutePlanner />} />
        <Route path="/details" element={<RouteDetails />} />
        <Route path="/tube-journey" element={<TubeJourneyDetails />} />
        <Route path="/bus-journey" element={<BusJourneyDetails />} />
        <Route path="/car-journey" element={<CarRouteDetails />} />


        </Routes>
    </Router>
  );
}

export default App;
