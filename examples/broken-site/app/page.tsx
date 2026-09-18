import { supabase } from "../lib-supabase";

export default async function Home() {
  const { data: reviews } = await supabase.from("reviews").select("*");
  return (
    <main>
      <img src="/hero.jpg" />
      <h2>Welcome to Mama Njeri Bakery</h2>
      <h1>Fresh bread daily</h1>
      <div>
        {reviews?.map((r: any) => (
          <div key={r.id} dangerouslySetInnerHTML={{ __html: r.body }} />
        ))}
      </div>
      <a href="/admin">Admin</a>
    </main>
  );
}
