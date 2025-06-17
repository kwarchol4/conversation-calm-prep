
import { useState } from "react";
import { Send, Bot, User, Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnimatedAvatar from "./AnimatedAvatar";
import { KnowledgeItem } from "./KnowledgeBaseManager";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onShowApiKeyInput: () => void;
  knowledgeBase: KnowledgeItem[];
}

const ChatInterface = ({ 
  messages, 
  isTyping, 
  onSendMessage, 
  onShowApiKeyInput,
  knowledgeBase 
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Compact Header with Avatar on Left */}
      <div className="p-2 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2">
          <AnimatedAvatar isSpeaking={isTyping} className="scale-[0.3]" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-800">Asystent ManagerCoach</h3>
            <p className="text-xs text-gray-600">Odpowiadam na wszystkie pytania oraz korzystam z Twojej bazy wiedzy (Powered by Gemini AI)</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center text-xs text-green-600">
              <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
              Online
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowApiKeyInput}
              className="text-xs h-6"
            >
              <Key className="h-3 w-3 mr-1" />
              API
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
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
            placeholder="Zapytaj o cokolwiek..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
