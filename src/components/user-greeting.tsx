import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function UserGreeting() {
  const isMobile = useIsMobile();
  // const [greeting, setGreeting] = useState(getGreeting());
  const [username, setUsername] = useState<string | null>(null);

  // function getGreeting(): string {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return 'Good Morning';
  //   if (hour < 18) return 'Good Afternoon';
  //   return 'Happy Late Night';
  // }

  // Update greeting every 5 mins
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setGreeting(getGreeting());
  //   }, 5 * 60 * 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // Get user from Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || user.email?.split('@')[0] || 'User');
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!username) return null; // Or show a loading indicator if you prefer

  return (
    <div className="flex flex-col items-center justify-center mt-4 md:mt-6">
      {/* <div className="mb-3 md:mb-4">
        <svg
          width={isMobile ? '60' : '80'}
          height={isMobile ? '60' : '80'}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground"
        >
          <path
            d="M70 10L15 30L35 45L45 65L70 10Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div> */}
      {/* <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-mono tracking-wide text-center`}>
        {greeting}, {username}
      </h1> */}
    </div>
  );
}




