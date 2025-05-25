
import { Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScenarioCardProps {
  title: string;
  description: string;
  difficulty: "Łatwy" | "Średni" | "Trudny";
  duration: string;
  participants: number;
  category: string;
}

const ScenarioCard = ({ title, description, difficulty, duration, participants, category }: ScenarioCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Łatwy": return "bg-green-100 text-green-800";
      case "Średni": return "bg-yellow-100 text-yellow-800";
      case "Trudny": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <Badge className={`text-xs ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{participants} uczestników</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Rozwój</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
