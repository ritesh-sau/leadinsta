'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'; // ✅ Use this for App Router
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { API_URLS } from '../constants/apiUrls';


type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    mode: 'onTouched',
  });

  const router = useRouter(); // ✅ initialize router
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: LoginForm) => {
    console.log("Submitted:", data);
    router.push('/dashboard');
    localStorage.setItem('token', '1234');
    // try {
    //   const response = await fetch(API_URLS.LOGIN, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     const errorBody = await response.json().catch(() => ({}));
    //     throw new Error(errorBody.message || 'Authentication service unavailable. Connect to administrator');
    //   }

    //   const result = await response.headers.get('Jwt-Token') ?? '';
    //  // alert(result)
    //   const token = result;
    //   localStorage.setItem("isAuthenticated", "true");
    //   localStorage.setItem('token', token); // Store JWT token

    //   router.push('/dashboard'); // Redirect to dashboard
    // } catch (error:any) {
    //   console.error('Login failed:', error);
    //   enqueueSnackbar(error.message || 'Something went wrong!', { variant: 'error' });
    // }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-3">
          <Image src="/hdfc-logo.svg" alt="Logo" width={150} height={30} className="mb-2" />
        </div>
        <h2 className="text-center mb-4">Login</h2>
        <hr />
        <p className="text-center text-muted mb-4">Welcome back! Login to access your account</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label">UserName</label>
            <input
              type="text"
              {...register("username", { required: "UserName is required" })}
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn px-4"
              disabled={!isValid}
              style={{
                backgroundColor: isValid ? '#0d6efd' : 'rgba(0,0,0,0.1)',
                borderColor: isValid ? '#0d6efd' : 'rgba(0,0,0,0.1)',
                color: isValid ? 'white' : '#333',
                // cursor: isValid ? 'pointer' : 'not-allowed',
              }}
            >
              Submit
            </button>

          </div>
        </form>

      </div>
    </div>
  );
}