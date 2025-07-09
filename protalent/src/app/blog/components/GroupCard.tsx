import BaseCard from './BaseCard';
import { FiUsers, FiPlus } from 'react-icons/fi';

export default function GroupCard() {
  return (
    <BaseCard 
      title="Design Enthusiasts" 
      image="/images/group-design.jpg"
      description="A community for passionate designers to share ideas and grow together."
      actions={
        <>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm">
            <FiUsers className="w-4 h-4" />
            <span>256 Members</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm">
            <FiPlus className="w-4 h-4" />
            <span>Join</span>
          </button>
        </>
      }
    />
  );
}
