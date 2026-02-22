const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  createQuiz: (data: any) =>
    fetchApi("/quizzes", { method: "POST", body: JSON.stringify(data) }),
  getQuizzes: (offset = 0, limit = 20) =>
    fetchApi(`/quizzes?offset=${offset}&limit=${limit}`),
  getQuiz: (id: string) => fetchApi(`/quizzes/${id}`),
  deleteQuiz: (id: string) => fetchApi(`/quizzes/${id}`, { method: "DELETE" }),
};
