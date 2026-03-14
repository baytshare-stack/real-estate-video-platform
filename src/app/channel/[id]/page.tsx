import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import { getServerTranslation } from "@/i18n/server";

export default async function ChannelPage({ params }: { params: { id: string } }) {
  const unwrappedParams = await params;
  const channelId = unwrappedParams.id;
  const { t } = await getServerTranslation();
  
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: {
      owner: true,
      videos: {
        include: { property: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!channel) return notFound();

  return (
    <div className="w-full bg-[#0f0f0f] min-h-screen">
      {/* Channel Banner */}
      <div className="w-full h-48 md:h-64 lg:h-80 bg-gradient-to-r from-indigo-900 to-purple-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
      </div>

      {/* Channel Header Context */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 relative -mt-16 md:-mt-24 pb-8 border-b border-white/10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0f0f0f] overflow-hidden bg-gray-800 shadow-2xl flex-shrink-0">
             <img 
               src={channel.avatar || `https://ui-avatars.com/api/?name=${channel.name}&background=random&size=200`} 
               alt={channel.name} 
               className="w-full h-full object-cover" 
             />
          </div>
          <div className="flex-1 text-center md:text-left">
             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{channel.name}</h1>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-gray-400 mt-2 mb-3 font-medium">
               <span>@{channel.name.replace(/\s+/g, '')}</span>
               <span className="w-1 h-1 rounded-full bg-gray-600 hidden md:block"></span>
               <span className="text-indigo-400">{channel.owner.role === 'AGENCY' ? 'Real Estate Agency' : 'Real Estate Agent'}</span>
               <span className="w-1 h-1 rounded-full bg-gray-600 hidden md:block"></span>
               <span>{channel.videos.length} {t('channel', 'videos')}</span>
             </div>
             <p className="text-gray-300 max-w-2xl line-clamp-2 md:line-clamp-none text-sm leading-relaxed">
               {channel.description || 'Welcome to our channel! Explore our property video tours.'}
             </p>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0 pt-4 flex gap-3">
             <button className="flex-1 md:flex-none px-8 py-2.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
               Subscribe
             </button>
             <button className="flex-1 md:flex-none px-8 py-2.5 rounded-full bg-transparent border border-white text-white font-bold hover:bg-white/10 transition-colors">
               Contact
             </button>
          </div>
        </div>
      </div>

      {/* Channel Navigation Tabs */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 mt-4 flex gap-8 border-b border-white/10 overflow-x-auto hide-scrollbar">
         <button className="text-white font-medium border-b-2 border-white pb-3 whitespace-nowrap">Home</button>
         <button className="text-gray-400 hover:text-white font-medium pb-3 transition-colors whitespace-nowrap">Properties ({channel.videos.length})</button>
         <button className="text-gray-400 hover:text-white font-medium pb-3 transition-colors whitespace-nowrap">About</button>
      </div>

      {/* Channel Content (Latest Videos) */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <h2 className="text-xl font-bold text-white mb-6">Latest Property Tours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
          {channel.videos.length > 0 ? channel.videos.map((video) => (
            <VideoCard 
               key={video.id} 
               id={video.id}
               title={video.title}
               thumbnailUrl={video.thumbnail || ""}
               price={Number(video.property?.price || 0)}
               location={video.property ? `${video.property.city}, ${video.property.country}` : "Unknown location"}
               channelName={channel.name} 
               channelAvatarUrl={channel.avatar || undefined}
               viewsCount={Math.floor(Math.random() * 5000)} // Mock data for views since we don't have it explicitly
               createdAt={video.createdAt}
               bedrooms={video.property?.bedrooms || undefined}
               bathrooms={video.property?.bathrooms || undefined}
               sizeSqm={video.property?.sizeSqm || undefined}
               status={video.property?.status}
            />
          )) : (
            <div className="col-span-full py-12 text-center text-gray-400">
               No property video tours uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
