import { NextRequest, NextResponse } from "next/server";
import { findItem } from "@/app/cursos/data";

const SITE_URL = "https://hedut.xyz";

export async function POST(request: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Checkout indisponível no momento." },
      { status: 503 }
    );
  }

  const { slug } = await request.json();
  const item = findItem(slug);

  if (!item) {
    return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
  }

  const preference = {
    items: [
      {
        title: item.titulo,
        quantity: 1,
        unit_price: item.preco,
        currency_id: "BRL",
      },
    ],
    back_urls: {
      success: `${SITE_URL}/compra/sucesso?slug=${item.slug}`,
      failure: `${SITE_URL}/compra/erro?slug=${item.slug}`,
      pending: `${SITE_URL}/compra/pendente?slug=${item.slug}`,
    },
    auto_return: "approved",
    notification_url: `${SITE_URL}/api/mercadopago/webhook`,
    external_reference: item.slug,
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao criar preferência Mercado Pago:", error);
    return NextResponse.json(
      { error: "Não foi possível iniciar o checkout." },
      { status: 502 }
    );
  }

  const data = await res.json();

  return NextResponse.json({ url: data.init_point });
}
