import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ModerationPage from "./pages/ModerationPage";
import AdminAddProductPage from "./pages/AdminAddProductPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import EditProductPage from "./pages/EditProductPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/moderation" element={<ModerationPage />} />
        <Route path="/admin/add-product" element={<AdminAddProductPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/products/:id/edit" element={<EditProductPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;