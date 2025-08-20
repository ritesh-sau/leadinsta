"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function NotificationPage() {
  const router = useRouter();
   const searchParams = useSearchParams();
  
    const assignData = {
      taskId: searchParams.get("taskId"),
      processInstanceId: searchParams.get("processInstanceId"),
    };

  const handleSubmit = async () => {

  //  alert("Notification submitted successfully ✅"+ assignData.taskId);

    try {
      const response = await fetch("http://localhost:8080/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: assignData.taskId,
          variables: {
            approved: true,
            comment: "Verified by admin",
          },
        }),
      });

      console.log("Task Complete Response:", response.status);

      if (response.status === 200) {
        alert("✅ Notification submitted succesfully and redirect to dashboard");
        router.push(`/dashboard`);

      } else {
        alert("❌ Error completing task. Please try again.");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      alert("❌ Error completing task. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card text-center shadow-lg p-4" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="text-success mb-3">✅ Task Completed</h2>
          <p className="text-muted">Your task has been successfully submitted.</p>
          
          <button
            className="btn btn-primary mt-3"
            //onClick={() => router.push("/dashboard")}
            onClick={handleSubmit}
          >
            Go to Dashboard
          </button> 
        </div>
      </div>
    </div>
  );
}
