import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider } from '@/lib/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Login } from '@/pages/Login';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { Dashboard } from '@/pages/Dashboard';
import { POS } from '@/pages/POS';
import { Orders } from '@/pages/Orders';
import { Products } from '@/pages/Products';
import { Categories } from '@/pages/Categories';
import { Customers } from '@/pages/Customers';
import { Employees } from '@/pages/Employees';
import { Kitchen } from '@/pages/Kitchen';
import { Tables } from '@/pages/Tables';
import { Floors } from '@/pages/Floors';
import { Payments } from '@/pages/Payments';
import { Coupons } from '@/pages/Coupons';
import { Promotions } from '@/pages/Promotions';
import { Feedback } from '@/pages/Feedback';
import { Reports } from '@/pages/Reports';
import { Receipt } from '@/pages/Receipt';
import { Receipts } from '@/pages/Receipts';
import { Settings } from '@/pages/Settings';
import { TrackOrder } from '@/pages/TrackOrder';
import { PermissionDenied } from '@/pages/PermissionDenied';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/track-order" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
              <Route path="/track-order/:orderId" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
              <Route path="/kitchen" element={<ProtectedRoute><Kitchen /></ProtectedRoute>} />
              <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
              <Route path="/floors" element={<ProtectedRoute><Floors /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/coupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
              <Route path="/promotions" element={<ProtectedRoute><Promotions /></ProtectedRoute>} />
              <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/receipt" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
              <Route path="/receipts" element={<ProtectedRoute><Receipts /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/permission-denied" element={<PermissionDenied />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
