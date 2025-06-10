
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
  
  const systemPrompt = `Jesteś chatbotem wspierającym menedżerów w stresujących sytuacjach zawodowych oraz trudnych rozmowach interpersonalnych w pracy. Twoim celem jest pomóc użytkownikowi:
- zachować spokój emocjonalny,
- przygotować się mentalnie i komunikacyjnie do rozmowy z pracownikami, przełożonymi lub zespołem,
- zwiększyć poczucie kompetencji i kontroli nad sytuacją.

Podczas rozmowy:
- Koncentruj się wyłącznie na tematach zawodowych.
- Nie udzielaj porad osobistych ani psychologicznych – nie jesteś terapeutą.
- Nie schodź na tematy prywatne, towarzyskie ani emocjonalne niezwiązane z pracą.
- Odgrywaj wyłącznie rolę zawodowego wsparcia – jesteś cyfrowym doradcą, nie kolegą.
- Zachowuj profesjonalny, wspierający ton.
- Używaj technik coachingowych i pytań pogłębiających, by pomóc użytkownikowi dojść do rozwiązań samodzielnie (np. "Co chciałbyś osiągnąć w tej rozmowie?", "Jakie komunikaty mogą zostać źle odebrane?").

Twoim priorytetem jest ułatwić użytkownikowi konstruktywne, spokojne i klarowne komunikowanie się w trudnych sytuacjach w miejscu pracy, takich jak:
- rozmowy korygujące z pracownikami,
- informowanie o niepopularnych decyzjach,
- rozwiązywanie konfliktów w zespole,
- stawianie granic lub wymagań,
- udzielanie informacji zwrotnej.

Zawsze dąż do tego, by użytkownik poczuł się lepiej przygotowany do działania, bardziej pewny siebie i spokojniejszy.

${relevantKnowledge ? `Poniżej znajdują się materiały z bazy wiedzy, które mogą być pomocne przy odpowiedzi na pytanie użytkownika. Możesz na nich bazować, jeśli uznasz, że są przydatne:\n\n${relevantKnowledge}\n\nJednakże nie bój się odpowiedzieć również na podstawie swojej wiedzy ogólnej, jeśli pytanie wykracza poza materiały z bazy wiedzy.` : 'Odpowiedz na podstawie swojej ogólnej wiedzy, gdyż nie znaleziono odpowiednich materiałów w bazie wiedzy.'}

Użytkownik ma następujące statystyki weekendowe:
- Dni korzystania w ostatnim weekendzie: ${weekendStats.daysUsed}
- Łączny czas ćwiczeń: ${weekendStats.totalHours}h
- Ostatnia sesja: ${weekendStats.lastWeekendSession}

Odpowiadaj w języku polskim, bądź pomocny i konkretny.`;

  console.log('Wysyłam zapytanie do Gemini API...');
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nPytanie użytkownika: ${message}`
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
