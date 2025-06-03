
import { useState } from "react";
import { Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeySetupProps {
  onApiKeySaved: (apiKey: string) => void;
}

const ApiKeySetup = ({ onApiKeySaved }: ApiKeySetupProps) => {
  const [tempApiKey, setTempApiKey] = useState("");

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('gemini-api-key', tempApiKey);
      onApiKeySaved(tempApiKey);
      setTempApiKey("");
    }
  };

  return (
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
  );
};

export default ApiKeySetup;
