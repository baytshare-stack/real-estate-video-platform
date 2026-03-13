"use client";

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Video, Settings, User, Eye, Users, Film, Edit, Trash2, Plus } from 'lucide-react';

export default function StudioDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const MOCK_VIDEOS = Array(4).fill(0).map((_, i) => ({
    id: `vid-${i}`,
    title: `Oceanfront Modern Villa Tour ${i + 1}`,
    views: 12500 + (i * 1000),
    likes: 450 + (i * 20),
    comments: 32 + i,
    date: new Date(Date.now() - (i * 86400000 * 2)).toLocaleDateString(),
    status: 'Published',
    thumbnail: `https://images.unsplash.com/photo-${1600596542815 + i}-ffad4c1539a9?auto=format&fit=crop&q=80&w=200&h=112`
  }));

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0f0f0f] text-white overflow-hidden">
      
      {/* Studio Sidebar */}
      <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 flex flex-col items-center border-b border-gray-800">
          <div className="w-20 h-20 rounded-full bg-blue-600 mb-3 flex items-center justify-center overflow-hidden border-2 border-gray-700">
             <img src="https://ui-avatars.com/api/?name=Creator+Hub&background=random" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-bold text-lg">Your Channel</h2>
          <p className="text-gray-400 text-sm">Creator Studio</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
             <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('content')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'content' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
             <Video className="w-5 h-5" /> Content
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
             <User className="w-5 h-5" /> Profile Info
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
             <Settings className="w-5 h-5" /> Channel Settings
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* Render Tab Content based on active state */}
        {activeTab === 'dashboard' && (
          <div className="max-w-5xl mx-auto">
             <h1 className="text-2xl md:text-3xl font-bold mb-8">Channel Dashboard</h1>
             
             {/* Analytics Overview Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 font-medium tracking-wide text-sm uppercase">Total Views</h3>
                      <div className="p-2 bg-blue-500/10 rounded-lg"><Eye className="w-5 h-5 text-blue-500" /></div>
                   </div>
                   <p className="text-4xl font-bold text-white mb-2">145.2K</p>
                   <p className="text-green-500 text-sm font-medium">+12% this month</p>
                </div>
                
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 font-medium tracking-wide text-sm uppercase">Total Videos</h3>
                      <div className="p-2 bg-purple-500/10 rounded-lg"><Film className="w-5 h-5 text-purple-500" /></div>
                   </div>
                   <p className="text-4xl font-bold text-white mb-2">24</p>
                   <p className="text-gray-500 text-sm font-medium">Uploaded properties</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 font-medium tracking-wide text-sm uppercase">Subscribers</h3>
                      <div className="p-2 bg-emerald-500/10 rounded-lg"><Users className="w-5 h-5 text-emerald-500" /></div>
                   </div>
                   <p className="text-4xl font-bold text-white mb-2">8,405</p>
                   <p className="text-green-500 text-sm font-medium">+42 this week</p>
                </div>
             </div>

             {/* Recent Videos Snapshot */}
             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold">Recent Uploads</h2>
                   <Link href="/upload" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                      <Plus className="w-4 h-4" /> Upload Video
                   </Link>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                         <tr className="border-b border-gray-800 text-gray-400 text-sm">
                            <th className="pb-4 font-medium pl-2">Video</th>
                            <th className="pb-4 font-medium">Visibility</th>
                            <th className="pb-4 font-medium">Date</th>
                            <th className="pb-4 font-medium">Views</th>
                            <th className="pb-4 font-medium">Comments</th>
                         </tr>
                      </thead>
                      <tbody>
                         {MOCK_VIDEOS.map(video => (
                           <tr key={video.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors group">
                              <td className="py-4 pl-2 flex items-start gap-4 pr-4">
                                 <img src={video.thumbnail} className="w-24 aspect-video rounded-md object-cover bg-gray-800 shrink-0" alt="thumb" />
                                 <div>
                                    <p className="font-semibold text-white line-clamp-2 text-sm max-w-[200px] leading-tight">{video.title}</p>
                                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                                       <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-4 align-top">
                                 <span className="bg-green-500/10 text-green-400 px-2.5 py-1 rounded-md text-xs font-medium border border-green-500/20">{video.status}</span>
                              </td>
                              <td className="py-4 align-top text-gray-300 text-sm">{video.date}</td>
                              <td className="py-4 align-top text-gray-300 text-sm">{video.views.toLocaleString()}</td>
                              <td className="py-4 align-top text-gray-300 text-sm">{video.comments}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* Tab 2: Profile Management (Placeholder logic) */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto">
             <h1 className="text-2xl font-bold mb-8">Personal Profile</h1>
             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                <div className="flex flex-col gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                     <input type="text" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500" defaultValue="+1 555-0198" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number</label>
                     <input type="text" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500" defaultValue="+1 555-0198" />
                   </div>
                   <button className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg w-fit mt-2 transition-colors">Save Changes</button>
                </div>
             </div>
          </div>
        )}

        {/* Tab 3: Channel Settings (Placeholder logic) */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto">
             <h1 className="text-2xl font-bold mb-8">Channel Customization</h1>
             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Channel Name</label>
                     <input type="text" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500" defaultValue="Elite Real Estate Group" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Channel Description</label>
                     <textarea rows={4} className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500" defaultValue="The premier destination for the world's finest luxury properties."></textarea>
                   </div>
                   
                   <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Branding Assets</h4>
                      <div className="flex items-center gap-6 p-4 border border-dashed border-gray-700 rounded-xl mb-4">
                         <div className="w-16 h-16 rounded-full bg-blue-600 flex-shrink-0"></div>
                         <div>
                            <p className="text-white font-medium">Channel Logo</p>
                            <p className="text-xs text-gray-400 mb-2">Recommended: 800x800 px</p>
                            <button className="text-blue-500 text-sm font-bold">Change</button>
                         </div>
                      </div>
                      <div className="flex items-center gap-6 p-4 border border-dashed border-gray-700 rounded-xl">
                         <div className="w-32 h-12 bg-gray-800 rounded shrink-0"></div>
                         <div>
                            <p className="text-white font-medium">Channel Banner</p>
                            <p className="text-xs text-gray-400 mb-2">Recommended: 2048x1152 px</p>
                            <button className="text-blue-500 text-sm font-bold">Change</button>
                         </div>
                      </div>
                   </div>

                   <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lgmt-4 transition-colors">Publish Changes</button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
