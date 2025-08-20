'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface MenuItem {
  name: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

const Node = ({ item }: { item: MenuItem }) => {
  const pathname = usePathname();

  return (
    <div className="ml-2 my-1">
      <div className="font-semibold">{item.name}</div>
      {item.children ? (
        <div className="ml-3 border-l border-gray-300 pl-2">
          {item.children.map((child, index) => (
            <Node key={index} item={child} />
          ))}
        </div>
      ) : item.route ? (
        <Link
          href={item.route}
          className={`block ml-4 ${
            pathname === item.route
              ? "text-blue-600 font-medium"
              : "text-gray-700 hover:text-blue-500"
          }`}
        >
          {item.name}
        </Link>
      ) : null}
    </div>
  );
};

export default Node;
