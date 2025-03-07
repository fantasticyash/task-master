"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

import Dashboard from "@/components/dashboard";
import { checkAuth } from "@/lib/features/auth/authSlice";
import LoginPage from "@/components/login-page";

export default function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth() as never);
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </main>
  );
}
