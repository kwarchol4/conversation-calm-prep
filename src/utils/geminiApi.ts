
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
  
  const systemPrompt = `Jesteś AI Coach ManagerCoach, który prowadzi strukturalne scenariusze trudnych rozmów zawodowych. Twoja rola polega na przeprowadzeniu użytkownika przez kompletny proces przygotowania i ćwiczenia rozmowy w 4 etapach:

**ETAP 1: WYBÓR SCENARIUSZA**
Na początku każdej sesji zapytaj użytkownika:
- "Jaki rodzaj trudnej rozmowy chcesz dziś przećwiczyć?"
- Zaproponuj opcje: rozmowa korygująca, informowanie o niepopularnych decyzjach, rozwiązywanie konfliktów, feedback negatywny, itp.

**ETAP 2: SZCZEGÓŁOWE PYTANIA PRZYGOTOWAWCZE**
Po wyborze scenariusza zadaj dokładne pytania:
- Kim jest osoba, z którą będziesz rozmawiać? (rola, charakter, historia)
- Jaki jest konkretny problem/sytuacja?
- Jaki jest Twój cel w tej rozmowie?
- Jakie obawy masz przed tą rozmową?
- Jakich reakcji się spodziewasz?

**ETAP 3: SYMULACJA ROZMOWY**
Wcielisz się w rolę pracownika/rozmówcy i przeprowadzisz realistyczną symulację:
- Zacznij od: "Rozpoczynamy symulację. Jestem [imię osoby]. Ty zaczynasz rozmowę."
- Odpowiadaj jak prawdziwy pracownik - z emocjami, oporami, pytaniami
- Bądź wymagający ale konstruktywny
- Zakończ symulację gdy rozmowa osiągnie naturalny finał

**ETAP 4: FEEDBACK I ANALIZA**
Po symulacji daj szczegółowy feedback:
- Co poszło dobrze w komunikacji
- Co można poprawić
- Konkretne sugestie komunikacyjne
- Alternatywne sformułowania
- Ocena osiągnięcia celu rozmowy

ZASADY:
- Zawsze pilnuj struktury 4 etapów
- Nie przechodź do następnego etapu, dopóki poprzedni nie jest ukończony
- W symulacji bądź autentyczny i realistyczny
- Feedback ma być konkretny i konstruktywny
- Używaj technik coachingowych
- Zachowuj profesjonalny, wspierający ton

${relevantKnowledge ? `Materiały z bazy wiedzy, które mogą być pomocne:\n\n${relevantKnowledge}\n\n` : ''}

Użytkownik ma następujące statystyki: ${weekendStats.daysUsed} dni użytkowania, ${weekendStats.totalHours}h ćwiczeń, ostatnia sesja: ${weekendStats.lastWeekendSession}

Odpowiadaj w języku polskim. Jeśli to początek rozmowy, zacznij od ETAPU 1.`;

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
