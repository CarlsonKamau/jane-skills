import { requireUser } from "../../lib/auth-guard";
import { createServerClient } from "../../lib/supabase-server";

export default async function Admin() {
  await requireUser({ role: "staff" }); // checked here, where the data is read
  const supabase = await createServerClient();
  const { data: orders } = await supabase.from("orders").select("id, customer, total, status");
  return (
    <main>
      <h1>Orders</h1>
      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{orders?.map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td>{o.total}</td><td>{o.status}</td></tr>)}</tbody>
      </table>
    </main>
  );
}
