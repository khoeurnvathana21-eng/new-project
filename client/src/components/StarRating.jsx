// ============================================================
// BootZone Client - Star Rating
// File: client/src/components/StarRating.jsx
// ============================================================

import { FiStar } from 'react-icons/fi';
import { buildStars } from '../utils/helpers.js';

const sizeMap = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const StarRating = ({ rating = 0, size = 'sm', showCount = false, count = 0 }) => {
  const stars = buildStars(rating);
  const sz = sizeMap[size] || sizeMap.sm;

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s, i) => (
        <FiStar
          key={i}
          className={`${sz} ${s.filled ? 'fill-flame-500 text-flame-500' : 'fill-none text-ink-300 dark:text-ink-600'}`}
        />
      ))}
      {showCount && count > 0 && (
        <span className="ml-1 text-xs text-ink-500 dark:text-ink-400">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
