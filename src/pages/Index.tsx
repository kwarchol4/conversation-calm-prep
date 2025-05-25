
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
    },
    {
      title: "Przewodnik Komunikacji",
      description: "Poznaj sprawdzone techniki prowadzenia skutecznych rozmów 1:1",
      icon: BookOpen,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Symulator Rozmów",
      description: "Interaktywne ćwiczenia z natychmiastowym feedbackiem",
      icon: Target,
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Postępy i Analityka",
      description: "Śledź swój rozwój i identyfikuj obszary do poprawy",
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const scenarios = [
    {
      title: "Przekazywanie Trudnego Feedbacku",
      description: "Naucz się konstruktywnie przekazywać krytykę, która motywuje do rozwoju",
      difficulty: "Trudny" as const,
      duration: "15-20 min",
      participants: 2,
      category: "Feedback"
    },
    {
      title: "Rozmowa o Rozwoju Kariery",
      description: "Prowadź inspirujące rozmowy o celach zawodowych pracownika",
      difficulty: "Średni" as const,
      duration: "10-15 min",
      participants: 2,
      category: "Rozwój"
    },
    {
      title: "Rozwiązywanie Konfliktów",
      description: "Mediacja w sytuacjach konfliktowych między członkami zespołu",
      difficulty: "Trudny" as const,
      duration: "20-25 min",
      participants: 3,
      category: "Konflikty"
    },
    {
      title: "Motywowanie Pracownika",
      description: "Techniki motywacyjne dla pracowników w trudnym okresie",
      difficulty: "Średni" as const,
      duration: "10-15 min",
      participants: 2,
      category: "Motywacja"
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
    },
    {
      title: "Zdobyte Odznaki",
      value: "7",
      change: "+2 nowe",
      icon: Award,
      gradient: "from-purple-500 to-purple-600"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            {/* Main Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

            {/* Recommended Scenarios */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Polecane Scenariusze
                </h3>
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  Zobacz wszystkie
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scenarios.map((scenario, index) => (
                  <ScenarioCard
                    key={index}
                    title={scenario.title}
                    description={scenario.description}
                    difficulty={scenario.difficulty}
                    duration={scenario.duration}
                    participants={scenario.participants}
                    category={scenario.category}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Szybkie Akcje
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Rozpocznij Szybkie Ćwiczenie
                </Button>
                <Button variant="outline">
                  Przejrzyj Ostatnie Sesje
                </Button>
                <Button variant="outline">
                  Pobierz Raport Postępów
                </Button>
              </div>
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
