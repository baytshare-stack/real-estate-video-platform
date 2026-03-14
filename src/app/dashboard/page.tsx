"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Video, TrendingUp, Settings } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user?.role !== "AGENT" && session?.user?.role !== "AGENCY")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Creator Studio Access</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          The dashboard is exclusively for Agents and Agencies.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard', 'title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your channel, properties, and video tours.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link 
              href="/upload-video" 
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Upload Property
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('dashboard', 'totalViews')}</h3>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 28 days</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('dashboard', 'totalLikes')}</h3>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <Settings className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total count</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white">Properties</h3>
               <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                 <Video className="w-5 h-5" />
               </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
               <TrendingUp className="w-3 h-3" /> 0 new this month
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
             <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Uploads</h2>
          </div>
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
             <Video className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500 opacity-50" />
             <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No videos yet</p>
             <p className="mb-4">You haven't uploaded any property videos.</p>
             <Link href="/upload-video" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
               Upload your first video
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
