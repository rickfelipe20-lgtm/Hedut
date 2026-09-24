import { NextRequest, NextResponse } from "next/server";
import { findItem } from "@/app/cursos/data";

export async function POST(request: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json({ ok: true });
  }

  const url = new URL(request.url);
  let paymentId =
    url.searchParams.get("data.id") || url.searchParams.get("id");
  let type = url.searchParams.get("type") || url.searchParams.get("topic");

  try {
    const body = await request.json();
    paymentId = body?.data?.id || paymentId;
    type = body?.type || type;
  } catch {
    // corpo vazio ou não-JSON: segue só com os query params
  }

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ ok: true });
  }

  const paymentRes = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!paymentRes.ok) {
    return NextResponse.json({ ok: true });
  }

  const payment = await paymentRes.json();

  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const slug = payment.external_reference;
  const item = findItem(slug);

  await fetch("https://formsubmit.co/ajax/hedut.projetos@hotmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `Venda confirmada: ${item?.titulo ?? slug}`,
      Item: item?.titulo ?? slug,
      Valor: `R$ ${payment.transaction_amount}`,
      "E-mail do comprador": payment.payer?.email ?? "não informado",
      "ID do pagamento": paymentId,
    }),
  }).catch((err) => console.error("Falha ao enviar e-mail de venda:", err));

  return NextResponse.json({ ok: true });
}
