// app/page.tsx
import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Welcome to Quiz Builder</h1>
      <p className={styles.description}>
        Create, manage and preview your custom quizzes easily.
      </p>

      <div className={styles.actions}>
        <Link href="/create" className={styles.btnPrimary}>
          Create New Quiz
        </Link>
        <Link href="/quizzes" className={styles.btnOutline}>
          View All Quizzes
        </Link>
      </div>
    </div>
  );
}