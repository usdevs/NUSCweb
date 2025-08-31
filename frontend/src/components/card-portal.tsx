"use client";

import React, { useEffect, useState } from 'react';
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
    <div className="fixed z-[9999] pointer-events-none">
      {children}
    </div>,
    document.body
  );
};

export default CardPortal;