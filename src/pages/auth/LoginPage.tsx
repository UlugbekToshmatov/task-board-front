import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { login } from "../../features/auth/authThunks";
import { clearError } from "../../features/auth/authSlice";
import { loginSchema, type LoginForm } from "../../schemas/authSchema";
import { useEffect } from "react";

export default function LoginPage() {
  const {error, token} = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const message: string | null = useLoaderData();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });
  const nicknameField = register('nickname');
  const passwordField = register('password');

  // useEffect(() => {
  //   // If user is already authenticated, redirect to tasks page
  //   if (token) {
  //     navigate("/tasks", { replace: true });
  //   }
  // }, [token, navigate]);   // Watch for changes in token

  useEffect(() => {
    // Clear error message when component unmounts
    return () => {
      dispatch(clearError());
    }
  }, [dispatch]);

  async function handleFormSubmit(inputData: LoginForm) {
    const result = await dispatch(login(inputData));

    if (login.fulfilled.match(result)) {
      reset();
      navigate("/tasks", { replace: true });
    } else if (login.rejected.match(result)) {
      // Error is handled in the slice, so we just return here
      return;
    }
  }

  if (token) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Please, sign in</h2>
      {message && (
        <p className="form-input-error">{message}</p>
      )}
      
      <form className="form-dialog" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-input-container">
          <input
            {...nicknameField}
            type="text" 
            placeholder="your_nickname"
            className="form-input"
            onFocus={() => dispatch(clearError())}
            onChange={(e) => {
              nicknameField.onChange(e);
              dispatch(clearError());
            }}
          />
          {errors.nickname && <p className="form-input-error">{errors.nickname.message}</p>}

          <input
            {...passwordField}
            type="password" 
            placeholder="password"
            className="form-input"
            onFocus={() => dispatch(clearError())}
            onChange={(e) => {
              passwordField.onChange(e);
              dispatch(clearError());
            }}
          />
          {errors.password && <p className="form-input-error">{errors.password.message}</p>}
        </div>

        {error && <p className="form-input-error">{error}</p>}
        <button className="form-submit-btn" type="submit" disabled={isSubmitting}>
          Login
        </button>
        <span>New here? <Link to="/register">Join now</Link></span>
      </form>
    </div>
  )
}
