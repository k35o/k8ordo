import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { Rich } from '../rich';

/**
 * What the framework signs, the same under both modes; how the policy is
 * written is the mode's own. A function rather than a component, so `DocPage`
 * sees the section and lists it in the contents.
 */
export const signedSection = () => {
  const t = m.frameworkCsp;
  return (
    <DocSection
      description={t.signedDescription}
      id="signed"
      title={t.signedTitle}
    >
      <p>
        <Rich>{t.signedScripts()}</Rich>
      </p>
      <p>
        <Rich>{t.signedOwn()}</Rich>
      </p>
    </DocSection>
  );
};
