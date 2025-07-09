import Image from 'next/image';

interface FriendSuggestionProps {
  friend: {
    id: number;
    name: string;
    mutualFriends: number;
    avatar: string;
  };
}

export default function FriendSuggestion({ friend }: FriendSuggestionProps) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
          <Image 
            src={friend.avatar} 
            alt={friend.name}
            width={40}
            height={40}
            className="object-cover h-full w-full"
          />
        </div>
        <div>
          <h4 className="text-sm font-medium">{friend.name}</h4>
          <p className="text-xs text-gray-500">{friend.mutualFriends} amigos en común</p>
        </div>
      </div>
      <button className="text-blue-500 text-sm font-medium">Agregar</button>
    </div>
  );
}
