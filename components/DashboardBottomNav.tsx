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

  // Roving-tabindex arrow-key navigation (WAI-ARIA tabs pattern):
  // Left/Right (and Home/End) move selection + focus between tabs.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const nextId = tabs[nextIndex].id;
    onTabChange(nextId);
    document.getElementById(`tab-mobile-${nextId}`)?.focus();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[color:var(--hairline)] bg-[color:var(--surface-raised)]/95 shadow-lg backdrop-blur-sm md:hidden">
      <div role="tablist" aria-label="Dashboard sections" onKeyDown={handleKeyDown} className="flex items-center justify-around py-2">
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
              tabIndex={isActive ? 0 : -1}
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
