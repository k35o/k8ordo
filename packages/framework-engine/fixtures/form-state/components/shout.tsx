'use client';

export function Shout({ text }: { text: string }) {
  return <strong data-testid="shout">{text}</strong>;
}
