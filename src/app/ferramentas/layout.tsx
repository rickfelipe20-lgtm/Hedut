// Fundo azul-acinzentado atrás de todas as ferramentas: os cartões brancos,
// os campos de preenchimento e os painéis de resultado se destacam dele.
export default function FerramentasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // flow-root: impede que as margens do conteúdo vazem para fora do fundo
  // (senão aparece uma faixa branca no topo e na base).
  return <div className="bg-[#E3EAF2] flow-root">{children}</div>;
}
