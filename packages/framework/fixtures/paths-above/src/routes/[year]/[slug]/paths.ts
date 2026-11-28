const paths = ({ year }: { readonly year: unknown }): string[] => [
  year === 2024 ? 'number' : `${typeof year}-${String(year)}`,
];

export default paths;
