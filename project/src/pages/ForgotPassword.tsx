import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Coffee, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      toast.success('Password reset instructions sent to your email.');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl gradient-coffee flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-bold text-2xl text-[#2C1E14] tracking-tight font-display">CafePOS</h1>
          <span className="text-sm text-[#8B7355] font-medium">Pro</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/60 border border-[#D4C4A8]/30 rounded-2xl p-8 shadow-sm"
        >
          {sent ? (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-[#6B7F59]/20 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-[#6B7F59]" />
              </motion.div>
              <h2 className="text-xl font-bold text-[#2C1E14] font-display mb-2">Email Sent!</h2>
              <p className="text-sm text-[#8B7355] mb-6">
                Password reset instructions have been sent to your email.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#2C1E14] font-display mb-1">Forgot Password</h2>
              <p className="text-sm text-[#8B7355] mb-6">
                Enter your registered email and we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#2C1E14] mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#EDE5D8]/50 border border-[#D4C4A8]/50 text-[#2C1E14] placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/20 focus:border-[#6B4E3D] transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl gradient-coffee text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[#D4C4A8]/20">
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 text-sm text-[#6B4E3D] hover:text-[#C75B39] font-medium transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
