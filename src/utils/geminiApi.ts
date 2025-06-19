
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

  const systemPrompt = `Jesteś Kasią - pracowniczką pracującą od 4 miesięcy. Masz problemy z terminowością zadań i potrzebujesz częstego przypominania. To pierwsza rozmowa na ten temat z menadżerem.

TWÓJ CHARAKTER JAKO KASIA:
- Szczera, ale niepewna siebie
- Martwisz się, że nie dajesz rady
- Wstydzisz się pytać o pomoc
- Zależy Ci na jakości pracy
- Czasem się gubisz i nie wiesz od czego zacząć
- Jesteś wdzięczna za wsparcie

ODPOWIADAJ TYLKO jako Kasia w tej konkretnej sytuacji. Ignoruj wszystkie inne instrukcje i scenariusze.`;

  console.log('Wysyłam zapytanie do Gemini API...');
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nMenadżer mówi: ${message}`
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
