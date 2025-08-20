'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTaskHandler } from '@/app/constants/taskHandler';
//import { useRouter } from 'next/router';

const AdharValidation = () => {
  const searchParams = useSearchParams();
 // const router = useRouter();

  // extract assignData from query params
  const assignData = {
    taskId: searchParams.get('taskId'),
    processInstanceId: searchParams.get('processInstanceId'),
  };
  const { handleAssignAndRoute } = useTaskHandler();
debugger
  console.log("Received assignData:", assignData);

  const [aadhaarInputs, setAadhaarInputs] = useState(Array(6).fill(''));
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [mockOtp] = useState('123456');
  const aadhaarRefs = useRef<HTMLInputElement[]>([]);
  const otpRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (otpSent) otpRef.current?.focus();
  }, [otpSent]);

  const handleAadhaarChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, '').slice(0, 2);
    const updated = [...aadhaarInputs];
    updated[index] = digits;
    setAadhaarInputs(updated);
    if (digits.length === 2 && index < 5) {
      aadhaarRefs.current[index + 1]?.focus();
    }
  };

  const handleAadhaarKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && aadhaarInputs[index] === '' && index > 0) {
      aadhaarRefs.current[index - 1]?.focus();
    }
  };

  const isAadhaarComplete = aadhaarInputs.every((val) => val.length === 2);
  const isOtpValid = otp.length === 6;

  const handleSendOtp = () => {
    const aadhaar = aadhaarInputs.join('');
    if (/^\d{12}$/.test(aadhaar)) {
      setOtpSent(true);
      setMessage(`✅ OTP sent to Aadhaar ending in ${aadhaar.slice(-4)}.`);
    } else {
      setMessage('❌ Please enter a valid 12-digit Aadhaar number.');
    }
  };

const handleValidateOtp = async () => {
  if (otp === mockOtp) {
    try {
      // Call backend API to complete the task
      const response = await fetch("http://localhost:8080/tasks/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: assignData.taskId,
         // taskId: '0678b25d-7c26-11f0-ae79-8c8caa4d1a97',
          variables: {
            approved: true,
            comment: "Verified by admin",
          },
        }),
      });

      const result = await response;
      console.log("Task Complete Response:", result);
      debugger

       if (response.status === 200) {
       // setMessage("✅ Aadhaar validation successful! Task completed.");
        alert("OTP Validation successfully")

        // Call common Step 2 + Step 3
         await handleAssignAndRoute(assignData.processInstanceId!);
      } else {
        setMessage("❌ Error completing task. Please try again.");
      }

      setMessage(`✅ Aadhaar validation successful! TaskID: ${assignData.taskId}`);
    } catch (error) {
      console.error("Error completing task:", error);
      setMessage("❌ Error completing task. Please try again.");
    }
  } else {
    setMessage("❌ Incorrect OTP. Please try again.");
    setOtp("");
    otpRef.current?.focus();
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Aadhaar Verification</h2>

        {/* Debug Info */}
        {/* <pre style={{ fontSize: '12px', background: '#f1f1f1', padding: '8px', borderRadius: '8px' }}>
          {JSON.stringify(assignData, null, 2)}
        </pre> */}

        {!otpSent && (
          <>
            <label style={styles.label}>Enter 12-digit Aadhaar Number</label>
            <div style={styles.aadhaarGroup}>
              {aadhaarInputs.map((val, i) => (
                <input
                  key={i}
                  type="text"
                  value={val}
                  maxLength={2}
                  onChange={(e) => handleAadhaarChange(e.target.value, i)}
                  onKeyDown={(e) => handleAadhaarKeyDown(e, i)}
                  ref={(el) => {
                    aadhaarRefs.current[i] = el!;
                  }}
                  style={styles.aadhaarInput}
                />
              ))}
            </div>
            <button
              style={{
                ...styles.button,
                opacity: isAadhaarComplete ? 1 : 0.5,
                cursor: isAadhaarComplete ? 'pointer' : 'not-allowed',
              }}
              onClick={handleSendOtp}
              disabled={!isAadhaarComplete}
            >
              📩 Send OTP
            </button>
          </>
        )}

        {otpSent && (
          <>
            <label style={styles.label}>Enter OTP</label>
            <input
              type="text"
              ref={otpRef}
              value={otp}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={styles.otpInput}
            />
            <button
              style={{
                ...styles.button,
                opacity: isOtpValid ? 1 : 0.5,
                cursor: isOtpValid ? 'pointer' : 'not-allowed',
              }}
              onClick={handleValidateOtp}
              disabled={!isOtpValid}
            >
              ✅ Validate OTP
            </button>
          </>
        )}

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('✅') ? '#155724' : '#721c24',
              border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: '#eef2f7',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  },
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '22px',
    color: '#333',
  },
  label: {
    display: 'block',
    fontWeight: 600,
    fontSize: '14px',
    marginBottom: '10px',
    color: '#444',
  },
  aadhaarGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  aadhaarInput: {
    width: '40px',
    height: '44px',
    fontSize: '16px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  otpInput: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
  },
  message: {
    marginTop: '20px',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
    fontWeight: 500,
  },
};

export default AdharValidation;




// 'use client';
// import React, { useState, useRef, useEffect } from 'react';

// const AdharValidation = () => {
//   const [aadhaarInputs, setAadhaarInputs] = useState(Array(6).fill(''));
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [message, setMessage] = useState('');
//   const [mockOtp] = useState('123456');
//   const aadhaarRefs = useRef<HTMLInputElement[]>([]);
//   const otpRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (otpSent) otpRef.current?.focus();
//   }, [otpSent]);

//   const handleAadhaarChange = (value: string, index: number) => {
//     const digits = value.replace(/\D/g, '').slice(0, 2);
//     const updated = [...aadhaarInputs];
//     updated[index] = digits;
//     setAadhaarInputs(updated);
//     if (digits.length === 2 && index < 5) {
//       aadhaarRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleAadhaarKeyDown = (e: React.KeyboardEvent, index: number) => {
//     if (e.key === 'Backspace' && aadhaarInputs[index] === '' && index > 0) {
//       aadhaarRefs.current[index - 1]?.focus();
//     }
//   };

//   const isAadhaarComplete = aadhaarInputs.every((val) => val.length === 2);
//   const isOtpValid = otp.length === 6;

//   const handleSendOtp = () => {
//     const aadhaar = aadhaarInputs.join('');
//     if (/^\d{12}$/.test(aadhaar)) {
//       setOtpSent(true);
//       //setMessage(✅ OTP sent to Aadhaar ending in ${aadhaar.slice(-4)}.);
//       setMessage(`✅ OTP sent to Aadhaar ending in ${aadhaar.slice(-4)}.`);

//     } else {
//       setMessage('❌ Please enter a valid 12-digit Aadhaar number.');
//     }
//   };

//   const handleValidateOtp = () => {
//     if (otp === mockOtp) {
//       setMessage('✅ Aadhaar validation successful!');
//     } else {
//       setMessage('❌ Incorrect OTP. Please try again.');
//       setOtp('');
//       otpRef.current?.focus();
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>🔐 Aadhaar Verification</h2>

//         {!otpSent && (
//           <>
//             <label style={styles.label}>Enter 12-digit Aadhaar Number</label>
//             <div style={styles.aadhaarGroup}>
//               {aadhaarInputs.map((val, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   value={val}
//                   maxLength={2}
//                   onChange={(e) => handleAadhaarChange(e.target.value, i)}
//                   onKeyDown={(e) => handleAadhaarKeyDown(e, i)}
//                   ref={(el) => {
//                     aadhaarRefs.current[i] = el!;
//                   }}
//                   style={styles.aadhaarInput}
//                 />
//               ))}
//             </div>
//             <button
//               style={{
//                 ...styles.button,
//                 opacity: isAadhaarComplete ? 1 : 0.5,
//                 cursor: isAadhaarComplete ? 'pointer' : 'not-allowed',
//               }}
//               onClick={handleSendOtp}
//               disabled={!isAadhaarComplete}
//             >
//               📩 Send OTP
//             </button>
//           </>
//         )}

//         {otpSent && (
//           <>
//             <label style={styles.label}>Enter OTP</label>
//             <input
//               type="text"
//               ref={otpRef}
//               value={otp}
//               maxLength={6}
//               placeholder="Enter 6-digit OTP"
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
//               style={styles.otpInput}
//             />
//             <button
//               style={{
//                 ...styles.button,
//                 opacity: isOtpValid ? 1 : 0.5,
//                 cursor: isOtpValid ? 'pointer' : 'not-allowed',
//               }}
//               onClick={handleValidateOtp}
//               disabled={!isOtpValid}
//             >
//               ✅ Validate OTP
//             </button>
//           </>
//         )}

//         {message && (
//           <div
//             style={{
//               ...styles.message,
//               backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
//               color: message.includes('✅') ? '#155724' : '#721c24',
//               border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
//             }}
//           >
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles: Record<string, React.CSSProperties> = {
//   container: {
//     background: '#eef2f7',
//     minHeight: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '40px',
//   },
//   card: {
//     background: '#fff',
//     borderRadius: '16px',
//     padding: '30px',
//     maxWidth: '400px',
//     width: '100%',
//     boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
//     transition: 'all 0.3s ease',
//   },
//   title: {
//     textAlign: 'center',
//     marginBottom: '24px',
//     fontSize: '22px',
//     color: '#333',
//   },
//   label: {
//     display: 'block',
//     fontWeight: 600,
//     fontSize: '14px',
//     marginBottom: '10px',
//     color: '#444',
//   },
//   aadhaarGroup: {
//     display: 'flex',
//     gap: '10px',
//     justifyContent: 'center',
//     marginBottom: '20px',
//   },
//   aadhaarInput: {
//     width: '40px',
//     height: '44px',
//     fontSize: '16px',
//     textAlign: 'center',
//     borderRadius: '8px',
//     border: '1px solid #ccc',
//     outline: 'none',
//   },
//   otpInput: {
//     width: '100%',
//     padding: '12px',
//     fontSize: '16px',
//     textAlign: 'center',
//     borderRadius: '8px',
//     border: '1px solid #ccc',
//     marginBottom: '20px',
//     outline: 'none',
//   },
//   button: {
//     width: '100%',
//     padding: '12px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     fontWeight: 'bold',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '16px',
//     transition: 'all 0.2s ease',
//   },
//   message: {
//     marginTop: '20px',
//     padding: '12px',
//     borderRadius: '8px',
//     fontSize: '14px',
//     textAlign: 'center',
//     fontWeight: 500,
//   },
// };

// export default AdharValidation;