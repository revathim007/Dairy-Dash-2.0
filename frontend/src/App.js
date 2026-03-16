import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import OrderSuccess from "./customer/pages/OrderSuccess";

// Admin Components
import AdminSidebar from "./admin/components/AdminSidebar";
import AdminNavbar from "./admin/components/AdminNavbar";

// Admin Pages
import AdminDashboard from "./admin/pages/Dashboard";
import AdminProducts from "./admin/pages/Products";
import AdminCustomers from "./admin/pages/Customers";
import AdminSubscriptions from "./admin/pages/Subscriptions";
import AdminOrders from "./admin/pages/Orders";
import AdminBilling from "./admin/pages/Billing";

// Customer Components
import CustomerNavbar from "./customer/components/CustomerNavbar";

// Customer Pages
import Home from "./customer/pages/Home";
import Products from "./customer/pages/Products";
import Cart from "./customer/pages/Cart";
import Subscriptions from "./customer/pages/Subscriptions";
import Orders from "./customer/pages/Orders";
import Billing from "./customer/pages/Billing";
import Profile from "./customer/pages/Profile";
import Dashboard from "./customer/pages/Dashboard";

// Context Providers
import { CartProvider } from "./customer/context/CartContext";
import { AuthProvider, AuthContext } from "./auth/AuthContext";

// Auth Pages
import Login from "./auth/Login";
import Register from "./auth/Register";


// -----------------------------
// Protected Customer Route
// -----------------------------
const ProtectedRoute = ({ children }) => {

  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin should not access customer pages
  if (user.is_staff) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};


// -----------------------------
// Admin Protected Route
// -----------------------------
const AdminRoute = ({ children }) => {

  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
};


// -----------------------------
// Admin Layout
// -----------------------------
const AdminLayout = () => {

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text overflow-hidden">

      <AdminSidebar />

      <div className="flex-1 flex flex-col ml-64">

        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};


// -----------------------------
// Customer Layout
// -----------------------------
const CustomerLayout = () => {

  return (
    <CartProvider>

      <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text">

        <CustomerNavbar />

        <main className="flex-1 p-6 flex justify-center">
          <div className="max-w-7xl w-full">
            <Outlet />
          </div>
        </main>

      </div>

    </CartProvider>
  );
};


// -----------------------------
// App
// -----------------------------
function App() {

  return (

    <AuthProvider>

      <Router>

        <Routes>

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* Customer Routes */}
          <Route
            element={
              <ProtectedRoute>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >

            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/order-success" element={<OrderSuccess />} />

          </Route>


          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="billing" element={<AdminBilling />} />

          </Route>

        </Routes>

      </Router>

    </AuthProvider>

  );
}

export default App;