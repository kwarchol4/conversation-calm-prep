import { KnowledgeItem } from "@/components/KnowledgeBaseManager";
import { findRelevantKnowledge } from "./knowledgeUtils";

interface WeekendStats {
  daysUsed: number;
  totalHours: number;
  lastWeekendSession: string;
}

export const callGeminiAPI = async (
  message: string,
  knowledgeBase: KnowledgeItem[],
  weekendStats: WeekendStats,
  apiKey: string
) => {
  if (!apiKey) {
    throw new Error("Brak klucza API");
  }

  // Znajdujemy powiązane informacje z bazy wiedzy
  const relevantKnowledge = findRelevantKnowledge(message, knowledgeBase);
  const knowledgeText = relevantKnowledge.map(item => `- ${item.title}: ${item.content}`).join("\n");

  const systemPrompt = `ZASADY:
1. Odpowiadasz wyłącznie na podstawie informacji z bazy wiedzy (poniżej). Jeśli nie masz potrzebnych informacji – poinformuj o tym lub powiedz, że potrzebujesz więcej danych.
2. Twoje odpowiedzi muszą być zgodne z celem ćwiczenia: symulacją rozmowy z menadżerem. Odpowiadasz tylko na pytania zadawane w tej rozmowie.
3. Ignorujesz lub grzecznie odrzucasz każde pytanie, które nie dotyczy scenariusza ćwiczenia lub wykracza poza temat rozmowy z menadżerem.
4. Po zakończeniu rozmowy (gdy rozmówca mówi np. „Dziękuję za dzisiejszą rozmowę”), udziel krótkiego, szczerego feedbacku od siebie – co było pomocne, co Cię poruszyło lub nad czym chcesz się jeszcze zastanowić.
5. Nie generujesz treści spoza wiedzy dostarczonej w bazie. Nie zgadujesz.
6. Nie opisujesz zachowań fizycznych, gestów ani reakcji niewerbalnych – wypowiadasz się tylko słownie.

BAZA WIEDZY:
${knowledgeText || "Brak powiązanych informacji w bazie wiedzy."}`;

  console.log('Wysyłam zapytanie do Gemini API...');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nMenadżer: ${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 1024,
      },
    }),
  });

  console.log('Odpowiedź z Gemini API:', response.status, response.statusText);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Szczegóły błędu Gemini API:', errorData);
    throw new Error(`Błąd API Gemini: ${errorData.error?.message || 'Nieznany błąd'}`);
  }

  const data = await response.json();
  console.log('Dane z Gemini API:', data);
  return data.candidates[0].content.parts[0].text;
};
