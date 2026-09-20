import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppContext";
import { useApp } from "./useApp";
import Layout from "../components/Layout";
import AboutPage from "../pages/AboutPage";
import CardsPage from "../pages/CardsPage";
import NotFoundPage from "../pages/NotFoundPage";
import QuizPage from "../pages/QuizPage";
import SettingsPage from "../pages/SettingsPage";

function RootRedirect() {
  const { startRoute } = useApp();
  return <Navigate to={startRoute} replace />;
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Layout>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
