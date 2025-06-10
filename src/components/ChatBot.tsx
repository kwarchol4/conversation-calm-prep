
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeySetup from "./ApiKeySetup";
import ChatInterface, { Message } from "./ChatInterface";
import KnowledgeBaseManager, { KnowledgeItem } from "./KnowledgeBaseManager";
import WeekendStatsPanel from "./WeekendStatsPanel";

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Cześć! Jestem Twoim asystentem ManagerCoach. Mogę odpowiadać na wszystkie pytania oraz bazować na materiałach z bazy wiedzy. Jak mogę Ci dzisiaj pomóc?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);

  // Symulacja danych weekendowych (w rzeczywistej aplikacji byłyby z bazy danych)
  const weekendStats = {
    daysUsed: 3,
    totalHours: 2.5,
    lastWeekendSession: "Niedziela, 15:30"
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    const savedKnowledge = localStorage.getItem('manager-coach-knowledge');
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }

    if (savedKnowledge) {
      setKnowledgeBase(JSON.parse(savedKnowledge));
    }
  }, []);

  const saveKnowledgeToStorage = (knowledge: KnowledgeItem[]) => {
    localStorage.setItem('manager-coach-knowledge', JSON.stringify(knowledge));
  };

  const handleKnowledgeUpdated = (updatedKnowledge: KnowledgeItem[]) => {
    setKnowledgeBase(updatedKnowledge);
    saveKnowledgeToStorage(updatedKnowledge);
  };

  const findRelevantKnowledge = (query: string): string => {
    if (knowledgeBase.length === 0) {
      return "";
    }

    const queryLower = query.toLowerCase();
    const relevantItems = knowledgeBase.filter(item => 
      item.title.toLowerCase().includes(queryLower) ||
      item.content.toLowerCase().includes(queryLower)
    );

    if (relevantItems.length === 0) {
      return "";
    }

    return relevantItems.map(item => `**${item.title}**\n${item.content}`).join('\n\n---\n\n');
  };

  const callGeminiAPI = async (message: string) => {
    if (!apiKey) {
      throw new Error("Brak klucza API");
    }

    const relevantKnowledge = findRelevantKnowledge(message);
    
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

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const geminiResponse = await callGeminiAPI(userMessage.text);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: geminiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Błąd Gemini API:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Przepraszam, wystąpił błąd podczas łączenia z AI. Sprawdź swój klucz API lub spróbuj ponownie.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApiKeySaved = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiKeyInput(false);
  };

  if (showApiKeyInput) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApiKeySetup onApiKeySaved={handleApiKeySaved} />
        </div>
        
        <div className="space-y-4">
          <WeekendStatsPanel stats={weekendStats} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="knowledge">Baza Wiedzy ({knowledgeBase.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <ChatInterface
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onShowApiKeyInput={() => setShowApiKeyInput(true)}
              knowledgeBase={knowledgeBase}
            />
          </TabsContent>
          
          <TabsContent value="knowledge">
            <KnowledgeBaseManager
              knowledgeBase={knowledgeBase}
              onKnowledgeUpdated={handleKnowledgeUpdated}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Weekend Stats Panel */}
      <div className="space-y-4">
        <WeekendStatsPanel stats={weekendStats} />
      </div>
    </div>
  );
};

export default ChatBot;
