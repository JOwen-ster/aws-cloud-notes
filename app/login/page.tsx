'use client';

import { Authenticator, View, Text, Heading, useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';

const components = {
  Header() {
    return (
      <View textAlign="center" padding="large">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="bg-primary p-2 rounded-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <Heading level={3} color="var(--primary)">
            CloudNotes
          </Heading>
          <Text color="var(--amplify-colors-font-secondary)">
            Secure Private Document Editing
          </Text>
        </div>
      </View>
    );
  },
};

export default function LoginPage() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/dashboard');
    }
  }, [authStatus, router]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <Authenticator components={components}>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
    </div>
  );
}
