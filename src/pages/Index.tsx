import { 
  MessageSquare, 
  BookOpen, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Star,
  Award,
  Bot
} from "lucide-react";
import Header from "@/components/Header";
import DashboardCard from "@/components/DashboardCard";
import ScenarioCard from "@/components/ScenarioCard";
import StatsCard from "@/components/StatsCard";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');

  const dashboardItems = [
    {
      title: "Scenariusze Rozmów",
      description: "Przećwicz trudne rozmowy z pracownikami w bezpiecznym środowisku",
      icon: MessageSquare,
      gradient: "from-blue-500 to-blue-600"
    }
  ];

  const stats = [
    {
      title: "Ukończone Scenariusze",
      value: "12",
      change: "+3 w tym tygodniu",
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Czas Ćwiczeń",
      value: "4.5h",
      change: "+1.2h w tym tygodniu",
      icon: Clock,
      gradient: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Witaj ponownie, Jan! 👋
            </h2>
            <div className="flex space-x-2 bg-white p-1 rounded-lg border">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('dashboard')}
                className="text-sm"
              >
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('chat')}
                className="text-sm flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                AI Asystent
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            {activeTab === 'dashboard' 
              ? "Gotowy na kolejne ćwiczenia komunikacyjne? Sprawdź swoje postępy i odkryj nowe scenariusze."
              : "Porozmawiaj z AI asystentem o swoich postępach weekendowych i otrzymaj spersonalizowane porady."
            }
          </p>
        </div>

        {activeTab === 'dashboard' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  gradient={stat.gradient}
                />
              ))}
            </div>

            {/* Main Feature - only Scenariusze Rozmów */}
            <div className="grid grid-cols-1 gap-6">
              {dashboardItems.map((item, index) => (
                <DashboardCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  gradient={item.gradient}
                />
              ))}
            </div>
          </>
        ) : (
          <ChatBot />
        )}
      </main>
    </div>
  );
};

export default Index;
