// ============================================================
// BootZone Client - Empty State
// File: client/src/components/EmptyState.jsx
// ============================================================

import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionTo }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-ink-50 px-6 py-16 text-center dark:border-ink-700 dark:bg-ink-900">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-card dark:bg-ink-800">
          <Icon className="h-7 w-7 text-ink-400" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-ink-900 dark:text-white">{title}</h3>
      {description && <p className="mb-6 max-w-md text-sm text-ink-500 dark:text-ink-400">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
