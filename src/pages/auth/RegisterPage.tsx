import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { registerSchema, type RegisterForm } from "../../schemas/authSchema";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { register as doRegister } from "../../features/auth/authThunks";
import { clearError } from "../../features/auth/authSlice";
import { useEffect } from "react";

export default function RegisterPage() {
  const {error, token} = useAppSelector(store => store.auth)
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });
  const nicknameField = register('nickname');
  const passwordField = register('password');
  const emailField = register('email');

  useEffect(() => {
    return () => {
      dispatch(clearError());
    }
  }, [dispatch])

  async function handleFormSubmit(inputData: RegisterForm) {
    const result = await dispatch(doRegister(inputData));

    if (doRegister.fulfilled.match(result)) {
      reset();
      navigate("/tasks", { replace: true });
    } else if (doRegister.rejected.match(result)) {
      return;
    }
  }

  if (token) {
    return <Navigate to="/tasks" replace />
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Sign up</h2>

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

          <input
            {...emailField}
            type="email" 
            placeholder="your@e.mail"
            className="form-input"
            onFocus={() => dispatch(clearError())}
            onChange={(e) => {
              emailField.onChange(e);
              dispatch(clearError());
            }}
          />
          {errors.email && <p className="form-input-error">{errors.email.message}</p>}
        </div>

        {error && <p className="form-input-error">{error}</p>}
        <button className="form-submit-btn" type="submit" disabled={isSubmitting}>
          Register
        </button>
        <span>Already joined? <Link to="/login">Sign in</Link></span>
      </form>
    </div>
  );
}
