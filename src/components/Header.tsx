import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { recordVisitorVisit } from '../utils/supabase';

interface Props {
  activeTab: 'knockout' | 'groups';
  onTabChange: (tab: 'knockout' | 'groups') => void;
  champion: { flag: string; name: string } | null;
}

function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    recordVisitorVisit().then((n) => {
      if (!cancelled) setCount(n);
    });
    return () => { cancelled = true; };
  }, []);
  return count;
}

export default function Header({ activeTab, onTabChange, champion }: Props) {
  const visitorCount = useVisitorCount();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-fifa-navy tracking-tight">
              FIFA World Cup 26™
            </h1>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Knockout Stage Simulator
            </p>
          </div>

          <div className="flex items-center gap-4">
            {champion && (
              <div className="hidden sm:flex items-center gap-2 bg-fifa-gold/10 border border-fifa-gold/30 rounded-full px-4 py-1.5">
                <span className="text-fifa-gold text-xs font-bold">🏆</span>
                <span className="text-fifa-navy text-sm font-bold">
                  {champion.flag} {champion.name}
                </span>
              </div>
            )}
            {visitorCount !== null && (
              <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                <Eye size={12} />
                <span>{visitorCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {champion && (
          <div className="sm:hidden mt-3 flex items-center justify-center gap-2 bg-fifa-gold/10 border border-fifa-gold/30 rounded-full px-4 py-1.5">
            <span className="text-fifa-gold text-xs font-bold">🏆</span>
            <span className="text-fifa-navy text-sm font-bold">
              {champion.flag} {champion.name}
            </span>
          </div>
        )}

        <div className="flex mt-4 gap-0 bg-gray-100 rounded-lg p-0.5 max-w-xs">
          <button
            onClick={() => onTabChange('knockout')}
            className={`flex-1 text-xs font-semibold py-2 px-4 rounded-md transition-all cursor-pointer ${
              activeTab === 'knockout'
                ? 'bg-white text-fifa-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Knockout Bracket
          </button>
          <button
            onClick={() => onTabChange('groups')}
            className={`flex-1 text-xs font-semibold py-2 px-4 rounded-md transition-all cursor-pointer ${
              activeTab === 'groups'
                ? 'bg-white text-fifa-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Group Standings
          </button>
        </div>
      </div>
    </header>
  );
}
