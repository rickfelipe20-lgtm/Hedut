"use client";

import { useState } from "react";

export function BuyButton({ slug, label }: { slug: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  async function handleClick() {
    setLoading(true);
    setErro(false);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) throw new Error("checkout failed");

      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setErro(true);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-block w-full sm:w-auto text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-10 duration-200 transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecionando..." : label}
      </button>

      {erro && (
        <p className="text-red-600 text-sm mt-3">
          Não foi possível iniciar o pagamento. Tente novamente em instantes.
        </p>
      )}
    </div>
  );
}
