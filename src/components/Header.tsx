import { Coffee } from 'lucide-react';

const CHAI_URL = 'https://www.chai4.me/shifas';

interface Props {
  activeTab: 'knockout' | 'groups';
  onTabChange: (tab: 'knockout' | 'groups') => void;
}

export default function Header({ activeTab, onTabChange }: Props) {

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
            <a
              href={CHAI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shadow-sm hover:shadow"
            >
              <Coffee size={14} className="text-amber-700" />
              <span>Buy me a Chai</span>
            </a>
          </div>
        </div>

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
