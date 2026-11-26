export const createLineBuffer = () => {
  let rest = '';
  return {
    push(text: string): string[] {
      const lines = `${rest}${text}`.split('\n');
      rest = lines.pop() ?? '';
      return lines.filter((line) => line.trim() !== '');
    },
    flush(): string[] {
      const last = rest;
      rest = '';
      return last.trim() === '' ? [] : [last];
    },
  };
};
