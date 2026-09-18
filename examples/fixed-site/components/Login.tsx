"use client";
// Session is set by the server as an httpOnly cookie; nothing stored client-side.
export function Login() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch("/api/login", { method: "POST", body: new FormData(e.currentTarget) });
    window.location.href = "/admin";
  }
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />
      <button type="submit">Sign in</button>
    </form>
  );
}
