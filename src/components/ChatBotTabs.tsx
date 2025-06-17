
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface, { Message } from "./ChatInterface";
import KnowledgeBaseManager, { KnowledgeItem } from "./KnowledgeBaseManager";

interface ChatBotTabsProps {
  messages: Message[];
  isTyping: boolean;
  knowledgeBase: KnowledgeItem[];
  onSendMessage: (message: string) => void;
  onShowApiKeyInput: () => void;
  onKnowledgeUpdated: (knowledge: KnowledgeItem[]) => void;
}

const ChatBotTabs = ({ 
  messages, 
  isTyping, 
  knowledgeBase, 
  onSendMessage, 
  onShowApiKeyInput, 
  onKnowledgeUpdated 
}: ChatBotTabsProps) => {
  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="knowledge">Baza Wiedzy</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat">
        <ChatInterface
          messages={messages}
          isTyping={isTyping}
          onSendMessage={onSendMessage}
          onShowApiKeyInput={onShowApiKeyInput}
          knowledgeBase={knowledgeBase}
        />
      </TabsContent>
      
      <TabsContent value="knowledge">
        <KnowledgeBaseManager
          knowledgeBase={knowledgeBase}
          onKnowledgeUpdated={onKnowledgeUpdated}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ChatBotTabs;
