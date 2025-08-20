"use client";

import { useTaskHandler } from "@/app/constants/taskHandler";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function KFSPage() {
  const [agreed, setAgreed] = useState(false);
  const { handleAssignAndRoute } = useTaskHandler();

  const router = useRouter();
  const searchParams = useSearchParams();

  const assignData = {
    taskId: searchParams.get("taskId"),
    processInstanceId: searchParams.get("processInstanceId"),
  };

  const handleSubmit = async () => {
    if (!agreed) {
      alert("Please accept the Key Fact Statement before submitting ❗");
      return;
    }

   // alert("KFS submitted successfully ✅");

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
        alert("✅ KFS submitted succesfully");
       // router.push(`/dashboard`);
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
        <h1 className="text-2xl font-bold text-gray-800">Key Fact Statement (KFS)</h1>
        <p className="text-gray-600">
          Please review the details below carefully before proceeding.
        </p>

        {/* Product Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Product Details</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Product Name: <span className="font-medium">Personal Loan</span>
            </li>
            <li>Tenure: 24 months</li>
            <li>Interest Rate: 12% per annum</li>
          </ul>
        </section>

        {/* Fees & Charges */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Fees & Charges</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Processing Fee: ₹2,000 (non-refundable)</li>
            <li>Late Payment Fee: 2% of outstanding EMI</li>
            <li>Prepayment Charges: 4% of principal outstanding</li>
          </ul>
        </section>

        {/* Terms & Conditions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Terms & Conditions</h2>
          <p className="text-gray-600">
            The customer must ensure timely repayments. Bank reserves the right to
            revise the charges and interest rates as per RBI guidelines.
          </p>
        </section>

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
            I have read and understood the Key Fact Statement.
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

        {/* <button
          onClick={handleSubmit}
          disabled={!agreed}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold 
            ${agreed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Submit
        </button> */}
      </div>
    </div>
  );
}