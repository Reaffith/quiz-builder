"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.scss";
import { api } from "../api/api";

type QuizItem = {
  id: string;
  title: string;
  questionsCount: number;
};

type ResponseData = {
  data: QuizItem[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const json = await api.getQuizzes(offset, limit);
        setQuizzes(json.data);
        setTotal(json.total);
      } catch (err: any) {
        setError(err.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, [offset]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await api.deleteQuiz(id);

      setQuizzes((prev) => prev.filter((q) => q.id !== id));

      if (quizzes.length === 1 && offset > 0) {
        setOffset((prev) => Math.max(0, prev - limit));
      }
    } catch (err: any) {
      alert("Error deleting quiz: " + err.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>All Quizzes</h1>
        <Link href="/create" className={styles.createBtn}>
          + Create New Quiz
        </Link>
      </div>

      {loading && <p className={styles.loading}>Loading quizzes...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && quizzes.length === 0 && (
        <p className={styles.empty}>No quizzes yet. Create one!</p>
      )}

      <div className={styles.grid}>
        {quizzes.map((quiz) => (
          <div key={quiz.id} className={styles.card}>
            <Link href={`/quizzes/${quiz.id}`} className={styles.cardLink}>
              <h3 className={styles.cardTitle}>{quiz.title}</h3>
              <p className={styles.cardCount}>
                {quiz.questionsCount} question
                {quiz.questionsCount !== 1 ? "s" : ""}
              </p>
            </Link>

            <button
              onClick={() => handleDelete(quiz.id)}
              className={styles.deleteBtn}
              title="Delete quiz"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          disabled={offset === 0}
          onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
          className={styles.pageBtn}
        >
          Previous
        </button>

        <span className={styles.pageInfo}>
          Showing {offset + 1}–{Math.min(offset + quizzes.length)} of {total}
        </span>

        <button
          disabled={!quizzes.length || quizzes.length < limit}
          onClick={() => setOffset((prev) => prev + limit)}
          className={styles.pageBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}
