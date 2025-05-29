import { useState, useEffect } from "react";
import { Send, Bot, User, Calendar, Clock, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import AnimatedAvatar from "./AnimatedAvatar";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Cześć! Jestem Twoim asystentem ManagerCoach. Mogę pomóc Ci przeanalizować Twoje weekendowe sesje treningowe i odpowiedzieć na pytania o rozwój umiejętności menedżerskich. Jak mogę Ci pomóc?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Symulacja danych weekendowych (w rzeczywistej aplikacji byłyby z bazy danych)
  const weekendStats = {
    daysUsed: 3,
    totalHours: 2.5,
    lastWeekendSession: "Niedziela, 15:30"
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('gemini-api-key', tempApiKey);
      setApiKey(tempApiKey);
      setShowApiKeyInput(false);
      setTempApiKey("");
    }
  };

  const callGeminiAPI = async (message: string) => {
    if (!apiKey) {
      throw new Error("Brak klucza API");
    }

    const systemPrompt = `Jesteś asystentem ManagerCoach - aplikacji do rozwoju umiejętności menedżerskich. 
    Użytkownik ma następujące statystyki weekendowe:
    - Dni korzystania w ostatnim weekendzie: ${weekendStats.daysUsed}
    - Łączny czas ćwiczeń: ${weekendStats.totalHours}h
    - Ostatnia sesja: ${weekendStats.lastWeekendSession}
    
    Odpowiadaj w języku polskim, bądź pomocny i konkretny. Skupiaj się na rozwoju umiejętności menedżerskich i analizie postępów użytkownika.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Błąd API Gemini');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col justify-center items-center">
            <CardContent className="w-full max-w-md space-y-4">
              <div className="text-center mb-6">
                <Key className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">Konfiguracja API Gemini</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Wprowadź swój klucz API Gemini, aby aktywować AI asystenta
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apikey">Klucz API Gemini</Label>
                <Input
                  id="apikey"
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Klucz będzie zapisany lokalnie w przeglądarce
                </p>
              </div>
              
              <Button onClick={saveApiKey} disabled={!tempApiKey.trim()} className="w-full">
                Zapisz i Aktywuj
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Nie masz klucza API? Uzyskaj go za darmo na{" "}
                  <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    ai.google.dev
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Weekend Stats Panel - keep existing */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Statystyki Weekendowe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{weekendStats.daysUsed}</div>
                <div className="text-sm text-gray-600">Dni w ostatnim weekendzie</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{weekendStats.totalHours}h</div>
                <div className="text-sm text-gray-600">Łączny czas ćwiczeń</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  Ostatnia sesja
                </div>
                <div className="font-semibold">{weekendStats.lastWeekendSession}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          {/* Large Animated Avatar Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="text-center">
              <AnimatedAvatar isSpeaking={isTyping} className="mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Asystent ManagerCoach</h3>
              <p className="text-sm text-gray-600 mt-1">Twój osobisty coach rozwoju menedżerskiego (Powered by Gemini AI)</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="inline-flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKeyInput(true)}
                  className="text-xs"
                >
                  <Key className="h-3 w-3 mr-1" />
                  Zmień API
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8">
                      {message.isUser ? (
                        <>
                          <AvatarImage src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback className="bg-blue-600">
                            <User className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback className="bg-gray-600">
                            <Bot className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className={`rounded-lg p-3 ${
                      message.isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=32&h=32&fit=crop&crop=face" />
                    <AvatarFallback className="bg-gray-600">
                      <Bot className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Zapytaj o swoje postępy weekendowe..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekend Stats Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Statystyki Weekendowe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{weekendStats.daysUsed}</div>
              <div className="text-sm text-gray-600">Dni w ostatnim weekendzie</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{weekendStats.totalHours}h</div>
              <div className="text-sm text-gray-600">Łączny czas ćwiczeń</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Clock className="h-4 w-4" />
                Ostatnia sesja
              </div>
              <div className="font-semibold">{weekendStats.lastWeekendSession}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;
