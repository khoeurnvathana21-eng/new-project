// ============================================================
// BootZone Client - Loader Spinner
// File: client/src/components/Loader.jsx
// ============================================================

const Loader = ({ size = 'md', label }) => {
  const sizeClass = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  }[size] || 'h-8 w-8 border-2';

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizeClass} animate-spin rounded-full border-ink-200 border-t-flame-500 dark:border-ink-700`} />
      {label && <p className="text-sm text-ink-500 dark:text-ink-400">{label}</p>}
    </div>
  );
};

export default Loader;
