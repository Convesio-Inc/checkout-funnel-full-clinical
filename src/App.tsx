import { CheckoutPage } from "@/pages/CheckoutPage";
import { ThankYouPage } from "@/pages/ThankYouPage";
import { AuthProvider } from "@/providers/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ShopLayout } from "./layouts/ShopLayout";
import { LoginPage } from "./pages/LoginPage";
import { OrderPage } from "./pages/OrderPage";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { DashboardLayout } from "./layouts/DashboardLayout";
import { UsersPage } from "./pages/UsersPage";

const queryClient = new QueryClient()

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ShopLayout />}>
              <Route index element={<CheckoutPage />} />
              <Route path="thank-you" element={<ThankYouPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<DashboardLayout />}>
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/page/:page"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;