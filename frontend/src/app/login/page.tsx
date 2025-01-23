'use client';

import SignInForm from '@/components/SignInForm';
import SignUpForm from '@/components/SignUpForm';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '../state';
import { redirect } from 'next/navigation';

export default function Login() {
  const [isSignin, setIsSignin] = useState<boolean>(true);
  const auth = useRecoilValue(authState);
  useEffect(() => {
    if (auth.token) {
      redirect('/');
    }
  }, [auth]);

  const handleChangeForm: () => void = () => {
    setIsSignin(!isSignin);
  };

  return (
    <main>
      <div className="mx-auto mt-10 max-w-2xl">
        {isSignin ? (
          <SignInForm changeForm={handleChangeForm} />
        ) : (
          <SignUpForm changeForm={handleChangeForm} />
        )}
      </div>
    </main>
  );
}
