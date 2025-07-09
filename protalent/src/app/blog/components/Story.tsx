import Image from 'next/image';

interface StoryProps {
  story: {
    id: number;
    user: string;
    image: string;
    isAdd?: boolean;
  };
}

export default function Story({ story }: StoryProps) {
  return (
    <div className="flex flex-col items-center mr-4">
      <div className={`h-32 w-24 rounded-xl overflow-hidden mb-1 ${story.isAdd ? 'border-2 border-dashed border-gray-300' : 'border-2 border-blue-500'}`}>
        <Image 
          src={story.image} 
          alt={story.user}
          width={96}
          height={128}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs font-medium">
        {story.isAdd ? 'Agregar historia' : story.user}
      </span>
    </div>
  );
}
