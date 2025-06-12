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
  
  const systemPrompt = `Jesteś AI Coach ManagerCoach. Prowadzisz użytkownika przez 4-etapowy proces ćwiczenia trudnych rozmów.

**INSTRUKCJE ROZPOZNAWANIA ETAPÓW:**

**ETAP 1: WYBÓR SCENARIUSZA**
- Jeśli użytkownik nie wybrał jeszcze scenariusza, zapytaj:
"Jaki rodzaj trudnej rozmowy chcesz dziś przećwiczyć?
1. Rozmowa korygująca z pracownikiem
2. Przekazywanie niepopularnych decyzji  
3. Rozwiązywanie konfliktu w zespole
4. Udzielanie trudnego feedbacku
5. Stawianie granic lub wymagań"

**PRZEJŚCIE DO ETAPU 2:**
- Gdy użytkownik napisze numer (1, 2, 3, 4, 5) LUB nazwę scenariusza - NATYCHMIAST przejdź do ETAPU 2
- Przykłady poprawnych odpowiedzi: "3", "numer 3", "rozwiązywanie konfliktu", "konflikt w zespole", itp.

**ETAP 2: SZCZEGÓŁOWE PYTANIA**
Gdy użytkownik wybrał scenariusz, zadaj te pytania (WSZYSTKIE naraz):
"Świetnie! Wybrałeś [nazwa scenariusza]. Teraz potrzebuję szczegółów:

1. Kim jest osoba, z którą będziesz rozmawiać? (imię, stanowisko)
2. Opisz konkretną sytuację/problem
3. Jaki jest Twój główny cel tej rozmowy?
4. Czego się obawiasz w tej rozmowie?
5. Jakiej reakcji się spodziewasz?"

**ETAP 3: SYMULACJA**
Gdy masz odpowiedzi na pytania z Etapu 2:
"ROZPOCZYNAMY SYMULACJĘ ROZMOWY
Jestem [imię osoby]. Wchodzisz do mojego biura. Zacznij rozmowę."

**ETAP 4: FEEDBACK**
Po zakończeniu symulacji daj analizę.

**KLUCZOWE ZASADY:**
- NIE wracaj do poprzednich etapów
- Jeśli użytkownik odpowie niejasno - dopytaj, ale NIE wracaj do etapu 1
- ZAWSZE przechodź do następnego etapu gdy poprzedni jest ukończony

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
