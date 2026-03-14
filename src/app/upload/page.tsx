"use client";

import { useState } from 'react';
import { UploadCloud, Video, Info, MapPin, DollarSign, List, PhoneCall } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n/LanguageProvider';

const LOCATION_DATA = {
  "USA": { currency: "USD", symbol: "$", cities: ["New York", "Los Angeles", "Miami", "Beverly Hills", "Chicago"] },
  "UAE": { currency: "AED", symbol: "د.إ", cities: ["Dubai", "Abu Dhabi", "Sharjah"] },
  "UK": { currency: "GBP", symbol: "£", cities: ["London", "Manchester", "Birmingham"] },
  "Egypt": { currency: "EGP", symbol: "E£", cities: ["Cairo", "Alexandria", "Giza"] },
  "Saudi Arabia": { currency: "SAR", symbol: "ر.س", cities: ["Riyadh", "Jeddah", "Mecca"] },
};

type CountryKey = keyof typeof LOCATION_DATA;

export default function UploadPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey | "">("");
  const [selectedCity, setSelectedCity] = useState("");
  const [useWhatsAppSameAsPhone, setUseWhatsAppSameAsPhone] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const currentCurrencySymbol = selectedCountry ? LOCATION_DATA[selectedCountry].symbol : "$";
  const availableCities = selectedCountry ? LOCATION_DATA[selectedCountry].cities : [];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value as CountryKey);
    setSelectedCity(""); // Reset city when country changes
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPublishing(true);
    
    // Quick extraction of form data for simplicity
    const formData = new FormData(e.currentTarget);
    const data = {
       title: formData.get("title"),
       description: formData.get("description"),
       propertyType: formData.get("propertyType"),
       status: formData.get("status"),
       bedrooms: formData.get("bedrooms"),
       bathrooms: formData.get("bathrooms"),
       sizeSqm: formData.get("sizeSqm"),
       price: formData.get("price"),
       country: selectedCountry,
       city: selectedCity,
       videoFormat: formData.get("videoFormat"),
    };

    try {
       const res = await fetch("/api/video/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
       });

       if (!res.ok) {
          throw new Error("Failed to upload video");
       }
       const result = await res.json();
       router.push(`/watch/${result.videoId}`);
    } catch (err) {
       console.error("Upload error", err);
       alert("Error uploading property.");
       setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('upload', 'title')}</h1>
        <p className="text-gray-400">Share your listing with thousands of potential buyers globally.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-8">
          
          {/* Section: Video File */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <Video className="text-blue-500 w-5 h-5"/> Video File
            </h2>
            <div className="w-full h-48 border-2 border-dashed border-gray-700 hover:border-blue-500 hover:bg-white/[0.02] rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group mb-4">
               <UploadCloud className="w-12 h-12 text-gray-500 group-hover:text-blue-500 mb-3 transition-colors" />
               <p className="text-gray-300 font-medium">Drag & drop video, or click to browse</p>
               <p className="text-gray-500 text-sm mt-1">Supports MP4, WebM (Long videos or Vertical Shorts)</p>
            </div>
            <div className="flex gap-4">
              <label className="flex-1 rounded-lg border border-gray-700 bg-gray-800 p-4 cursor-pointer hover:border-blue-500">
                 <input type="radio" name="videoFormat" value="LONG" className="mr-2" defaultChecked />
                 <span className="font-medium text-white">Standard Video (16:9)</span>
                 <p className="text-xs text-gray-400 mt-1 block pl-6">Best for full property tours and cinematic walkthroughs.</p>
              </label>
              <label className="flex-1 rounded-lg border border-gray-700 bg-gray-800 p-4 cursor-pointer hover:border-blue-500">
                 <input type="radio" name="videoFormat" value="SHORT" className="mr-2" />
                 <span className="font-medium text-white">Short Video (9:16)</span>
                 <p className="text-xs text-gray-400 mt-1 block pl-6">Vertical format, appears in the high-engagement Shorts feed.</p>
              </label>
            </div>
          </section>

          <hr className="border-gray-800" />

          {/* Section: Basic Info */}
          <section>
             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
               <Info className="text-blue-500 w-5 h-5"/> Property Details
             </h2>
             <div className="flex flex-col gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'videoTitle')}</label>
                 <input type="text" name="title" required className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Stunning Modern Villa in Beverly Hills" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'description')}</label>
                 <textarea rows={4} name="description" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="Tell buyers about the unique features..."></textarea>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'propertyType')}</label>
                    <select name="propertyType" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option value="VILLA">Villa</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="LAND">Land</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="HOUSE">House</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'status')}</label>
                    <select name="status" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option value="FOR_SALE">For Sale</option>
                      <option value="FOR_RENT">For Rent</option>
                    </select>
                  </div>
               </div>
             </div>
          </section>

          <hr className="border-gray-800" />

          {/* Section: Specifications */}
          <section>
             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
               <List className="text-blue-500 w-5 h-5"/> Specifications & Price
             </h2>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'bedrooms')}</label>
                   <input type="number" name="bedrooms" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. 4" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'bathrooms')}</label>
                   <input type="number" step="0.5" name="bathrooms" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. 3.5" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'size')}</label>
                   <input type="number" name="sizeSqm" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. 250" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                     {t('upload', 'price')} <span className="bg-gray-800 text-gray-300 text-xs px-1.5 py-0.5 rounded">{selectedCountry ? LOCATION_DATA[selectedCountry as CountryKey].currency : 'USD'}</span>
                   </label>
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{currentCurrencySymbol}</span>
                     <input type="number" name="price" required className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="Price" />
                   </div>
                </div>
             </div>
          </section>

          <hr className="border-gray-800" />

          {/* Section: Location */}
          <section>
             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
               <MapPin className="text-blue-500 w-5 h-5"/> Location Settings
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'country')}</label>
                   <select 
                     className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                     value={selectedCountry}
                     onChange={handleCountryChange}
                     required
                   >
                     <option value="" disabled>Select Country</option>
                     {Object.keys(LOCATION_DATA).map(country => (
                       <option key={country} value={country}>{country}</option>
                     ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'city')}</label>
                   <select 
                     className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                     value={selectedCity}
                     onChange={(e) => setSelectedCity(e.target.value)}
                     disabled={!selectedCountry}
                     required
                   >
                     <option value="" disabled>Select City</option>
                     {availableCities.map(city => (
                       <option key={city} value={city}>{city}</option>
                     ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">{t('upload', 'address')}</label>
                   <input type="text" name="area" className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="Enter neighborhood" />
                </div>
             </div>
          </section>

          {/* Submit Action */}
          <div className="bg-gray-950 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 border-t border-gray-800 flex justify-end gap-4 mt-4">
             <button type="button" disabled={isPublishing} className="px-6 py-2.5 rounded-lg text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">Save as Draft</button>
             <button type="submit" disabled={isPublishing} className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50">
               {isPublishing ? "Publishing..." : t('upload', 'submit')}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}
