import { useEffect, useState } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { recordVisitorVisit } from '../utils/supabase';

interface Props {
  activeTab: 'knockout' | 'groups';
  onTabChange: (tab: 'knockout' | 'groups') => void;
  champion: { flag: string; name: string } | null;
  liveUpdatedAt: string | null;
  isLive: boolean;
  onSyncLive: () => void;
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

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Header({
  activeTab,
  onTabChange,
  champion,
  liveUpdatedAt,
  isLive,
  onSyncLive,
}: Props) {
  const visitorCount = useVisitorCount();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-fifa-navy tracking-tight">
              FIFA World Cup 26™
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-gray-500 text-[11px]">
                Knockout Stage Simulator
              </p>
              {liveUpdatedAt && (
                <span className="flex items-center gap-1 text-[10px]">
                  {isLive ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-600 font-medium">
                        LIVE · {formatTimeAgo(liveUpdatedAt)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      <span className="text-gray-400">Manual mode</span>
                      <button
                        onClick={onSyncLive}
                        className="ml-0.5 text-fifa-teal hover:text-fifa-teal-dark transition-colors cursor-pointer"
                        title="Sync live standings"
                      >
                        <RefreshCw size={10} />
                      </button>
                    </>
                  )}
                </span>
              )}
            </div>
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
