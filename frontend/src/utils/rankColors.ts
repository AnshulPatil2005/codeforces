/**
 * Get Tailwind color class for Codeforces rank
 */
export const getRankColor = (rank?: string): string => {
  if (!rank) return 'text-slate-500';

  const lowerRank = rank.toLowerCase();

  if (lowerRank.includes('legendary') || lowerRank.includes('tourist')) {
    return 'text-rose-600';
  }
  if (lowerRank.includes('international grandmaster')) {
    return 'text-orange-600';
  }
  if (lowerRank.includes('grandmaster')) {
    return 'text-orange-500';
  }
  if (lowerRank.includes('international master')) {
    return 'text-orange-400';
  }
  if (lowerRank.includes('master')) {
    return 'text-amber-500';
  }
  if (lowerRank.includes('candidate master')) {
    return 'text-purple-600';
  }
  if (lowerRank.includes('expert')) {
    return 'text-blue-600';
  }
  if (lowerRank.includes('specialist')) {
    return 'text-cyan-600';
  }
  if (lowerRank.includes('pupil')) {
    return 'text-emerald-600';
  }
  if (lowerRank.includes('newbie')) {
    return 'text-slate-500';
  }

  return 'text-slate-500';
};

/**
 * Get Tailwind background color class for Codeforces rank
 */
export const getRankBgColor = (rank?: string): string => {
  if (!rank) return 'bg-slate-100';

  const lowerRank = rank.toLowerCase();

  if (lowerRank.includes('legendary') || lowerRank.includes('tourist')) {
    return 'bg-rose-100';
  }
  if (lowerRank.includes('international grandmaster')) {
    return 'bg-orange-100';
  }
  if (lowerRank.includes('grandmaster')) {
    return 'bg-orange-100';
  }
  if (lowerRank.includes('international master')) {
    return 'bg-orange-50';
  }
  if (lowerRank.includes('master')) {
    return 'bg-amber-50';
  }
  if (lowerRank.includes('candidate master')) {
    return 'bg-purple-100';
  }
  if (lowerRank.includes('expert')) {
    return 'bg-blue-100';
  }
  if (lowerRank.includes('specialist')) {
    return 'bg-cyan-100';
  }
  if (lowerRank.includes('pupil')) {
    return 'bg-emerald-100';
  }
  if (lowerRank.includes('newbie')) {
    return 'bg-slate-100';
  }

  return 'bg-slate-100';
};
