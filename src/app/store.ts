import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/task/taskSlice';
import tagReducer from '../features/tag/tagSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    tag: tagReducer,
    user: userReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;