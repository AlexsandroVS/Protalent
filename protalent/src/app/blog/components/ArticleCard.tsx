import BaseCard from './BaseCard';
import { FiBookOpen, FiClock, FiShare2 } from 'react-icons/fi';

export default function ArticleCard() {
  return (
    <BaseCard 
      title="The Future of Design Systems" 
      image="/images/design-systems.jpg"
      avatar="/images/author-avatar.jpg"
      name="María García"
      description="Exploring the evolving landscape of design systems and their impact on modern web development."
      actions={
        <>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiBookOpen className="w-4 h-4" />
            <span className="text-sm">5 min read</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiClock className="w-4 h-4" />
            <span className="text-sm">Published 2 days ago</span>
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
