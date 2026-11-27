const paths = ({ year }: { readonly year: unknown }): string[] => {
  if (typeof year !== 'number') {
    throw new TypeError(
      `[year]/[slug]/paths.ts was asked under ${String(year)}`,
    );
  }
  return ['entry'];
};

export default paths;
