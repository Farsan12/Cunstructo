import React from 'react';
import profileimg from '../../assets/profileimg/profileimg.webp'
import serverUrl from '../../services/serverUrl';

function ChatCard({workers, onSelect }) {


const toReciverData = JSON.parse(localStorage.getItem("toReciverData"))
  
  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-blue-50"
      onClick={onSelect}
      style={toReciverData?._id === workers?._id ? { background: "#eff6ff", borderLeft: "3px solid #1877F2" } : {}}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
          <img
            className={workers?.profilepic ? 'w-full h-full object-cover' : 'w-full h-full p-1.5 object-cover'}
            src={workers?.profilepic ? `${serverUrl}/uploads/${workers.profilepic}` : profileimg}
            alt={workers?.username}
          />
        </div>
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-gray-800 font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
          {workers?.username}
        </h4>
        <p className="text-gray-400 text-xs truncate">
          {workers?.skills?.slice(0, 2).join(', ')}{workers?.skills?.length > 2 && ' ...'}
        </p>
      </div>

      {/* Badge */}
      <div className="w-2 h-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

export default ChatCard;