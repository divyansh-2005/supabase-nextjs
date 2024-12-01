'use client'
import { useEffect } from 'react';
import { login } from './actions';

export default function LoginPage() {
  useEffect(() => {
    // Check for the 'status' query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'check-email') {
      // Display the browser alert for email verification
      alert('A verification email has been sent. Please check your inbox!');
    }
  }, []);

  return (
    <div>
      <form method="POST">
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <br /><br />

        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <br /><br />

        <button formAction={login}>Log In</button>
      </form>
    </div>
  );
}
