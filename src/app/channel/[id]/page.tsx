import VideoCard from '@/components/VideoCard';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const channelId = unwrappedParams.id;
  
  // Real database fetch
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: {
      videos: {
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });

  if (!channel) {
    if (channelId === 'demo') {
       // Allow visual preview of the layout if DB hasn't been seeded yet
    } else {
       notFound();
    }
  }

  // Mock data fallback if "demo" or missing elements 
  const displayChannel = channel || {
    name: "Elite Real Estate Group",
    channelName: "Elite Real Estate Group",
    description: "The premier destination for the world's finest luxury properties.",
    bannerUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000&h=400",
    avatarUrl: "https://ui-avatars.com/api/?name=Elite+Real+Estate&background=random&size=200",
    subscriberCount: 1200000,
    videos: []
  };

  return (
    <div className="w-full bg-[#0f0f0f] min-h-screen">
      {/* Channel Banner */}
      <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-900 overflow-hidden relative">
        <img 
          src={displayChannel.bannerUrl || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000&h=400"} 
          alt="Channel Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
      </div>

      {/* Channel Header Context */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 relative -mt-16 md:-mt-24 pb-8 border-b border-white/10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0f0f0f] overflow-hidden bg-gray-800 shadow-2xl flex-shrink-0">
             <img src={displayChannel.avatarUrl || `https://ui-avatars.com/api/?name=${displayChannel.channelName}&background=random&size=200`} alt={displayChannel.channelName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{displayChannel.channelName}</h1>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-gray-400 mt-2 mb-3 font-medium">
               <span>@{displayChannel.channelName?.replace(/\s+/g, '')}</span>
               <span className="w-1 h-1 rounded-full bg-gray-600 hidden md:block"></span>
               <span>{(displayChannel as any).subscriberCount || 0} subscribers</span>
               <span className="w-1 h-1 rounded-full bg-gray-600 hidden md:block"></span>
               <span>{displayChannel.videos.length} videos</span>
             </div>
             <p className="text-gray-300 max-w-2xl line-clamp-2 md:line-clamp-none text-sm leading-relaxed">{displayChannel.description || 'Welcome to our channel!'}</p>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0 pt-4 flex gap-3">
             <button className="flex-1 md:flex-none px-8 py-2.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Channel Navigation Tabs */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 mt-4 flex gap-8 border-b border-white/10 overflow-x-auto hide-scrollbar">
         <button className="text-white font-medium border-b-2 border-white pb-3 whitespace-nowrap">Home</button>
         <button className="text-gray-400 hover:text-white font-medium pb-3 transition-colors whitespace-nowrap">Videos</button>
         <button className="text-gray-400 hover:text-white font-medium pb-3 transition-colors whitespace-nowrap">Shorts</button>
         <button className="text-gray-400 hover:text-white font-medium pb-3 transition-colors whitespace-nowrap">Playlists</button>
         <button className="text-gray-400 hover:text-white font-medium pb-3 transition-colors whitespace-nowrap">About</button>
      </div>

      {/* Channel Content (Latest Videos) */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <h2 className="text-xl font-bold text-white mb-6">Latest Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
          {displayChannel.videos.length > 0 ? displayChannel.videos.map((video: any) => (
            <VideoCard 
               key={video.id} 
               {...video} 
               channelName={displayChannel.channelName} 
               channelAvatarUrl={displayChannel.avatarUrl}
               location={`${video.city}, ${video.country}`}
            />
          )) : (
            <div className="col-span-full py-12 text-center text-gray-400">
               No videos uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
