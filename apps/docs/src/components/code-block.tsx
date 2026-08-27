import { cn } from '@k8ordo/ui';
import type { FC } from 'react';
import { codeToHtml } from 'shiki';

type Props = {
  code: string;
  lang: 'bash' | 'css' | 'json' | 'md' | 'ts' | 'tsx';
  rounded?: 'all' | 'bottom' | 'none';
};

export const CodeBlock: FC<Props> = async ({ code, lang, rounded = 'all' }) => {
  const html = await codeToHtml(code, {
    lang,
    themes: {
      light: 'min-light',
      dark: 'min-dark',
    },
    defaultColor: false,
  });

  return (
    <div
      className={cn(
        '[&_.shiki]:bg-(--shiki-light-bg)! dark:[&_.shiki]:bg-(--shiki-dark-bg)! [&_.shiki_span]:text-(--shiki-light)! dark:[&_.shiki_span]:text-(--shiki-dark)! [&_code]:text-sm [&_pre]:overflow-x-auto [&_pre]:p-4 focus-visible:[&_pre]:outline-hidden focus-visible:[&_pre]:ring-2 focus-visible:[&_pre]:ring-border-info focus-visible:[&_pre]:ring-inset',
        rounded === 'all' && '[&_pre]:rounded-xl [&_pre]:shadow-sm',
        rounded === 'bottom' && '[&_pre]:rounded-b-xl',
      )}
      // Shiki が生成した signed HTML をそのまま埋め込むため必要
      // oxlint-disable-next-line eslint-plugin-react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
