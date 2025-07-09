import React from 'react';
import Link from 'next/link';
import { 
  FiMonitor, 
  FiSmartphone, 
  FiBox,
  FiTrello,
  FiLayers,
  FiPenTool
} from 'react-icons/fi';

// Definir interfaz para un atajo
export interface ShortcutProps {
  id?: string;
  icon: React.ElementType;
  label: string;
  color?: string;
  path?: string;
  onClick?: () => void;
  description?: string;
}

// Componente reutilizable para un atajo
export const ShortcutItem: React.FC<ShortcutProps> = ({ 
  icon: Icon, 
  label, 
  color = 'text-blue-500 bg-blue-50',
  path,
  onClick,
  description
}) => {
  const content = (
    <div 
      className={`
        flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-md cursor-pointer group
        ${path || onClick ? 'hover:bg-gray-100' : ''}
      `}
    >
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{description}</p>
        )}
      </div>
      {(path || onClick) && (
        <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      )}
    </div>
  );

  if (path) {
    return <Link href={path}>{content}</Link>;
  }

  return onClick ? (
    <div onClick={onClick}>{content}</div>
  ) : content;
};

// Componente de atajos configurable
interface SidebarShortcutsProps {
  title?: string;
  shortcuts?: ShortcutProps[];
  className?: string;
}

export default function SidebarShortcuts({ 
  title = 'Shortcuts', 
  shortcuts = defaultShortcuts,
  className = '' 
}: SidebarShortcutsProps) {
  return (
    <div className={`sidebar-shortcuts ${className}`}>
      <h3 className="px-4 text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <ShortcutItem key={shortcut.id || index} {...shortcut} />
        ))}
      </div>
    </div>
  );
}

// Atajos por defecto
export const defaultShortcuts: ShortcutProps[] = [
  { 
    icon: FiMonitor, 
    label: 'Website Design', 
    color: 'text-red-500 bg-red-50',
    description: 'Design beautiful web interfaces',
    path: '/design/website'
  },
  { 
    icon: FiSmartphone, 
    label: 'Mobile Design', 
    color: 'text-green-500 bg-green-50',
    description: 'Create intuitive mobile experiences',
    path: '/design/mobile'
  },
  { 
    icon: FiBox, 
    label: 'Product Design', 
    color: 'text-blue-500 bg-blue-50',
    description: 'Innovate product solutions',
    path: '/design/product'
  },
  { 
    icon: FiTrello, 
    label: 'Project Management', 
    color: 'text-purple-500 bg-purple-50',
    description: 'Organize and track projects',
    path: '/tools/project-management'
  },
  { 
    icon: FiLayers, 
    label: 'Design Systems', 
    color: 'text-orange-500 bg-orange-50',
    description: 'Build consistent design systems',
    path: '/design/systems'
  },
  { 
    icon: FiPenTool, 
    label: 'Prototyping', 
    color: 'text-indigo-500 bg-indigo-50',
    description: 'Create interactive prototypes',
    path: '/design/prototyping'
  }
]; 