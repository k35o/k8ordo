import { CodeBlock } from '@k8ordo/ui/code-block';

import { ApiEntry } from '../../../../components/api-entry';
import { DocPage } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.colorSchemeReference;
const FROM = '@k8ordo/color-scheme';

const PROVIDER_EXAMPLE = `export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  );
}`;

const HOOK_EXAMPLE = `const { scheme, setPreference } = useColorScheme();

<button
  onClick={() => {
    setPreference(scheme === 'dark' ? 'light' : 'dark');
  }}
  type="button"
>
  Toggle
</button>`;

const STATE_EXAMPLE = `const [{ preference }] = useAppState(colorSchemeState);
// 'light' | 'dark' | undefined`;

const HASH_EXAMPLE = `framework({
  mode: 'static',
  csp: {
    'script-src': ["'self'", await colorSchemeScriptHash()],
  },
});`;

export default function ColorSchemeReferencePage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/color-scheme/reference"
    >
      <ApiEntry
        caveats={t.providerCaveats}
        from={FROM}
        id="color-scheme-provider"
        name="ColorSchemeProvider"
        params={[
          {
            name: 'defaultPreference',
            type: "ColorSchemePreference = 'system'",
            description: t.providerDefault,
          },
          {
            name: 'nonce',
            type: 'string | undefined',
            description: t.providerNonce,
          },
          {
            name: 'children',
            type: 'ReactNode',
            description: t.providerChildren,
          },
        ]}
        signature="ColorSchemeProvider(props: ColorSchemeProviderProps): ReactNode"
        summary={t.providerSummary}
      >
        <CodeBlock
          code={PROVIDER_EXAMPLE}
          lang="tsx"
          marks={{ 7: 'highlight', 9: 'highlight' }}
          title="layout.tsx"
        />
      </ApiEntry>

      <ApiEntry
        caveats={t.hookCaveats}
        fields={[
          {
            name: 'scheme',
            type: "'light' | 'dark'",
            description: t.hookScheme,
          },
          {
            name: 'preference',
            type: "'light' | 'dark' | 'system'",
            description: t.hookPreference,
          },
          {
            name: 'setPreference',
            type: '(preference: ColorSchemePreference) => void',
            description: t.hookSetPreference,
          },
        ]}
        from={FROM}
        id="use-color-scheme"
        name="useColorScheme"
        returns={{ type: 'UseColorScheme', description: t.hookReturns }}
        signature="useColorScheme(): UseColorScheme"
        summary={t.hookSummary}
      >
        <CodeBlock code={HOOK_EXAMPLE} lang="tsx" title="scheme-toggle.tsx" />
        <p className="leading-relaxed">
          <Rich>{t.hookExample()}</Rich>
        </p>
      </ApiEntry>

      <ApiEntry
        caveats={t.stateCaveats}
        fields={[
          { name: 'kind', type: "'local'", description: t.stateKind },
          { name: 'key', type: "'color-scheme'", description: t.stateKey },
          { name: 'schema', type: 'ZodMiniObject', description: t.stateSchema },
          {
            name: 'storageKey',
            type: "'k8ordo-state:color-scheme'",
            description: t.stateStorageKey,
          },
          {
            name: 'inlineRead',
            type: '() => string',
            description: t.stateInlineRead,
          },
        ]}
        from={FROM}
        id="color-scheme-state"
        name="colorSchemeState"
        signature={`const colorSchemeState = defineLocalState(
  'color-scheme',
  z.object({ preference: z.optional(z.enum(['light', 'dark'])) }),
);`}
        summary={t.stateSummary}
      >
        <CodeBlock
          code={STATE_EXAMPLE}
          lang="tsx"
          title="stored-preference.tsx"
        />
      </ApiEntry>

      <ApiEntry
        caveats={t.hashCaveats}
        from={FROM}
        id="color-scheme-script-hash"
        name="colorSchemeScriptHash"
        params={[
          {
            name: 'defaultPreference',
            type: "ColorSchemePreference = 'system'",
            description: t.hashDefault,
          },
        ]}
        returns={{ type: 'Promise<string>', description: t.hashReturns }}
        signature={`colorSchemeScriptHash(
  defaultPreference?: ColorSchemePreference,
): Promise<string>`}
        summary={t.hashSummary}
      >
        <CodeBlock code={HASH_EXAMPLE} lang="ts" title="vite.config.ts" />
      </ApiEntry>

      <ApiEntry
        from={FROM}
        id="color-scheme"
        name="ColorScheme"
        signature="type ColorScheme = 'light' | 'dark';"
        summary={t.colorSchemeSummary}
      />

      <ApiEntry
        from={FROM}
        id="color-scheme-preference"
        name="ColorSchemePreference"
        signature="type ColorSchemePreference = ColorScheme | 'system';"
        summary={t.preferenceSummary}
      />

      <ApiEntry
        from={FROM}
        id="color-scheme-provider-props"
        name="ColorSchemeProviderProps"
        signature={`type ColorSchemeProviderProps = {
  readonly defaultPreference?: ColorSchemePreference;
  readonly nonce?: string;
  readonly children: ReactNode;
};`}
        summary={t.providerPropsSummary}
      />

      <ApiEntry
        from={FROM}
        id="use-color-scheme-type"
        name="UseColorScheme"
        signature={`type UseColorScheme = {
  readonly scheme: ColorScheme;
  readonly preference: ColorSchemePreference;
  readonly setPreference: (preference: ColorSchemePreference) => void;
};`}
        summary={t.hookTypeSummary}
      />
    </DocPage>
  );
}
