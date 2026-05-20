import { SignIn, useUser } from '@clerk/react';

export function SignInPage() {
  const { isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="flex justify-center p-4">
      <SignIn routing="hash" fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" />
    </div>
  );
}
