
import ApiKeySetup from "./ApiKeySetup";
import ChatBotTabs from "./ChatBotTabs";
import { useChatBot } from "@/hooks/useChatBot";

const ChatBot = () => {
  const {
    messages,
    isTyping,
    showApiKeyInput,
    knowledgeBase,
    handleSendMessage,
    handleApiKeySaved,
    handleKnowledgeUpdated,
    setShowApiKeyInput
  } = useChatBot();

  if (showApiKeyInput) {
    return (
      <div className="max-w-4xl mx-auto">
        <ApiKeySetup onApiKeySaved={handleApiKeySaved} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ChatBotTabs
        messages={messages}
        isTyping={isTyping}
        knowledgeBase={knowledgeBase}
        onSendMessage={handleSendMessage}
        onShowApiKeyInput={() => setShowApiKeyInput(true)}
        onKnowledgeUpdated={handleKnowledgeUpdated}
      />
    </div>
  );
};

export default ChatBot;
