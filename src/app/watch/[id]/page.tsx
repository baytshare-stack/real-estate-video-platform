"use client";

import { useState, useEffect, use } from 'react';
import { ThumbsUp, Share2, PhoneCall, MessageCircle, MapPin, Bed, Bath, Maximize, Bell } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import Link from 'next/link';

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const videoId = unwrappedParams.id;
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/video/watch?videoId=${videoId}`);
        if (!res.ok) throw new Error('Failed to fetch video');
        const data = await res.json();
        setVideoData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchVideo();
  }, [videoId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading video...</div>;
  if (error || !videoData?.video) return <div className="min-h-screen flex items-center justify-center text-white">Error loading video or not found. <Link href="/" className="ml-2 text-blue-500">Go home</Link></div>;

  const { video, channel, contact, recommendations } = videoData;

  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(video.price);
  const locationString = `${video.city}, ${video.country}`;

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-6 lg:grid lg:grid-cols-[1fr_400px] gap-6">
      
      {/* Primary Column: Video & Details */}
      <div className="flex flex-col gap-4 w-full overflow-hidden">
        
        {/* The Video Player Area */}
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative flex items-center justify-center">
            {video.videoUrl ? (
                <video src={video.videoUrl} controls className="w-full h-full object-contain" poster={video.thumbnailUrl} />
            ) : (
               <div className="text-gray-500 flex flex-col items-center">
                  <PlaySquareIcon className="w-16 h-16 text-gray-700 mb-2" />
                  <p>Processing Video Stream</p>
               </div>
            )}
        </div>

        {/* Video Title */}
        <h1 className="text-xl md:text-2xl font-bold text-white mt-2 font-[family-name:var(--font-geist-sans)] line-clamp-2 leading-tight">{video.title}</h1>

        {/* Interactions & Channel Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-800">
            
            <div className="flex items-center gap-3">
                <Link href={`/channel/${channel.id}`}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-800 shrink-0">
                        <img src={channel.avatarUrl || `https://ui-avatars.com/api/?name=${channel.name}&background=random`} alt={channel.name} className="w-full h-full object-cover" />
                    </div>
                </Link>
                <div className="flex flex-col justify-center">
                    <Link href={`/channel/${channel.id}`}>
                        <h3 className="text-white font-medium text-base md:text-lg leading-tight hover:text-blue-400 transition-colors line-clamp-1">{channel.name}</h3>
                    </Link>
                    <p className="text-gray-400 text-xs md:text-sm">{channel.subscriberCount || 0} subscribers</p>
                </div>
                <button 
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`ml-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium transition-colors flex items-center gap-2 text-sm ${
                        isSubscribed ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-black hover:bg-gray-200'
                    }`}
                >
                    {isSubscribed ? <><Bell className="w-4 h-4" /> Subscribed</> : 'Subscribe'}
                </button>
            </div>

            <div className="flex items-center gap-1 md:gap-2 bg-gray-900 rounded-full p-1 border border-gray-800 shrink-0">
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 hover:bg-white/10 rounded-full transition-colors text-white text-sm font-medium">
                    <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" /> {video.likesCount}
                </button>
                <div className="w-[1px] h-5 md:h-6 bg-gray-700"></div>
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 hover:bg-white/10 rounded-full transition-colors text-white text-sm font-medium">
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" /> Share
                </button>
            </div>
        </div>

        {/* Property Information Card (Below Video Layout as requested) */}
        <div className="bg-gray-900/50 rounded-2xl p-4 md:p-5 border border-gray-800 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{formattedPrice}</h2>
                <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                   <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded font-bold text-xs">{video.status === 'FOR_SALE' ? 'FOR SALE' : 'FOR RENT'}</span>
                   <span>• {video.viewsCount || 0} views • {new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex flex-wrap gap-4 py-3 md:py-4 border-y border-gray-800/50 my-3 md:my-4">
                <div className="flex items-center gap-2 text-gray-300">
                    <Bed className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    <span className="text-sm md:text-base"><strong className="text-white">{video.bedrooms}</strong> Beds</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <Bath className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    <span className="text-sm md:text-base"><strong className="text-white">{video.bathrooms}</strong> Baths</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <Maximize className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    <span className="text-sm md:text-base"><strong className="text-white">{video.sizeSqm}</strong> Sqm</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 w-full sm:w-auto mt-1 sm:mt-0">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 shrink-0" />
                    <span className="text-sm md:text-base truncate"><strong className="text-white">{locationString}</strong></span>
                </div>
            </div>

            <p className="text-gray-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                {video.description}
            </p>

            {/* Contact Action Buttons */}
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
                <a 
                    href={contact.whatsappLink || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 py-3 px-4 md:px-6 rounded-xl font-bold text-base md:text-lg transition-colors shadow-lg shadow-[#25D366]/20"
                >
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> WhatsApp
                </a>
                <button className="flex-1 bg-white hover:bg-gray-200 text-black flex items-center justify-center gap-2 py-3 px-4 md:px-6 rounded-xl font-bold text-base md:text-lg transition-colors shadow-lg shadow-white/10">
                    <PhoneCall className="w-5 h-5 md:w-6 md:h-6" /> {contact.phoneCode} {contact.phoneNumber}
                </button>
            </div>
        </div>

        {/* Comment Section Placeholder */}
        <div className="mt-6">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4">Comments</h3>
            <div className="flex gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-white">U</div>
                <div className="flex-1 border-b border-gray-700 pb-2 focus-within:border-white transition-colors">
                    <input type="text" placeholder="Add a comment..." className="w-full bg-transparent outline-none text-white pb-1 text-sm md:text-base" />
                </div>
            </div>
        </div>

      </div>

      {/* Secondary Column: Recommendations */}
      <div className="hidden lg:flex flex-col gap-4 min-w-0">
        <h3 className="text-lg font-bold text-white">Recommended Properties</h3>
        {recommendations?.map((rec: any) => (
           <VideoCard 
             key={rec.id} 
             {...rec}
             channelName={rec.channel?.channelName}
             channelAvatarUrl={rec.channel?.avatarUrl}
           />
        ))}
      </div>

    </div>
  );
}

function PlaySquareIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 8 6 4-6 4Z"/></svg>
}
