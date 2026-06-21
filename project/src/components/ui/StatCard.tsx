import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingBag, TrendingUp, Users, UserCheck, Calendar,
  ArrowUpRight, ArrowDownRight, IndianRupee,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  DollarSign, ShoppingBag, TrendingUp, Users, UserCheck, Calendar, IndianRupee,
};

const colorMap: Record<string, string> = {
  primary: 'from-[#6B4E3D] to-[#8B7355]',
  success: 'from-[#6B7F59] to-[#8FA68E]',
  warning: 'from-[#C9A84C] to-[#8B6914]',
  secondary: 'from-[#8B7355] to-[#A68E6E]',
  info: 'from-[#6B4E3D] to-[#4A3428]',
  accent: 'from-[#C75B39] to-[#A0522D]',
};

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: number;
  icon: string;
  color: string;
  prefix?: string;
  suffix?: string;
  index?: number;
}

export function StatCard({ label, value, trend, icon, color, prefix = '', suffix = '', index = 0 }: StatCardProps) {
  const Icon = iconMap[icon] || DollarSign;
  const gradient = colorMap[color] || colorMap.primary;
  const isPositive = (trend ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-white/60 border border-[#D4C4A8]/30 p-5 shadow-sm group hover:border-[#6B4E3D]/20 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#8B7355] mb-1">{label}</p>
          <p className="text-2xl font-bold text-[#2C1E14]">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-[#6B7F59]" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-[#C75B39]" />
              )}
              <span className={cn('text-sm font-medium', isPositive ? 'text-[#6B7F59]' : 'text-[#C75B39]')}>
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-[#8B7355]">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm', gradient)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
