import { X, Facebook, MessageCircle, Send, Link as LinkIcon, Instagram, Video } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function ShareModal({ isOpen, onClose, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://real-estate-platform.com';
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25D366]', hover: 'hover:bg-[#20bd5a]', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { name: 'Telegram', icon: Send, color: 'bg-[#0088cc]', hover: 'hover:bg-[#007ab8]', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', hover: 'hover:bg-[#166fe5]', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Share Video</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 md:p-6 grid grid-cols-4 gap-4">
          {shareLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              target="_blank" 
              rel="noreferrer"
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${link.color} ${link.hover} transition-all group-hover:scale-110 shadow-lg`}>
                <link.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center">{link.name}</span>
            </a>
          ))}
          
          {/* Instagram / TikTok don't have standard web share intents for regular URLs, so we prompt to copy */}
          <div onClick={handleCopy} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 hover:opacity-90 transition-all group-hover:scale-110 shadow-lg`}>
              <Instagram className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center">Instagram</span>
          </div>

          <div onClick={handleCopy} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-black border border-gray-700 hover:border-gray-500 transition-all group-hover:scale-110 shadow-lg`}>
              <Video className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center">TikTok</span>
          </div>
        </div>

        <div className="p-4 bg-gray-950 border-t border-gray-800">
          <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">Page Link</p>
          <div className="flex gap-2">
            <input 
              readOnly 
              value={currentUrl} 
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none"
            />
            <button 
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
