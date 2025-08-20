// import { menu } from "../data/Menu";
// import Node from "./Node";

// const Sidebar = () => {
//   return (
//     <div className="w-64 bg-gray-100 h-screen p-4 border-r">
//       <h2 className="text-xl font-bold mb-4">Menu</h2>
//       {menu.map((item, index) => (
//         <Node key={index} item={item} />
//       ))}
//     </div>
//   );
// };

// export default Sidebar;

import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-b p-4">
      <h2 className="text-lg font-bold mb-4">Sidebar</h2>
      <ul>
        <li className="mb-2 hover:text-gray-300">Home</li>
        <li className="mb-2 hover:text-gray-300">Profile</li>
        <li className="mb-2 hover:text-gray-300">Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;