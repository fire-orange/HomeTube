import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import VideoPlayerPage from "./pages/VideoPlayerPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="signup" element={<AuthPage signup />} />
            <Route path="watch/:video" element={<VideoPlayerPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
