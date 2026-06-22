import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// Components & Pages Import
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // Humne Home ko pages/Home se import kiya
import BlogPage from "./components/BlogPage";
import PortfolioPage from "./components/PortfolioPage";
import WritePage from "./components/WritePage";
import FooterSection from "./components/FooterSection";
import BlogLayout from "./components/BlogLayout";
import BlogGrid from "./components/BlogGrid"; // Filter logic ke liye
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Documentation from "./pages/Documentation";
import Status from "./pages/Status";
import Security from "./pages/Security";

function AppContent() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useContext(AuthContext);
  const [githubData, setGithubData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const navigate = useNavigate();

  // Sabhi original logic wahi hai
  const fetchFilteredBlogs = async (tags) => {
    try {
      const query = tags.length > 0 ? `?tag=${tags.join(",")}` : "";
      const res = await fetch(`${API_URL}/api/blogs${query}`);
      const json = await res.json();
      if (json.success) setBlogs(json.data);
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  const handleFilterChange = (tech) => {
    let newFilters = selectedFilters.includes(tech)
      ? selectedFilters.filter((t) => t !== tech)
      : [...selectedFilters, tech];
    setSelectedFilters(newFilters);
    fetchFilteredBlogs(newFilters);
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("${API_URL}/api/blogs");
      const json = await res.json();
      if (json.success && json.data) setBlogs(json.data);
    } catch (err) {
      console.error("Fetch mein error:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleFetchGithub = async (username) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/github/profile/${username}`);
      const data = await res.json();
      if (data) {
        setGithubData({ ...data, username });
        navigate("/portfolio");
      }
    } catch (err) {
      console.error("Profile load failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">
      <Navbar />
      <main className="w-full">
        <Routes>
          <Route
            path="/"
            element={<Home onFetchGithub={handleFetchGithub} />}
          />

          <Route
            path="/blogs"
            element={
              <BlogLayout
                onFilterChange={handleFilterChange}
                selectedFilters={selectedFilters}
              >
                <div className="pt-8 min-h-screen bg-black">
                  <h1 className="text-4xl font-bold text-white mb-10">
                    Engineering Feed
                  </h1>
                  <BlogGrid blogs={blogs} viewType="list" />
                </div>
              </BlogLayout>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <LoginPage />}
          />
          <Route path="/write" element={<WritePage />} />
          <Route
            path="/portfolio"
            element={
              loading ? (
                <div>Loading...</div>
              ) : (
                <PortfolioPage
                  githubData={githubData}
                  onFetchGithub={handleFetchGithub} // Ye zaroori hai
                />
              )
            }
          />
          <Route path="/documentation" element={<Documentation />}>
            <Route path=":sectionId" element={<Documentation />} />
          </Route>
          <Route path="/status" element={<Status />} />
          <Route path="/security" element={<Security />} />
          <Route path="/blogs/:id" element={<BlogPage />} />
        </Routes>
      </main>
      <FooterSection /> {/* Footer yahan rehne dein */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
