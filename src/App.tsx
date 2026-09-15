import { Route, Routes } from "react-router";
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from "./pages/HomePage";
import LegislativeCouncilPage from "./pages/government/LegislativeCouncilPage";
import LocalOfficialsDirectoryPage from "./pages/government/LocalOfficialsDirectoryPage";
import HealthServicePage from "./pages/services/HealthServicePage";
import DisasterAndSafetyPage from "./pages/services/DisasterAndSafetyPage";
import AgricultureAndLivelihoodPage from "./pages/services/AgricultureAndLivelihoodPage";
import SocialWelfarePage from "./pages/services/SocialWelfarePage";
import BusinessAndPermitsPage from "./pages/services/BusinessAndPermitsPage";
import HotlinesPage from "./pages/HotlinesPage";
import GatewayLocationPage from "./pages/explore/GatewayLocationPage";
import ChatFloat from "./components/chat/ChatFloat";
import DataDisclosureModal from "./components/common/DataDisclosureModal";
import './App.css'

function App() {

  return (
    <>
      <Header />

      <main id="home">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/government/legislative-council" element={<LegislativeCouncilPage />} />
          <Route path="/government/local-officials-directory" element={<LocalOfficialsDirectoryPage />} />
          <Route path="/services/health-services" element={<HealthServicePage />} />
          <Route path="/services/disaster-and-safety" element={<DisasterAndSafetyPage />} />
          <Route path="/services/agriculture-and-livelihood" element={<AgricultureAndLivelihoodPage />} />
          <Route path="/services/social-welfare" element={<SocialWelfarePage />} />
          <Route path="/services/business-and-permits" element={<BusinessAndPermitsPage />} />
          <Route path="/hotlines" element={<HotlinesPage />} />
          <Route path="/explore/gateway-location" element={<GatewayLocationPage />} />
        </Routes>
      </main>

      <Footer />
      <ChatFloat />
      <DataDisclosureModal />
    </>
  )
}

export default App
