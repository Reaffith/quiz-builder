// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./layout.module.scss"; 
import "./globals.scss";                   

export const metadata: Metadata = {
  title: "Quiz Builder",
  description: "Create and manage quizzes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <div className={styles.header__inner}>
            <Link href="/" className={styles.logo}>
              Quiz Builder
            </Link>

            <nav className={styles.nav}>
              <Link href="/quizzes" className={styles.nav__link}>
                All Quizzes
              </Link>
              <Link
                href="/create"
                className={`${styles.nav__link} ${styles["nav__link--primary"]}`}
              >
                + Create Quiz
              </Link>
            </nav>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.container}>{children}</div>
        </main>
      </body>
    </html>
  );
} 