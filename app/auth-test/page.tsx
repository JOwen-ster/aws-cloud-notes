'use client';

import { useState } from 'react';
import {
  signUp,
  confirmSignUp,
  signIn,
  getCurrentUser,
  signOut,
} from 'aws-amplify/auth';

export default function AuthTestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Auth Test Page</h1>

      <input
        placeholder="Email"
        className="border p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="Verification Code"
        className="border p-2"
        onChange={(e) => setCode(e.target.value)}
      />

      <div className="space-x-2">
        <button
          onClick={async () => {
            await signUp({
              username: email,
              password,
              options: {
                userAttributes: { email },
              },
            });
            alert('Check your email for code');
          }}
        >
          Sign Up
        </button>

        <button
          onClick={async () => {
            await confirmSignUp({
              username: email,
              confirmationCode: code,
            });
            alert('Confirmed!');
          }}
        >
          Confirm
        </button>

        <button
          onClick={async () => {
            await signIn({ username: email, password });
            alert('Signed in!');
          }}
        >
          Sign In
        </button>

        <button
          onClick={async () => {
            const user = await getCurrentUser();
            console.log(user);
            alert(`User: ${user.username}`);
          }}
        >
          Get Current User
        </button>

        <button
          onClick={async () => {
            await signOut();
            alert('Signed out');
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}