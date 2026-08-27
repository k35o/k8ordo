'use client';

import { useCallback, useState } from 'react';

type HoverProps = {
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

type UseHoverReturn = {
  isHovered: boolean;
  hoverProps: HoverProps;
};

export const useHover = (): UseHoverReturn => {
  const [isHovered, setIsHovered] = useState(false);

  const onPointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  const onPointerLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    isHovered,
    hoverProps: { onPointerEnter, onPointerLeave },
  };
};
