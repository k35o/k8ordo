import { Heading } from '@k8ordo/ui';

import { CodeBlock } from '../../../../components/code-block';
import { ComponentCatalog } from '../../../../components/component-catalog';
import { PageTitle } from '../../../../components/page-title';
import { Rich } from '../../../../components/rich';
import { componentGroups } from '../../../../data/component-groups';
import * as m from '../../../../messages';

import page from '../../../../styles/page.module.css';
import styles from '../../../../styles/pages/ui/components.module.css';

export default function Components() {
  return (
    <div className={styles.root}>
      <PageTitle title={m.nav.components} />
      <header className={page.stack}>
        <Heading level="h1">{m.nav.components()}</Heading>
        <p className={styles.lead}>
          <Rich>{m.components.description()}</Rich>
        </p>
      </header>
      <ComponentCatalog
        groups={componentGroups}
        serverPreviews={{
          CodeBlock: (
            <div className={styles.codeBlock}>
              <CodeBlock code="const sum = a + b;" lang="ts" />
            </div>
          ),
        }}
      />
    </div>
  );
}
