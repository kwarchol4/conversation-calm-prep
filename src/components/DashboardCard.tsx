
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick?: () => void;
}

const DashboardCard = ({ title, description, icon: Icon, gradient, onClick }: DashboardCardProps) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 overflow-hidden group"
      onClick={onClick}
    >
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-10`}>
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
