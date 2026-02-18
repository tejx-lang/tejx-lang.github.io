import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Documentation from "./pages/Documentation";
import PlaygroundPage from "./pages/PlaygroundPage";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDocs = location.pathname.startsWith("/docs");

  return (
    <div className={`min-h-screen flex flex-col ${isDocs ? "docs-mode" : ""}`}>
      <div className="nebula-bg" />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Documentation />}>
            <Route path=":sectionId" element={<Documentation />} />
          </Route>
          <Route
            path="/get-started"
            element={<Navigate to="/docs/get-started" replace />}
          />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </main>

      {!isDocs && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
