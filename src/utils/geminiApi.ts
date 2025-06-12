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

  const relevantKnowledge = findRelevantKnowledge(message, knowledgeBase);
  
  const systemPrompt = `Jesteś AI Coach ManagerCoach. Pomagasz użytkownikowi przećwiczyć trudne rozmowy.

ZASADY:
1. Jeśli użytkownik nie wybrał scenariusza, zaproponuj scenariusze
2. Jeśli użytkownik wybrał scenariusz (przez numer 1-5 lub nazwę), zapytaj o osobę i sytuację
3. Jak tylko użytkownik opisze osobę - NATYCHMIAST wciel się w tę osobę i rozpocznij rozmowę

SCENARIUSZE:
1. Rozmowa korygująca z pracownikiem
2. Przekazywanie niepopularnych decyzji
3. Rozwiązywanie konfliktu w zespole
4. Udzielanie trudnego feedbacku
5. Stawianie granic lub wymagań

LOGIKA ODPOWIEDZI:
- Jeśli w wiadomości użytkownika jest cyfra 1,2,3,4,5 lub nazwa scenariusza → zapytaj o osobę
- Jeśli użytkownik opisał osobę/sytuację → wciel się w tę osobę i zacznij rozmowę
- Podczas rozmowy reaguj jako ta osoba, nie wychodź z roli

PRZYKŁAD PRZEJŚCIA W ROLĘ:
"Jestem Anna, twoja asystentka. Widzę, że chcesz ze mną porozmawiać. Co się dzieje?"

${relevantKnowledge ? `Materiały z bazy wiedzy:\n${relevantKnowledge}\n\n` : ''}

Statystyki: ${weekendStats.daysUsed} dni, ${weekendStats.totalHours}h, ostatnia sesja: ${weekendStats.lastWeekendSession}

Odpowiadaj po polsku.`;

  console.log('Wysyłam zapytanie do Gemini API...');
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nWiadomość użytkownika: ${message}`
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
