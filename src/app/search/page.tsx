import { PrismaClient } from '@prisma/client';
import SearchClient from './SearchClient';

const prisma = new PrismaClient();

export default async function SearchAndMapPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const unwrappedParams = await searchParams;
  const query = unwrappedParams.q || '';

  // Extract query filters conceptually, e.g., if q matches 'Miami'
  // In a real sophisticated query we'd do full-text search on title/city/description
  const searchResults = await prisma.video.findMany({
    where: query ? {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { city: { contains: query } },
        { country: { contains: query } }
      ]
    } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      channel: { select: { channelName: true, avatarUrl: true }}
    },
    take: 30
  });

  return (
    <SearchClient initialVideos={searchResults} initialQuery={query} />
  );
}
