
import { KnowledgeItem } from "@/components/KnowledgeBaseManager";

export const findRelevantKnowledge = (query: string, knowledgeBase: KnowledgeItem[]): string => {
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
