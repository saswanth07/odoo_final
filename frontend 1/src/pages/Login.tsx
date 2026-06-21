import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Coffee, Mail, Lock, ArrowRight, Shield, User, ChefHat, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { ROLES, type UserRole, getDefaultRoute } from '@/lib/roles';
import { toast } from 'sonner';

const roleOptions: { id: UserRole; label: string; icon: React.ElementType; hint: string; password: string }[] = [
  { id: 'admin', label: 'Administrator', icon: Shield, hint: 'admin@cafe.com', password: 'admin123' },
  { id: 'employee', label: 'Employee', icon: User, hint: 'cashier@cafe.com', password: 'cashier123' },
  { id: 'customer', label: 'Customer', icon: ShoppingBag, hint: 'customer@test.com', password: 'cust123' },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat, hint: 'kitchen@cafe.com', password: 'kitchen123' },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('admin@cafe.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, selectedRole);
      toast.success(`Welcome back! Logged in as ${ROLES[selectedRole].label}`);
      navigate(getDefaultRoute(selectedRole));
    } catch {
      toast.error('Invalid credentials. Use the demo password shown for each role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex">
      {/* Left Panel - Coffee Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#6B4E3D]/20 to-[#F5F0E8]" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A3428]/10 via-transparent to-[#FDF5ED]/80" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-coffee flex items-center justify-center shadow-lg">
              <Coffee className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-bold text-2xl text-[#2C1E14] tracking-tight font-display">CafePOS</span>
              <span className="text-sm text-[#8B7355] ml-1 font-medium">Pro</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl font-bold text-[#2C1E14] leading-tight mb-4 font-display"
          >
            Elevate Your <br />
            <span className="text-[#6B4E3D]">Cafe Experience</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-[#8B7355] text-lg max-w-md"
          >
            Enterprise-grade POS management for modern cafes. Streamline operations, boost revenue, and delight customers.
          </motion.p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-8 text-[#8B7355]">
            <div>
              <p className="text-2xl font-bold text-[#2C1E14] font-display">50K+</p>
              <p className="text-sm">Orders Processed</p>
            </div>
            <div className="w-px h-10 bg-[#D4C4A8]" />
            <div>
              <p className="text-2xl font-bold text-[#2C1E14] font-display">2.4M</p>
              <p className="text-sm">Revenue Generated</p>
            </div>
            <div className="w-px h-10 bg-[#D4C4A8]" />
            <div>
              <p className="text-2xl font-bold text-[#2C1E14] font-display">98%</p>
              <p className="text-sm">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-coffee flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-[#2C1E14] tracking-tight font-display">CafePOS Pro</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-[#2C1E14] mb-2 font-display">Welcome back</h2>
            <p className="text-[#8B7355] mb-6">Sign in to your CafePOS Pro account</p>
          </motion.div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mb-6"
          >
            <p className="text-sm text-[#8B7355] mb-3 font-medium">Select your role</p>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setEmail(role.hint);
                      setPassword(role.password);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'border-[#6B4E3D] bg-[#6B4E3D]/5 text-[#2C1E14]'
                        : 'border-[#D4C4A8]/50 bg-white/50 text-[#8B7355] hover:border-[#6B4E3D]/30 hover:text-[#2C1E14]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#6B4E3D]' : 'text-[#8B7355]'}`} />
                    <div>
                      <p className="text-sm font-medium">{role.label}</p>
                      <p className="text-[10px] text-[#8B7355]">{role.hint}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-[#2C1E14] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/70 border border-[#D4C4A8]/50 text-[#2C1E14] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/20 focus:border-[#6B4E3D] transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1E14] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-white/70 border border-[#D4C4A8]/50 text-[#2C1E14] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/20 focus:border-[#6B4E3D] transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#2C1E14] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-[#8B7355] mt-1.5">
                Demo: {roleOptions.find((r) => r.id === selectedRole)?.password}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D4C4A8] bg-white/50 text-[#6B4E3D] accent-[#6B4E3D]"
                />
                <span className="text-sm text-[#8B7355]">Remember me</span>
              </label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-[#6B4E3D] hover:text-[#C75B39] transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl gradient-coffee text-white font-semibold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In as {ROLES[selectedRole].label}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-[#8B7355]">
              Don't have an account?{' '}
              <button className="text-[#6B4E3D] hover:text-[#C75B39] font-medium transition-colors">
                Contact sales
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
