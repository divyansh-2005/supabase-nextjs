'use client';
import { useEffect } from 'react';
import { login } from './actions';
import styles from './login.module.css';

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
    <div className={styles.container}>
      <form method="POST" className={styles.formContainer}>
        <div>
      <h1 className={styles.heading}>Login</h1>
          <label htmlFor="email" className={styles.formLabel}>Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.formInput}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.formLabel}>Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.formInput}
            required
          />
        </div>
        <button
          formAction={login}
          className={styles.formButton}
          type="submit"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
