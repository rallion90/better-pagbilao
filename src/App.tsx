import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import Header from './components/layout/Header'
import EmergencyBanner from './components/announcements/EmergencyBanner'
import Footer from './components/layout/Footer'
import HomePage from "./pages/HomePage";
import ChatFloat from "./components/chat/ChatFloat";
import DataDisclosureModal from "./components/common/DataDisclosureModal";
import MascotIntroModal from "./components/common/MascotIntroModal";
import './App.css'

const LegislativeCouncilPage = lazy(() => import("./pages/government/LegislativeCouncilPage"));
const LocalOfficialsDirectoryPage = lazy(() => import("./pages/government/LocalOfficialsDirectoryPage"));
const HealthServicePage = lazy(() => import("./pages/services/HealthServicePage"));
const DisasterAndSafetyPage = lazy(() => import("./pages/services/DisasterAndSafetyPage"));
const AgricultureAndLivelihoodPage = lazy(() => import("./pages/services/AgricultureAndLivelihoodPage"));
const SocialWelfarePage = lazy(() => import("./pages/services/SocialWelfarePage"));
const BusinessAndPermitsPage = lazy(() => import("./pages/services/BusinessAndPermitsPage"));
const HotlinesPage = lazy(() => import("./pages/HotlinesPage"));
const GatewayLocationPage = lazy(() => import("./pages/explore/GatewayLocationPage"));
const OrdinancesAndExecutiveOrdersPage = lazy(() => import("./pages/transparency/OrdinancesAndExecutiveOrdersPage"));
const ProcurementPage = lazy(() => import("./pages/transparency/ProcurementPage"));
const CitizensCharterPage = lazy(() => import("./pages/transparency/CitizensCharterPage"));
const PermitsAndClearancesPage = lazy(() => import("./pages/transparency/PermitsAndClearancesPage"));
const CommunityReportingPage = lazy(() => import("./pages/community/CommunityReportingPage"));
const TrackReportPage = lazy(() => import("./pages/community/TrackReportPage"));
const BarangayMapPage = lazy(() => import("./pages/explore/BarangayMapPage"));
const HistoryPage = lazy(() => import("./pages/explore/HistoryPage"));
const AnnouncementsPage = lazy(() => import("./pages/announcements/AnnouncementsPage"));
const AnnouncementDetailPage = lazy(() => import("./pages/announcements/AnnouncementDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {

  return (
    <>
      <EmergencyBanner />
      <Header />

      <main id="home">
        <Suspense fallback={null}>
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
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/announcements/:slug" element={<AnnouncementDetailPage />} />
            <Route path="/community/report" element={<CommunityReportingPage />} />
            <Route path="/community/track" element={<TrackReportPage />} />
            <Route path="/community/track/:code" element={<TrackReportPage />} />
            <Route path="/explore/history" element={<HistoryPage />} />
            <Route path="/explore/barangays" element={<BarangayMapPage />} />
            <Route path="/explore/gateway-location" element={<GatewayLocationPage />} />
            <Route path="/transparency/ordinances-and-executive-orders" element={<OrdinancesAndExecutiveOrdersPage />} />
            <Route path="/transparency/procurement" element={<ProcurementPage />} />
            <Route path="/transparency/citizens-charter" element={<CitizensCharterPage />} />
            <Route path="/transparency/permits-and-clearances" element={<PermitsAndClearancesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <ChatFloat />
      <DataDisclosureModal />
      <MascotIntroModal />
    </>
  )
}

export default App
