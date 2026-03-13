import VideoCard from '@/components/VideoCard';
import { Flame } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This is a Next.js Server Component, it fetches DB directly on the server
export default async function Home() {
  
  // Fetch real data from sqlite/postgres database
  const videos = await prisma.video.findMany({
    where: { videoFormat: "LONG" }, 
    orderBy: { createdAt: 'desc' },
    include: {
      channel: { select: { channelName: true, avatarUrl: true } }
    },
    take: 16
  });

  const shorts = await prisma.video.findMany({
    where: { videoFormat: "SHORT" },
    orderBy: { createdAt: 'desc' },
    include: {
      channel: { select: { channelName: true, avatarUrl: true } }
    },
    take: 10
  });

  // Since we might not have DB entries right away, fallback mock for visual continuity
  const displayVideos = videos.length > 0 ? videos : MOCK_VIDEOS;
  const displayShorts = shorts.length > 0 ? shorts : MOCK_SHORTS;

  return (
    <div className="p-4 md:p-6 max-w-[2000px] mx-auto min-h-screen">
      
      {/* Filters Strip (Optional, similar to YouTube's top pills) */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 mb-2">
        {['All', 'Mansions', 'Apartments', 'Commercial', 'New York', 'Dubai', 'For Rent', 'Under $1M'].map(filter => (
          <button key={filter} className="whitespace-nowrap px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            {filter}
          </button>
        ))}
      </div>

      {/* Main Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 mb-10">
        {displayVideos.slice(0, 8).map((video: any) => (
          <VideoCard 
            key={video.id} 
            {...video} 
            channelName={video.channelName || video.channel?.channelName}
            channelAvatarUrl={video.channelAvatarUrl || video.channel?.avatarUrl}
            location={`${video.city}, ${video.country || 'USA'}`}
          />
        ))}
      </div>

      {/* Shorts Shelf */}
      <div className="mb-10 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold">Shorts</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {displayShorts.map((short: any) => (
             <VideoCard 
               key={short.id} 
               {...short} 
               isShort={true} 
               channelName={short.channelName || short.channel?.channelName}
               channelAvatarUrl={short.channelAvatarUrl || short.channel?.avatarUrl}
             />
          ))}
        </div>
      </div>

      {/* Additional Video Grid */}
      {displayVideos.length > 8 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 pb-10">
          {displayVideos.slice(8).map((video: any) => (
            <VideoCard 
              key={video.id} 
              {...video} 
              channelName={video.channelName || video.channel?.channelName}
              channelAvatarUrl={video.channelAvatarUrl || video.channel?.avatarUrl}
              location={`${video.city}, ${video.country || 'USA'}`}
            />
          ))}
        </div>
      )}

    </div>
  );
}

// Keep mocks at bottom so the UI continues to render perfectly while the DB is empty
const MOCK_VIDEOS = Array(12).fill(0).map((_, i) => ({
  id: `video-${i}`,
  title: `Luxury Modern Villa in Beverly Hills - Cinematic Tour ${i + 1}`,
  thumbnailUrl: `https://images.unsplash.com/photo-${1600596542815 + i}-ffad4c1539a9?auto=format&fit=crop&q=80&w=800&h=450`,
  price: 5400000 + (i * 100000),
  city: "Beverly Hills",
  country: "USA",
  channelName: "Luxury Estates",
  viewsCount: 15400 + (i * 5000),
  createdAt: new Date(Date.now() - (i * 86400000 * 5)),
  bedrooms: 5 + (i % 3),
  bathrooms: 4 + (i % 2),
  sizeSqm: 520 + (i * 50),
  status: i % 4 === 0 ? "FOR_RENT" as const : "FOR_SALE" as const
}));

const MOCK_SHORTS = Array(8).fill(0).map((_, i) => ({
  id: `short-${i}`,
  title: `Insane $20M Penthouse View! 🏙️ #${i + 1}`,
  thumbnailUrl: `https://images.unsplash.com/photo-${1512917774080 + i}-9991f1c4c750?auto=format&fit=crop&q=80&w=400&h=700`,
  price: 20000000,
  city: "New York",
  country: "USA",
  channelName: "NYC Realty",
  viewsCount: 1200000,
  createdAt: new Date(),
  bedrooms: 3,
  bathrooms: 3.5,
  sizeSqm: 300,
  status: "FOR_SALE" as const
}));
