'use client';

import * as m from '../messages';
import { FRAME } from './frame';

import styles from './footer.module.css';

const RESOURCE_LINKS = [
  { href: 'https://github.com/k35o/k8ordo', label: 'GitHub' },
  { href: 'https://www.npmjs.com/search?q=%40k8ordo', label: 'npm' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${FRAME} ${styles.main}`}>
        <div className={styles.brand}>
          <span className={styles.mark}>
            <span className={styles.wordmark}>k8ordo</span>
            <span aria-hidden className={styles.dot} />
          </span>
          <p className={styles.tagline}>{m.footer.tagline()}</p>
        </div>
        <nav aria-label={m.footer.resources()}>
          <ul className={styles.links}>
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className={styles.link}
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`${FRAME} ${styles.legal}`}>
        <p className={styles.note}>
          <span className={styles.year}>© 2026</span> k8o — MIT License
        </p>
        <p className={styles.typesetting}>{m.footer.typesetting()}</p>
      </div>
    </footer>
  );
}
