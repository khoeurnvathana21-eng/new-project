// ============================================================
// BootZone Client - Section Heading
// File: client/src/components/SectionHeading.jsx
// Reusable section header with kicker + title + optional link
// ============================================================

import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const SectionHeading = ({ kicker, title, description, to, linkLabel = 'View all', align = 'left' }) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${align === 'center' ? 'sm:flex-col sm:items-center' : ''}`}>
      <div className={`flex flex-col gap-2 ${alignment}`}>
        {kicker && (
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-flame-600">
            <span className="h-px w-6 bg-flame-500" />
            {kicker}
          </span>
        )}
        <h2 className="font-display text-3xl tracking-tight text-ink-900 sm:text-4xl dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-ink-500 dark:text-ink-400">{description}</p>
        )}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 hover:text-flame-600 dark:text-white"
        >
          {linkLabel}
          <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
