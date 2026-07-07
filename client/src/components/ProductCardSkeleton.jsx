// ============================================================
// BootZone Client - Product Grid Skeleton
// File: client/src/components/ProductCardSkeleton.jsx
// Loading placeholder
// ============================================================

const ProductCardSkeleton = () => {
  return (
    <div className="card-bz overflow-hidden">
      <div className="aspect-square animate-pulse bg-ink-100 dark:bg-ink-800" />
      <div className="p-4">
        <div className="mb-2 h-3 w-20 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
        <div className="h-5 w-24 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
      </div>
    </div>
  );
};

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export { ProductGridSkeleton };
export default ProductCardSkeleton;
