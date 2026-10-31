"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function AdminProductsPage() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-8">
      <h1 className="font-display text-[36px] font-semibold">Admin · Products</h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        Catalog mirror for AI ingest. After Nest is seeded, call{" "}
        <code className="text-accent-2">POST /api/ai/ingest</code> to refresh Chroma embeddings.
        Embed text ships with each product for RAG.
      </p>
      <Button
        type="button"
        className="mt-6"
        variant="mint"
        onClick={() => {
          void fetch("/api/ai/ingest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ force: true }),
          }).then(async (r) => alert(JSON.stringify(await r.json())));
        }}
      >
        Trigger AI ingest
      </Button>
      <div className="mt-10 overflow-x-auto border border-line">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead className="border-b border-line bg-panel font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Embed</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line/70">
                <td className="px-4 py-3 font-mono text-accent-2">{p.slug}</td>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">${p.basePrice}</td>
                <td className="max-w-xs truncate px-4 py-3 text-muted">{p.embedText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
