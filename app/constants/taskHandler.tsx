import { useRouter } from "next/navigation";
export const useTaskHandler = () => {
  const router = useRouter();
  const handleAssignAndRoute = async (processInstanceId: string) => {
    try {
      const assignResponse = await fetch("http://localhost:8080/tasks/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processInstanceId,
          userId: "admin",
        }),
      });

      const assignDataNext = await assignResponse.json();
      console.log("Next Task Assign Response:", assignDataNext);
      console.log("Activity is:", assignDataNext.activity);

      if (assignDataNext?.activity === "OTP Validation") {
        router.push(
          `/modules/master/adhar-validation?taskId=${assignDataNext.taskId}&processInstanceId=${assignDataNext.processInstanceId}`
        );
      }
      else if (assignDataNext?.activity === "DemoGraphic") {
        router.push(`/modules/master/demographic?taskId=${assignDataNext.taskId}&processInstanceId=${assignDataNext.processInstanceId}`);
      }
      else if (assignDataNext?.activity === "KFS") {
        router.push(
          `/modules/master/kfs?taskId=${assignDataNext.taskId}&processInstanceId=${assignDataNext.processInstanceId}`
        );
      } else if (assignDataNext?.activity === "Notification") {
        router.push(
          `/modules/master/notification?taskId=${assignDataNext.taskId}&processInstanceId=${assignDataNext.processInstanceId}`
        );
      } else {
        alert("Inside umhandeled")
        console.warn("Unhandled activity:", assignDataNext?.activity);
        alert("Redirect to dashboard");
        router.push(`/dashboard`);
      }
    } catch (error) {
      console.error("Error in assign and route:", error);
       alert("Redirect to dashboard");
        router.push(`/dashboard`);
    }
  };

  return { handleAssignAndRoute };
};