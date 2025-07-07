"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  
  // This will redirect logged-in users to their appropriate dashboard
  useAuthRedirect();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-gray-900 dark:bg-black transition-colors p-6">
      <h1 className="text-3xl font-bold mb-2 text-white">Welcome to the Parlour Dashboard</h1>
      <p className="text-muted-foreground mb-6">We are glad to have you here! Explore the features and manage your parlour efficiently.</p>
      <div className="flex gap-4 mb-8">
        <Button onClick={() => router.push('/login')}>Login as Admin</Button>
        <Button variant="secondary" onClick={() => router.push('/login')}>Login as Superadmin</Button>
      </div>
    </div>
  );
}
