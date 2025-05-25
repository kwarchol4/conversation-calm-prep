
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  gradient: string;
}

const StatsCard = ({ title, value, change, icon: Icon, gradient }: StatsCardProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-green-600 mt-1">{change}</p>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-10`}>
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
