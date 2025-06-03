
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeekendStats {
  daysUsed: number;
  totalHours: number;
  lastWeekendSession: string;
}

interface WeekendStatsPanelProps {
  stats: WeekendStats;
}

const WeekendStatsPanel = ({ stats }: WeekendStatsPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Statystyki Weekendowe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.daysUsed}</div>
          <div className="text-sm text-gray-600">Dni w ostatnim weekendzie</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalHours}h</div>
          <div className="text-sm text-gray-600">Łączny czas ćwiczeń</div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Clock className="h-4 w-4" />
            Ostatnia sesja
          </div>
          <div className="font-semibold">{stats.lastWeekendSession}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekendStatsPanel;
