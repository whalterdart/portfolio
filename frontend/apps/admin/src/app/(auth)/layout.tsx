'use client';

import { AdminHeader } from '../../components/layout/AdminHeader';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="py-10">
        {children}
      </main>
    </div>
  );
}
