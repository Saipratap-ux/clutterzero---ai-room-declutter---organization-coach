import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  BarChart3, 
  Users, 
  Globe, 
  Smartphone, 
  Laptop, 
  ArrowUpRight, 
  Calendar,
  Activity,
  HardDrive
} from 'lucide-react';

interface AnalyticsViewProps {
  project: Project;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ project }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  const topPages = [
    { path: '/', views: 4210, percentage: 68 },
    { path: '/#features', views: 1140, percentage: 18 },
    { path: '/#pricing', views: 520, percentage: 8 },
    { path: '/#contact', views: 340, percentage: 6 },
  ];

  const topReferrers = [
    { source: 'Direct / None', count: 2840, percentage: 46 },
    { source: 'google.com', count: 1720, percentage: 28 },
    { source: 'github.com', count: 980, percentage: 16 },
    { source: 'twitter.com / X', count: 670, percentage: 10 },
  ];

  const geography = [
    { country: 'United States', flag: '🇺🇸', visits: 2410, percentage: 39 },
    { country: 'India', flag: '🇮🇳', visits: 1840, percentage: 30 },
    { country: 'Germany', flag: '🇩🇪', visits: 680, percentage: 11 },
    { country: 'United Kingdom', flag: '🇬🇧', visits: 510, percentage: 8 },
    { country: 'Japan', flag: '🇯🇵', visits: 770, percentage: 12 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Privacy-Conscious Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time edge telemetry for <span className="text-amber-400 font-mono">{project.subdomain}</span>. Cookie-free and GDPR compliant.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          {(['24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                timeRange === r
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === '24h' ? 'Last 24 Hours' : r === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards (PRD Section 11) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Total Visitors</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {project.visitorsToday * (timeRange === '24h' ? 1 : timeRange === '7d' ? 5 : 22)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">+14.2% from previous period</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Page Views</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {project.pageViewsToday * (timeRange === '24h' ? 1 : timeRange === '7d' ? 6 : 24)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">2.8 pages / session</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Median Edge Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums font-mono">18 ms</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">Anycast Global Routing</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Bandwidth Served</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {Math.round(project.monthlyBandwidthBytes / (1024 * 1024))} MB
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">99.8% CDN Cache Hit Ratio</div>
        </div>
      </div>

      {/* Traffic Trend Visualizer */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Daily Traffic Volume</h2>
          <span className="text-xs text-slate-500 font-mono">Aggregated Hourly</span>
        </div>
        <div className="h-44 flex items-end gap-2 pt-4 border-b border-slate-800/80">
          {[38, 52, 44, 76, 92, 110, 85, 98, 120, 145, 130, 160, 185, 140, 175, 210, 195, 230].map(
            (val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  style={{ height: `${(val / 240) * 100}%` }}
                  className="w-full bg-gradient-to-t from-blue-600/40 to-blue-500 rounded-t group-hover:from-blue-500 group-hover:to-amber-400 transition-all cursor-pointer"
                  title={`${val * 10} views`}
                ></div>
              </div>
            )
          )}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>00:00 UTC</span>
          <span>12:00 UTC</span>
          <span>23:59 UTC</span>
        </div>
      </div>

      {/* 2-Column Split: Top Pages & Referrers / Geography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white">Top Visited Pages</h2>
          <div className="space-y-3">
            {topPages.map((page) => (
              <div key={page.path} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-200">{page.path}</span>
                  <span className="font-mono text-slate-400 tabular-nums">{page.views.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div style={{ width: `${page.percentage}%` }} className="h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white">Geographic Distribution</h2>
          <div className="space-y-3">
            {geography.map((geo) => (
              <div key={geo.country} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200">
                    <span className="mr-2">{geo.flag}</span>
                    {geo.country}
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">{geo.visits.toLocaleString()} ({geo.percentage}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div style={{ width: `${geo.percentage}%` }} className="h-full bg-amber-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
