"use client";

import { useTaskHandler } from "@/app/constants/taskHandler";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DemographicPage() {
  const { handleAssignAndRoute } = useTaskHandler();
  const searchParams = useSearchParams();

  const assignData = {
    taskId: searchParams.get("taskId"),
    processInstanceId: searchParams.get("processInstanceId"),
  };

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    country: "",
  });

  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!agreed) {
      alert("❗ Please confirm before submitting");
      return;
    }

    //  alert("✅ Demographic details submitted successfully");

    try {
      const response = await fetch("http://localhost:8080/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: assignData.taskId,
          variables: {
            name: formData.name,
            age: formData.age,
            gender: formData.gender,
            country: formData.country,
          },
        }),
      });

      console.log("Task Complete Response:", response.status);

      if (response.status === 200) {
        alert("✅ Demographic details submitted successfully");
        await handleAssignAndRoute(assignData.processInstanceId!);
      } else {
        alert("❌ Error completing task. Please try again.");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      alert("❌ Error completing task. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">Demographic Details</h1>
        <p className="text-gray-600">Please provide your demographic information below.</p>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter your country"
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center">
          <input
            id="agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="agree" className="text-gray-700">
            I confirm the details provided above are correct.
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className={`btn ${agreed ? "btn-primary" : "btn-secondary"}`}
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}