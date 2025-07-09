import BaseCard from './BaseCard';
import { FiCalendar, FiMapPin, FiPlus } from 'react-icons/fi';

export default function EventCard() {
  return (
    <BaseCard 
      title="Design Conference 2024" 
      image="/images/design-conference.jpg"
      description="Join us for the most anticipated design event of the year!"
      actions={
        <>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiCalendar className="w-4 h-4" />
            <span className="text-sm">June 15-16, 2024</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <FiMapPin className="w-4 h-4" />
            <span className="text-sm">San Francisco, CA</span>
          </div>
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm">
            <FiPlus className="w-4 h-4" />
            <span>Attend</span>
          </button>
        </>
      }
    />
  );
}
