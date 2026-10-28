// Fundo azul-acinzentado atrás de todas as ferramentas: os cartões brancos,
// os campos de preenchimento e os painéis de resultado se destacam dele.
export default function FerramentasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#E3EAF2]">{children}</div>;
}
