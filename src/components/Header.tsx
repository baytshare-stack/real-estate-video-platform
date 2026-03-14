"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Search, Bell, Video, UserCircle, Menu, LogOut } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f] border-b border-white/10 z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block">
          <Menu className="w-6 h-6 text-white" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">RealEstateTV</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-4 hidden md:flex items-center">
        <form action="/search" method="GET" className="flex w-full overflow-hidden border border-white/20 rounded-full focus-within:border-blue-500 bg-[#121212] ml-10">
          <input 
            type="text"
            name="q" 
            placeholder={t('search', 'placeholder')}
            className="w-full bg-transparent px-4 py-2 text-white outline-none placeholder:text-gray-500"
          />
          <button type="submit" className="px-5 bg-white/5 hover:bg-white/10 border-l border-white/20 flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
          <Search className="w-5 h-5 text-white" />
        </button>
        <Link href="/upload" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full text-sm font-medium">
          <Video className="w-4 h-4" />
          <span className="hidden sm:block">{t('nav', 'upload')}</span>
        </Link>
        <LanguageSwitcher />
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative hidden sm:block">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        
        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
        ) : session ? (
          <div className="flex items-center gap-3">
             <Link href="/studio" className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity">
                {session.user?.name?.charAt(0) || 'U'}
             </Link>
             <button onClick={() => signOut()} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block" title="Sign Out">
                <LogOut className="w-5 h-5 text-gray-400" />
             </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 transition-colors px-4 py-1.5 rounded-full text-sm font-bold ml-2">
            <UserCircle className="w-5 h-5" />
            {t('nav', 'login')}
          </Link>
        )}
      </div>
    </header>
  );
}
