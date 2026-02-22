"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.scss";
import { api } from "@/app/api/api";

type Question = {
  id: string;
  type: "INPUT" | "SINGLEOPTION" | "MULTIPLEOPTION";
  text: string;
  options: { id: string; value: string }[] | null;
  correctAnswer: string | string[] | null;
  order: number;
};

type QuizDetail = {
  id: string;
  title: string;
  questions: Question[];
};

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchQuiz() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getQuiz(id as string);
        setQuiz(data);
      } catch (err: any) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading quiz...</div>;
  }

  if (error || !quiz) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error || "Quiz not found"}</p>
        <Link href="/quizzes" className={styles.backLink}>
          ← Back to all quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{quiz.title}</h1>
        <Link href="/quizzes" className={styles.backLink}>
          ← Back to list
        </Link>
      </div>

      <div className={styles.questions}>
        {quiz.questions.map((q) => (
          <div key={q.id} className={styles.question}>
            <div className={styles.questionHeader}>
              <span className={styles.order}>#{q.order + 1}</span>
              <span className={styles.typeBadge}>{q.type}</span>
            </div>

            <p className={styles.questionText}>{q.text}</p>

            <div className={styles.preview}>
              {q.type === "INPUT" && (
                <div className={styles.inputPreview}>
                  <input
                    type="text"
                    placeholder="Your answer..."
                    disabled
                    className={styles.disabledInput}
                  />
                  {q.correctAnswer && (
                    <div className={styles.correctAnswer}>
                      Correct answer: <strong>{String(q.correctAnswer)}</strong>
                    </div>
                  )}
                </div>
              )}

              {q.type === "SINGLEOPTION" && q.options && (
                <div className={styles.optionsList}>
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`${styles.option} ${
                        q.correctAnswer === opt.id ? styles.correct : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        disabled
                        checked={q.correctAnswer === opt.id}
                      />
                      {opt.value}
                    </label>
                  ))}
                </div>
              )}

              {q.type === "MULTIPLEOPTION" && q.options && (
                <div className={styles.optionsList}>
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`${styles.option} ${
                        Array.isArray(q.correctAnswer) &&
                        q.correctAnswer.includes(opt.id)
                          ? styles.correct
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled
                        checked={
                          Array.isArray(q.correctAnswer) &&
                          q.correctAnswer.includes(opt.id)
                        }
                      />
                      {opt.value}
                    </label>
                  ))}
                </div>
              )}

              {!q.options && q.type !== "INPUT" && (
                <p className={styles.noOptions}>No options defined</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
