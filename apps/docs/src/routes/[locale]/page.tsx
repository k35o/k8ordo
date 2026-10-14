'use client';

import type { Message } from '@k8ordo/i18n';
import { Button, GitHubIcon, Heading } from '@k8ordo/ui';

import { Rich } from '../../components/rich';
import { PACKAGES } from '../../data/packages';
import { href } from '../../links';
import * as m from '../../messages';

import styles from '../../styles/pages/home.module.css';

type Discipline = { title: Message; description: Message };

const DISCIPLINES: Discipline[] = [
  {
    title: m.home.disciplinePlatform,
    description: m.home.disciplinePlatformDescription,
  },
  {
    title: m.home.disciplineReact,
    description: m.home.disciplineReactDescription,
  },
  {
    title: m.home.disciplineTypes,
    description: m.home.disciplineTypesDescription,
  },
  {
    title: m.home.disciplineAgents,
    description: m.home.disciplineAgentsDescription,
  },
];

export default function Home() {
  return (
    <div className={styles.root}>
      {/* サイトの表紙だけは「k8ordo · k8ordo」にならないよう素の title */}
      <title>k8ordo</title>
      <section className={styles.hero}>
        <div className={styles.heroBody}>
          {/* Heading は className を受けないため、ヒーローのみ生 h1（サイト内この1箇所限定） */}
          <h1 className={styles.title}>
            k8ordo
            <span aria-hidden className={styles.dot} />
          </h1>
          <p className={styles.description}>{m.home.description()}</p>
          <div className={styles.actions}>
            <Button
              renderItem={({ className, children }) => (
                <a className={className} href={href('/:locale/ui')}>
                  {children}
                </a>
              )}
              size="md"
              variant="solid"
            >
              {m.home.exploreUi()}
            </Button>
            <Button
              color="base"
              renderItem={({ className, children }) => (
                <a
                  className={className}
                  href="https://github.com/k35o/k8ordo"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              )}
              size="md"
              startIcon={<GitHubIcon />}
              variant="skeleton"
            >
              {m.common.github()}
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.members}>
        <Heading level="h2">{m.home.membersTitle()}</Heading>
        <ul className={styles.memberList}>
          {PACKAGES.map((pkg) => (
            <li key={pkg.name}>
              <a className={styles.member} href={href(pkg.path)}>
                <span className={styles.memberName}>{pkg.name}</span>
                <span className={styles.memberDescription}>
                  <Rich>{pkg.description()}</Rich>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.disciplines}>
        <Heading level="h2">{m.home.disciplineTitle()}</Heading>
        <ol className={styles.disciplineList}>
          {DISCIPLINES.map((discipline) => (
            <li className={styles.discipline} key={discipline.title()}>
              <div className={styles.disciplineBody}>
                <p className={styles.disciplineTitle}>{discipline.title()}</p>
                <p className={styles.disciplineDescription}>
                  <Rich>{discipline.description()}</Rich>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
