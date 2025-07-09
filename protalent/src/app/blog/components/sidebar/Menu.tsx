import React from 'react';
import Link from 'next/link';
import { 
  FiHome, 
  FiUsers, 
  FiMessageSquare, 
  FiVideo, 
  FiImage, 
  FiCalendar, 
  FiSettings,
  FiHelpCircle,
  FiBookmark,
  FiUser
} from 'react-icons/fi';

// Definir un tipo para los elementos del menú
export interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  path?: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

// Componente reutilizable para un elemento de menú
export const MenuItem: React.FC<MenuItemProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  active = false, 
  onClick,
  badge 
}) => {
  const content = (
    <div 
      className={`
        flex items-center space-x-3 px-4 py-2 rounded-md cursor-pointer 
        ${active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'
        }
        relative
      `}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
      {badge && badge > 0 && (
        <span className="absolute right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </div>
  );

  return path ? (
    <Link href={path}>
      {content}
    </Link>
  ) : content;
};

// Componente de menú configurable
interface SidebarMenuProps {
  title?: string;
  items?: MenuItemProps[];
  className?: string;
}

export default function SidebarMenu({ 
  title, 
  items = defaultMenuItems, 
  className = '' 
}: SidebarMenuProps) {
  return (
    <div className={`sidebar-menu ${className}`}>
      {title && (
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
          {title}
        </h3>
      )}
      <nav className="space-y-2">
        {items.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </nav>
    </div>
  );
}

// Menú de elementos por defecto
export const defaultMenuItems: MenuItemProps[] = [
  { 
    icon: FiHome, 
    label: 'Timeline', 
    path: '/blog',
    active: true 
  },
  { 
    icon: FiUsers, 
    label: 'Friends', 
    path: '/blog/friends',
    badge: 3 
  },
  { 
    icon: FiMessageSquare, 
    label: 'Messages', 
    path: '/blog/messages',
    badge: 12 
  },
  { 
    icon: FiVideo, 
    label: 'Videos', 
    path: '/blog/videos' 
  },
  { 
    icon: FiImage, 
    label: 'Photos', 
    path: '/blog/photos' 
  },
  { 
    icon: FiCalendar, 
    label: 'Events', 
    path: '/blog/events' 
  },
  { 
    icon: FiBookmark, 
    label: 'Saved', 
    path: '/blog/saved' 
  },
  { 
    icon: FiUser, 
    label: 'Profile', 
    path: '/blog/profile' 
  },
  { 
    icon: FiSettings, 
    label: 'Settings', 
    path: '/blog/settings' 
  },
  { 
    icon: FiHelpCircle, 
    label: 'Help', 
    path: '/blog/help' 
  }
]; 