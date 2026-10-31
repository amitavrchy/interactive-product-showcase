import { Suspense } from "react";
import { ConfigureClient } from "./ConfigureClient";

export default async function ConfigurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="px-5 py-20 text-muted">Loading configurator…</div>}>
      <ConfigureClient slug={slug} />
    </Suspense>
  );
}
