import { renderHook } from 'vitest-browser-react';

import { useHover } from '.';

describe('useHover', () => {
  it('初期状態ではisHoveredはfalseである', async () => {
    const { result } = await renderHook(() => useHover());
    expect(result.current.isHovered).toBe(false);
  });

  it('onPointerEnterでisHoveredがtrueになる', async () => {
    const { result, act } = await renderHook(() => useHover());

    act(() => {
      result.current.hoverProps.onPointerEnter();
    });

    expect(result.current.isHovered).toBe(true);
  });

  it('onPointerLeaveでisHoveredがfalseになる', async () => {
    const { result, act } = await renderHook(() => useHover());

    act(() => {
      result.current.hoverProps.onPointerEnter();
    });
    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onPointerLeave();
    });
    expect(result.current.isHovered).toBe(false);
  });

  it('hoverPropsにonPointerEnterとonPointerLeaveが含まれる', async () => {
    const { result } = await renderHook(() => useHover());

    expect(result.current.hoverProps).toHaveProperty('onPointerEnter');
    expect(result.current.hoverProps).toHaveProperty('onPointerLeave');
  });
});
