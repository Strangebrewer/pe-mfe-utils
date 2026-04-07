import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from './userStore';

export function RequireAuth({ redirectUrl = "/" }) {
  const { user, isReady } = useUserStore();
  console.log("RequireAuth", { isReady, user });

  if (!isReady) return;

  if (!user) {
    return <Navigate to={redirectUrl} replace />
  }

  return <Outlet />
}

export function RequireGuest({ redirectUrl = "/dashboard" }) {
  const { user, isReady } = useUserStore();
  console.log("RequireGuest", { isReady, user });

  if (!isReady) return;

  if (user) {
    return <Navigate to={redirectUrl} replace />
  }

  return <Outlet />
}
