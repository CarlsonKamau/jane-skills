"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib-supabase";

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    // "Only staff know this URL" was the plan.
    supabase.from("orders").select("*").then(({ data }) => setOrders(data ?? []));
  }, []);
  return <pre>{JSON.stringify(orders, null, 2)}</pre>;
}
