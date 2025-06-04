
import { useState } from "react";
import { FileText, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  dateAdded: Date;
}

interface KnowledgeBaseManagerProps {
  knowledgeBase: KnowledgeItem[];
  onKnowledgeUpdated: (knowledge: KnowledgeItem[]) => void;
}

const KnowledgeBaseManager = ({ knowledgeBase, onKnowledgeUpdated }: KnowledgeBaseManagerProps) => {
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState("");
  const [newKnowledgeContent, setNewKnowledgeContent] = useState("");

  const addKnowledgeItem = () => {
    if (!newKnowledgeTitle.trim() || !newKnowledgeContent.trim()) return;

    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      title: newKnowledgeTitle,
      content: newKnowledgeContent,
      dateAdded: new Date()
    };

    const updatedKnowledge = [...knowledgeBase, newItem];
    onKnowledgeUpdated(updatedKnowledge);
    setNewKnowledgeTitle("");
    setNewKnowledgeContent("");
  };

  const removeKnowledgeItem = (id: string) => {
    const updatedKnowledge = knowledgeBase.filter(item => item.id !== id);
    onKnowledgeUpdated(updatedKnowledge);
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('pl-PL');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Nieznana data';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Zarządzanie Bazą Wiedzy
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 space-y-4">
        {/* Add Knowledge Form */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800">Dodaj nowy materiał</h4>
          <div className="space-y-2">
            <Label htmlFor="title">Tytuł materiału</Label>
            <Input
              id="title"
              value={newKnowledgeTitle}
              onChange={(e) => setNewKnowledgeTitle(e.target.value)}
              placeholder="np. Techniki prowadzenia rozmów"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Treść materiału</Label>
            <Textarea
              id="content"
              value={newKnowledgeContent}
              onChange={(e) => setNewKnowledgeContent(e.target.value)}
              placeholder="Wklej tutaj treść materiału, z którego chatbot ma czerpać wiedzę..."
              rows={4}
            />
          </div>
          <Button 
            onClick={addKnowledgeItem} 
            disabled={!newKnowledgeTitle.trim() || !newKnowledgeContent.trim()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Dodaj do bazy wiedzy
          </Button>
        </div>
        
        {/* Knowledge Base List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {knowledgeBase.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Baza wiedzy jest pusta</p>
              <p className="text-sm">Dodaj materiały, aby chatbot mógł na nich bazować</p>
            </div>
          ) : (
            knowledgeBase.map((item) => (
              <div key={item.id} className="p-3 bg-white border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">{item.title}</h5>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {item.content.substring(0, 150)}...
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      Dodano: {formatDate(item.dateAdded)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKnowledgeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseManager;
