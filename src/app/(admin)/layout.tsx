
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase/config';
import { Logo } from '@/components/logo'; // Assuming you have a Logo component
import { Button } from '@/components/ui/button';

const auth = getAuth(app);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex items-center gap-2">
          <Logo />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // or a login redirect component
  }

  return (
    <div className="relative min-h-screen">
      {children}
      <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={handleSignOut} variant="secondary">Sign Out</Button>
      </div>
    </div>
    );
}
