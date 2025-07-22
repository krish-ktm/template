import { useEffect, useState } from 'react';
import { MobileHeader } from './MobileHeader';
import { DesktopHeader } from './DesktopHeader';

export function ResponsiveHeader() {
  return (
    <div className="z-40">
      <div className="lg:hidden">
        <MobileHeader />
      </div>
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>
    </div>
  );
}