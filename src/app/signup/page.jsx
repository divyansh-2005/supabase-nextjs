import { signup } from './actions';

export default function SignupPage() {
  return (
    <form method="POST">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <br /><br />

      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <br /><br />

      <button formAction={signup}>Sign Up</button>
    </form>
  );
}
