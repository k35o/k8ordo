/**
 * `<input type="file">` の `accept` と同じ規則でファイルを選り分ける。
 * ブラウザがこの規則を当てるのはファイル選択ダイアログだけで、ドロップや
 * 貼り付けで届いたファイルは素通しになるため、自前で当てる。
 */
export const acceptsFile = (file: File, accept: string): boolean => {
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token !== '');
  if (tokens.length === 0) {
    return true;
  }
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith('.')) {
      return name.endsWith(token);
    }
    if (token.endsWith('/*')) {
      return type.startsWith(token.slice(0, -1));
    }
    return type === token;
  });
};

if (import.meta.vitest) {
  describe('acceptsFile', () => {
    it('MIME タイプの完全一致で受け取る', () => {
      expect(
        acceptsFile(
          new File([], 'a.pdf', { type: 'application/pdf' }),
          'application/pdf',
        ),
      ).toBe(true);
      expect(
        acceptsFile(
          new File([], 'a.png', { type: 'image/png' }),
          'application/pdf',
        ),
      ).toBe(false);
    });

    it('image/* は image/ で始まるタイプだけを受け取る', () => {
      expect(
        acceptsFile(new File([], 'a.png', { type: 'image/png' }), 'image/*'),
      ).toBe(true);
      expect(
        acceptsFile(new File([], 'a.txt', { type: 'text/plain' }), 'image/*'),
      ).toBe(false);
    });

    it('拡張子は大文字小文字を区別せずに照らす', () => {
      expect(acceptsFile(new File([], 'NOTE.MD', { type: '' }), '.md')).toBe(
        true,
      );
      expect(
        acceptsFile(new File([], 'note.markdown', { type: '' }), '.md'),
      ).toBe(false);
    });

    it('カンマ区切りのどれかに当たれば受け取る', () => {
      expect(
        acceptsFile(
          new File([], 'a.pdf', { type: 'application/pdf' }),
          'image/*, .pdf',
        ),
      ).toBe(true);
    });

    it('空の accept は何でも受け取る', () => {
      expect(acceptsFile(new File([], 'a.bin', { type: '' }), '')).toBe(true);
    });
  });
}
