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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 shadow-lg md:hidden">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
