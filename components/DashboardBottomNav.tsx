'use client';

import { Activity, Shield, Award } from 'lucide-react';

interface Props {
  activeTab: 'risk' | 'governance' | 'compliance';
  onTabChange: (tab: 'risk' | 'governance' | 'compliance') => void;
}

export default function DashboardBottomNav({ activeTab, onTabChange }: Props) {
  const tabs = [
    { id: 'risk' as const, label: 'Risk Intelligence', icon: Activity },
    { id: 'governance' as const, label: 'Governance Operations', icon: Shield },
    { id: 'compliance' as const, label: 'Compliance', icon: Award },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[color:var(--hairline)] bg-[color:var(--surface-raised)]/95 shadow-lg backdrop-blur-sm md:hidden">
      <div role="tablist" aria-label="Dashboard sections" className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-mobile-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-label={tab.label}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${
                isActive ? 'text-arf-blue' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
              }`}
            >
              <Icon size={22} />
              <span className="text-xs font-medium" aria-hidden="true">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
