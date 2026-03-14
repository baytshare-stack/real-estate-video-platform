"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, Clock, PlaySquare, Compass, FolderHeart, Settings, HelpCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const mainLinks = [
    { name: t('nav', 'home'), href: '/', icon: Home },
    { name: 'Shorts', href: '/shorts', icon: Flame },
    { name: 'Subscriptions', href: '/subscriptions', icon: PlaySquare },
  ];

  const secondaryLinks = [
    { name: 'Trending', href: '/trending', icon: Compass },
    { name: 'History', href: '/history', icon: Clock },
    { name: 'Saved Properties', href: '/saved', icon: FolderHeart },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-64px)] fixed left-0 top-16 bg-[#0f0f0f] border-r border-white/10 overflow-y-auto hide-scrollbar hidden xl:flex flex-col py-3 z-40">
      <div className="flex flex-col gap-1 px-3 border-b border-white/10 pb-4">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'bg-white/10 font-bold' : 'hover:bg-white/5 font-medium'}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`} />
              <span className="text-sm tracking-wide text-white">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 px-3 border-b border-white/10 py-4">
        <h3 className="px-3 text-sm font-semibold text-gray-400 mb-1">Explore</h3>
        {secondaryLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'bg-white/10 font-bold' : 'hover:bg-white/5 font-medium'}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`} />
              <span className="text-sm tracking-wide text-white">{link.name}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto px-3 pt-4">
        <Link href="/settings" className="flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5 font-medium">
          <Settings className="w-5 h-5 flex-shrink-0 text-gray-400" />
          <span className="text-sm tracking-wide text-gray-300">Settings</span>
        </Link>
        <button className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5 font-medium">
          <HelpCircle className="w-5 h-5 flex-shrink-0 text-gray-400" />
          <span className="text-sm tracking-wide text-gray-300">Help & Support</span>
        </button>
      </div>
    </aside>
  );
}
