import { Routes, Route, Navigate } from "react-router-dom"
import Landing from "./pages/Landing"
import Order from "./pages/Order"
import Success from "./pages/Success"
import Cancel from "./pages/Cancel"
import AdminOrders from "./pages/AdminOrders"
import AdminLogin from "./pages/AdminLogin"
import AdminGuard from "./components/AdminGuard"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/order" element={<Order />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/orders"
        element={
          <AdminGuard>
            <AdminOrders />
          </AdminGuard>
        }
      />

      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}