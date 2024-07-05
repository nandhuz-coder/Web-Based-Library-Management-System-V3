import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./partials/Footer/Footer";
import Landing from "./landing/landing";
import AdminLogin from "./admin/AdminLogin/AdminLogin";
import AdminIndex from "./admin/admin-main/index";
import BooksPage from "./book/books"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/books" element={<BooksPage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
