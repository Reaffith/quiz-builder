// app/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { api } from "../api/api";

type QuestionType = "INPUT" | "SINGLEOPTION" | "MULTIPLEOPTION";

type QuestionForm = {
  type: QuestionType;
  text: string;
  options: { id: string; value: string }[];
  correctAnswer: string | string[] | null;
  order: number;
};

export default function CreateQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { type: "INPUT", text: "", options: [], correctAnswer: null, order: 0 },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addQuestion = () => {
    const newOrder = questions.length;
    setQuestions([
      ...questions,
      {
        type: "INPUT",
        text: "",
        options: [],
        correctAnswer: null,
        order: newOrder,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    const updated = newQuestions.map((q, i) => ({ ...q, order: i }));
    setQuestions(updated);
  };

  const updateQuestion = (
    index: number,
    field: keyof QuestionForm,
    value: any,
  ) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    const q = newQuestions[qIndex];
    const newId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    q.options.push({ id: newId, value: "" });
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex].value = value;
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(optIndex, 1);
    setQuestions(newQuestions);
  };

  const toggleCorrectOption = (qIndex: number, optId: string) => {
    const q = questions[qIndex];
    let newCorrect: string | string[] | null;

    if (q.type === "SINGLEOPTION") {
      newCorrect = q.correctAnswer === optId ? null : optId;
    } else if (q.type === "MULTIPLEOPTION") {
      const current = (q.correctAnswer as string[]) || [];
      newCorrect = current.includes(optId)
        ? current.filter((id) => id !== optId)
        : [...current, optId];
      if (newCorrect.length === 0) newCorrect = null;
    } else {
      return;
    }

    updateQuestion(qIndex, "correctAnswer", newCorrect);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!title.trim()) {
      setError("Quiz title is required");
      setSubmitting(false);
      return;
    }

    if (questions.some((q) => !q.text.trim())) {
      setError("All questions must have text");
      setSubmitting(false);
      return;
    }
    const payload = {
      title,
      questions: questions.map((q) => ({
        type: q.type,
        text: q.text.trim(),
        options: q.type !== "INPUT" ? q.options : null,
        correctAnswer: q.correctAnswer,
        order: q.order,
      })),
    };

    try {
      await api.createQuiz(payload);

      alert("Quiz created successfully!");
      router.push("/quizzes");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create New Quiz</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Quiz Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ukrainian History Basics"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.questionsSection}>
          <h2>Questions</h2>

          {questions.map((q, index) => (
            <div key={index} className={styles.questionBlock}>
              <div className={styles.questionHeader}>
                <span className={styles.qNumber}>Question {index + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className={styles.removeBtn}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className={styles.field}>
                <label>Type</label>
                <select
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(
                      index,
                      "type",
                      e.target.value as QuestionType,
                    )
                  }
                  className={styles.select}
                >
                  <option value="INPUT">Short text (INPUT)</option>
                  <option value="SINGLEOPTION">Single choice</option>
                  <option value="MULTIPLEOPTION">Multiple choice</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Question text</label>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) =>
                    updateQuestion(index, "text", e.target.value)
                  }
                  placeholder="e.g. What is the capital of Ukraine?"
                  required
                  className={styles.input}
                />
              </div>

              {(q.type === "SINGLEOPTION" || q.type === "MULTIPLEOPTION") && (
                <div className={styles.optionsSection}>
                  <h4>Options</h4>
                  {q.options.map((opt, optIndex) => (
                    <div key={opt.id} className={styles.optionRow}>
                      <input
                        type="text"
                        value={opt.value}
                        onChange={(e) =>
                          updateOption(index, optIndex, e.target.value)
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className={styles.optionInput}
                      />

                      <label className={styles.correctLabel}>
                        <input
                          type={
                            q.type === "SINGLEOPTION" ? "radio" : "checkbox"
                          }
                          name={`correct-${index}`}
                          checked={
                            q.type === "SINGLEOPTION"
                              ? q.correctAnswer === opt.id
                              : Array.isArray(q.correctAnswer) &&
                                q.correctAnswer.includes(opt.id)
                          }
                          onChange={() => toggleCorrectOption(index, opt.id)}
                        />
                        Correct
                      </label>

                      <button
                        type="button"
                        onClick={() => removeOption(index, optIndex)}
                        className={styles.removeOption}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className={styles.addOption}
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {q.type === "INPUT" && q.correctAnswer !== null && (
                <div className={styles.field}>
                  <label>Correct answer (optional)</label>
                  <input
                    type="text"
                    value={String(q.correctAnswer)}
                    onChange={(e) =>
                      updateQuestion(index, "correctAnswer", e.target.value)
                    }
                    placeholder="e.g. Kyiv"
                    className={styles.input}
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className={styles.addQuestion}
          >
            + Add Another Question
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`${styles.submitBtn} ${submitting ? styles.disabled : ""}`}
        >
          {submitting ? "Creating..." : "Create Quiz"}
        </button>
      </form>
    </div>
  );
}
