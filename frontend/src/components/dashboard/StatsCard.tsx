import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  rank?: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  icon: React.ReactNode
}

export default function StatsCard({ title, value, rank, trend, subtitle, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
            trend === 'down' ? 'bg-rose-50 text-rose-600' :
            'bg-slate-50 text-slate-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
            {trend.toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{value}</h3>
          {rank && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
              {rank}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs font-medium text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
