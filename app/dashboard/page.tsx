"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskHandler } from "../constants/taskHandler";

export default function DashboardPage() {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const { handleAssignAndRoute } = useTaskHandler();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]);

  const handleApiCall = async () => {
    try {
      // Step 1: Start Workflow
      const response = await fetch(
        "http://localhost:8080/workflow/start/Process_LeadInstaWorkflow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`, // if required
          },
        }
      );

      const data = await response.json();
      console.log("Workflow Start Response:", data);

      // Extract processInstanceId
      const processInstanceId = data?.processInstanceId;
      if (!processInstanceId) {
        throw new Error("processInstanceId not found in response");
      } else {
        await handleAssignAndRoute(processInstanceId);
      }

    } catch (error) {
      console.error("API call failed:", error);
      setApiResponse("Error fetching data");
    }
  };

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="p-6 flex-1">
        <div className="container py-5">
          <h1 className="text-center">Welcome to Dashboard</h1>

          {/* LeadInsta link */}
          <button
            onClick={handleApiCall}
            className="text-blue-600 underline mt-4"
          >
            LeadInstaPersonalLone
          </button>

          {/* Print API response */}
          {/* {apiResponse && (
            <pre className="mt-4 bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
              {apiResponse}
            </pre>
          )} */}
        </div>
      </div>
    </div>
  );
}




// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "../components/sideBar/Sidebar";


// export default function DashboardPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login"); // Redirect to login if not authenticated
//     }
//   }, [router]);

//   return (
//     <div className="flex">
//       {/* <Sidebar  /> */}
//       <div className="p-6 flex-1">
//         <div className="container py-5">
//           <h1 className="text-center">Welcome to Dashboard</h1>
//         </div>

//         {/* <button
//         className="mt-4 bg-red-500 text-white px-4 py-2"
//         onClick={onLogout}
//       >
//         Logout
//       </button> */}
//       </div>
//     </div>
//   );
// }

// import Sidebar from '@/components/Sidebar/Sidebar';
// import React, { useState } from 'react';

// interface Props {
//   onLogout: () => void;
// }

// const Dashboard: React.FC<Props> = ({ onLogout }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <div className="flex h-screen">
//       {isSidebarOpen && <Sidebar />}
//       <div className="flex-1 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <button
//             className="bg-gray-700 text-white px-4 py-2 rounded"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           >
//             {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
//           </button>
//           <button
//             className="bg-red-500 text-white px-4 py-2 rounded"
//             onClick={onLogout}
//           >
//             Logout
//           </button>
//         </div>
//         <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;