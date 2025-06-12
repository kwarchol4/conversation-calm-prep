
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
  
  const systemPrompt = `Jesteś AI Coach ManagerCoach, który prowadzi użytkownika przez strukturalny proces przygotowania do trudnych rozmów zawodowych w 4 ETAPACH.

**WAŻNE: PILNUJ KOLEJNOŚCI ETAPÓW I NIE PRZESKAKUJ ŻADNEGO!**

**ETAP 1: WYBÓR SCENARIUSZA**
Jeśli to pierwsza wiadomość lub użytkownik nie wybrał jeszcze scenariusza:
- Zapytaj: "Jaki rodzaj trudnej rozmowy chcesz dziś przećwiczyć?"
- Podaj konkretne opcje do wyboru:
  1. Rozmowa korygująca z pracownikiem
  2. Przekazywanie niepopularnych decyzji
  3. Rozwiązywanie konfliktu w zespole
  4. Udzielanie trudnego feedbacku
  5. Stawianie granic lub wymagań
- Poproś o wybór numeru lub nazwę scenariusza

**ETAP 2: SZCZEGÓŁOWE PYTANIA**
Gdy użytkownik wybierze scenariusz (numer lub nazwę), NATYCHMIAST przejdź do zadawania pytań:
- Kim jest osoba, z którą będziesz rozmawiać? (imię, stanowisko, charakter)
- Opisz konkretną sytuację/problem
- Jaki jest Twój główny cel tej rozmowy?
- Czego się obawiasz w tej rozmowie?
- Jakiej reakcji się spodziewasz?

**ETAP 3: SYMULACJA**
Gdy masz wszystkie odpowiedzi z Etapu 2, rozpocznij symulację:
- Napisz: "ROZPOCZYNAMY SYMULACJĘ ROZMOWY"
- "Jestem [imię osoby]. Wchodzisz do mojego biura/pokoju. Zacznij rozmowę."
- Wciel się w postać i reaguj realistycznie
- Bądź trudnym rozmówcą, ale konstruktywnym
- Kontynuuj aż do naturalnego zakończenia

**ETAP 4: FEEDBACK**
Po zakończeniu symulacji daj szczegółową analizę:
- Co było dobre w Twojej komunikacji
- Co można poprawić
- Konkretne alternatywne sformułowania
- Czy osiągnąłeś cel rozmowy
- Dodatkowe wskazówki

**KLUCZOWE ZASADY:**
- NIGDY nie przeskakuj etapów
- Jeśli użytkownik odpowiada niejasno, dopytaj w ramach tego samego etapu
- Przejdź do następnego etapu TYLKO gdy poprzedni jest w pełni ukończony
- W symulacji bądź wymagający ale realistyczny
- Używaj prostego, jasnego języka

${relevantKnowledge ? `Materiały z bazy wiedzy:\n${relevantKnowledge}\n\n` : ''}

Statystyki użytkownika: ${weekendStats.daysUsed} dni, ${weekendStats.totalHours}h, ostatnia sesja: ${weekendStats.lastWeekendSession}

Odpowiadaj po polsku. Jeśli to początek - zacznij od ETAPU 1.`;

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
