'use client';
import { signup } from './actions';
import styles from './signup.module.css';

export default function SignupPage() {
  return (
    <>
    <Navbar/>
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign Up</h1>
      <form method="POST" className={styles.formContainer}>
        <div>
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
          formAction={signup}
          className={styles.formButton}
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
    </>
  );
}
