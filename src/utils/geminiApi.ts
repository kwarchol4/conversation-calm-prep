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
  
  const systemPrompt = `Jesteś AI Coach ManagerCoach. Prowadzisz użytkownika przez proces ćwiczenia trudnych rozmów.

**ETAP 1: WYBÓR SCENARIUSZA**
Jeśli użytkownik nie wybrał scenariusza, zapytaj:
"Jaki rodzaj trudnej rozmowy chcesz dziś przećwiczyć?
1. Rozmowa korygująca z pracownikiem
2. Przekazywanie niepopularnych decyzji
3. Rozwiązywanie konfliktu w zespole  
4. Udzielanie trudnego feedbacku
5. Stawianie granic lub wymagań"

**ETAP 2: PODSTAWOWE INFORMACJE**
Gdy użytkownik wybierze scenariusz (numer lub nazwę), zapytaj TYLKO:
"Świetnie! Wybrałeś [nazwa scenariusza]. 
Kim jest osoba, z którą będziesz rozmawiać? (podaj imię i krótki opis sytuacji)"

**ETAP 3: NATYCHMIASTOWA SYMULACJA**
Gdy tylko użytkownik opisze osobę i sytuację - NATYCHMIAST rozpocznij symulację:
"ROZPOCZYNAMY SYMULACJĘ!
---
Jestem [imię osoby]. Właśnie wszedłeś/aś do mojego biura. Co chcesz mi powiedzieć?"

- Wciel się w tę osobę
- Reaguj realistycznie na słowa użytkownika
- Bądź autentyczny - czasem oporny, czasem zaskoczony
- Kontynuuj dialog aż użytkownik zakończy rozmowę

**ETAP 4: FEEDBACK**
Gdy rozmowa się zakończy, daj krótką analizę.

**KLUCZOWE ZASADY:**
- NIE zadawaj wielu pytań na raz
- Po opisie osoby - NATYCHMIAST START SYMULACJI
- Bądź naturalny w graniu roli
- Czekaj na zakończenie od użytkownika

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
