import BaseCard from './BaseCard';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';

export default function ActivityCard() {
  return (
    <BaseCard 
      title="Recent Activity" 
      description="A summary of your recent interactions and updates."
      actions={
        <>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiHeart className="w-4 h-4 text-red-500" />
            <span className="text-sm">12 Likes</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiMessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm">5 Comments</span>
          </div>
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm">
            <FiShare2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </>
      }
    />
  );
}
