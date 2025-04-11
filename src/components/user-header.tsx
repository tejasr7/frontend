import React, { useEffect, useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from '../hooks/use-mobile';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export function UserHeader() {
  const isMobile = useIsMobile();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        setLoading(true);
        
        if (!user) {
          setUserProfile(null);
          return;
        }

        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          const profileData = profileDoc.data() as UserProfile;
          setUserProfile(profileData);
        } else {
          setUserProfile({
            name: user.displayName || 'User',
            email: user.email || '',
            avatarUrl: user.photoURL || ''
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <ThemeToggle />
        <Avatar className="w-8 h-8">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      <ThemeToggle />
      <Link to="/profile">
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage 
            src={userProfile?.avatarUrl} 
            alt={userProfile?.name || 'User'} 
          />
          <AvatarFallback>
            {userProfile?.name?.substring(0, 2).toUpperCase() || 'US'}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}
