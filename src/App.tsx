import { Route, Routes } from "react-router";
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from "./pages/HomePage";
import ChatFloat from "./components/chat/ChatFloat";
import './App.css'

function App() {

  return (
    <>
      <Header />

      <main id="home">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
      <ChatFloat />
    </>
  )
}

export default App
