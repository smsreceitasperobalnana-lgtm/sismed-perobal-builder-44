
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  onClick?: () => void;
}

const StatsCard = ({ title, value, icon: Icon, onClick }: StatsCardProps) => {
  return (
    <div className="stats-card" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <div className="stats-card-number">{value}</div>
          <div className="stats-card-label">{title}</div>
        </div>
        <div className="p-3 bg-medical-secondary/20 rounded-full">
          <Icon className="h-6 w-6 text-medical-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
