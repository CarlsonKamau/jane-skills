import Image from "next/image";
import { supabase } from "../lib-supabase";
import { JsonLd } from "./JsonLd";

export const metadata = { title: "Fresh bread daily", description: "Mama Njeri Bakery in Ruiru: sourdough, mandazi and cakes baked every morning." };

export default async function Home() {
  const { data: reviews } = await supabase.from("reviews").select("id, author, body");
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Bakery", name: "Mama Njeri Bakery" }} />
      <Image src="/hero.jpg" alt="Loaves cooling on a rack at Mama Njeri Bakery" width={1200} height={630} priority />
      <h1>Fresh bread daily</h1>
      <h2>Welcome to Mama Njeri Bakery</h2>
      <section aria-label="Customer reviews">
        {reviews?.map((r) => (
          <blockquote key={r.id}><p>{r.body}</p><cite>{r.author}</cite></blockquote>
        ))}
      </section>
    </main>
  );
}
