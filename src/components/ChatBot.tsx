
import ApiKeySetup from "./ApiKeySetup";
import ChatBotTabs from "./ChatBotTabs";
import WeekendStatsPanel from "./WeekendStatsPanel";
import { useChatBot } from "@/hooks/useChatBot";

const ChatBot = () => {
  const {
    messages,
    isTyping,
    showApiKeyInput,
    knowledgeBase,
    weekendStats,
    handleSendMessage,
    handleApiKeySaved,
    handleKnowledgeUpdated,
    setShowApiKeyInput
  } = useChatBot();

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
      <div className="lg:col-span-2">
        <ChatBotTabs
          messages={messages}
          isTyping={isTyping}
          knowledgeBase={knowledgeBase}
          onSendMessage={handleSendMessage}
          onShowApiKeyInput={() => setShowApiKeyInput(true)}
          onKnowledgeUpdated={handleKnowledgeUpdated}
        />
      </div>

      <div className="space-y-4">
        <WeekendStatsPanel stats={weekendStats} />
      </div>
    </div>
  );
};

export default ChatBot;
