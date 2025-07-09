import React from 'react';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';

// Definir interfaz para un grupo
export interface GroupProps {
  id?: string;
  name: string;
  members: number;
  color?: string;
  textColor?: string;
  image?: string;
  description?: string;
  onJoin?: () => void;
}

// Componente reutilizable para un grupo
export const GroupItem: React.FC<GroupProps> = ({ 
  name, 
  members, 
  color = 'bg-blue-100', 
  textColor = 'text-blue-600',
  image,
  description,
  onJoin
}) => {
  return (
    <div 
      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-md cursor-pointer group"
    >
      {image ? (
        <img 
          src={image} 
          alt={name} 
          className="w-10 h-10 rounded-lg object-cover"
        />
      ) : (
        <div className={`w-10 h-10 rounded-lg ${color} ${textColor} flex items-center justify-center font-bold`}>
          {name.charAt(0)}
        </div>
      )}
      
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{members} members</p>
        {description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{description}</p>
        )}
      </div>
      
      {onJoin && (
        <button 
          className="text-blue-500 hover:text-blue-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onJoin}
        >
          Join
        </button>
      )}
    </div>
  );
};

// Componente de grupos configurable
interface SidebarGroupsProps {
  title?: string;
  groups?: GroupProps[];
  onAddGroup?: () => void;
  className?: string;
}

export default function SidebarGroups({ 
  title = 'My Groups', 
  groups = defaultGroups, 
  onAddGroup,
  className = '' 
}: SidebarGroupsProps) {
  return (
    <div className={`sidebar-groups ${className}`}>
      <div className="flex justify-between items-center px-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {onAddGroup && (
          <button 
            className="text-blue-500 hover:text-blue-600"
            onClick={onAddGroup}
          >
            <FiPlus className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {groups.map((group, index) => (
          <GroupItem key={group.id || index} {...group} />
        ))}
      </div>
    </div>
  );
}

// Grupos por defecto
export const defaultGroups: GroupProps[] = [
  { 
    name: 'Design Enthusiasts', 
    members: 256, 
    color: 'bg-blue-100', 
    textColor: 'text-blue-600',
    description: 'A community for passionate designers'
  },
  { 
    name: 'UI Official', 
    members: 512, 
    color: 'bg-pink-100', 
    textColor: 'text-pink-600',
    description: 'User Interface design professionals'
  },
  { 
    name: 'Web Designers', 
    members: 128, 
    color: 'bg-green-100', 
    textColor: 'text-green-600',
    description: 'Sharing web design trends and techniques'
  }
]; 