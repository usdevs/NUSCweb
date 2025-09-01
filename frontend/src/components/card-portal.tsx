'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface CardPortalProps {
  children: React.ReactNode;
}

const CardPortal: React.FC<CardPortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className='pointer-events-none fixed z-[9999]'>{children}</div>,
    document.body,
  );
};

export default CardPortal;
