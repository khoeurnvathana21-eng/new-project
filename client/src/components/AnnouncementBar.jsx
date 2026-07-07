// ============================================================
// BootZone Client - Announcement Bar
// File: client/src/components/AnnouncementBar.jsx
// ============================================================

import { FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

const AnnouncementBar = () => {
  return (
    <div className="bg-ink-900 text-white">
      <div className="container-bz flex h-9 items-center justify-between text-[11px] font-medium uppercase tracking-wider">
        <div className="hidden items-center gap-2 md:flex">
          <FiTruck className="h-3.5 w-3.5 text-flame-500" />
          <span>Free shipping on orders over $150</span>
        </div>
        <div className="flex items-center gap-2">
          <FiShield className="h-3.5 w-3.5 text-flame-500" />
          <span>100% authentic boots</span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <FiRefreshCw className="h-3.5 w-3.5 text-flame-500" />
          <span>30-day easy returns</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
