"use client";
export function Login() {
  async function onSubmit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/login", { method: "POST", body: new FormData(e.target) });
    const { token } = await res.json();
    localStorage.setItem("token", token);
  }
  return (
    <form onSubmit={onSubmit}>
      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button>Go</button>
    </form>
  );
}
