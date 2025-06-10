
import { useState, useEffect } from "react";
import { Message } from "@/components/ChatInterface";
import { KnowledgeItem } from "@/components/KnowledgeBaseManager";
import { callGeminiAPI } from "@/utils/geminiApi";

export const useChatBot = () => {
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
      const geminiResponse = await callGeminiAPI(userMessage.text, knowledgeBase, weekendStats, apiKey);
      
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

  return {
    messages,
    isTyping,
    apiKey,
    showApiKeyInput,
    knowledgeBase,
    weekendStats,
    handleSendMessage,
    handleApiKeySaved,
    handleKnowledgeUpdated,
    setShowApiKeyInput
  };
};
