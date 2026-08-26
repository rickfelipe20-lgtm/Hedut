import Container from "./container";

const servicos = ["Projetos 3D", "Carga Térmica", "Seleção de Equipamentos"];

export function ServicesBand() {
  return (
    <section className="w-full bg-hedut-blue border-y-4 border-hedut-abissal">
      <Container>
        <div className="py-10 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* LOGO + TAGLINE */}
          <div>
            <svg viewBox="0 0 220 340" className="h-14 w-auto fill-white mb-4">
              <path d="M0 52 L80 0 L80 340 L0 268 Z" />
              <path d="M140 0 L220 52 L220 268 L140 340 Z" />
              <path d="M80 175 L140 145 L140 185 L80 215 Z" />
            </svg>

            <p className="font-display font-extrabold text-white text-3xl tracking-tight">
              HEDUT
            </p>
            <p className="font-display font-medium text-white/60 text-sm tracking-[0.3em] uppercase">
              Engenharia
            </p>
            <p className="text-white/70 mt-4">Projetos completos de HVAC.</p>
          </div>

          {/* SERVIÇOS */}
          <div>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/60">
              Serviços
            </span>
            <ul className="mt-4 space-y-3">
              {servicos.map((s) => (
                <li
                  key={s}
                  className="font-display font-bold text-white text-lg"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/60">
              Contato
            </span>
            <p className="font-mono text-white mt-4">
              hedut.projetos@hotmail.com
            </p>
            <p className="font-mono text-white/60">hedut.xyz</p>

            <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/60 block mt-6">
              Atendimento
            </span>
            <p className="text-white mt-2">Brasil todo</p>
          </div>
        </div>

        <div className="border-t border-white/20 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs font-mono text-white/50 tracking-wide">
          <div>
            <p>HEDUT PROJETOS LTDA — ME · CNPJ 51.142.450/0001-50</p>
            <p>HENRIQUE DUARTE · RESPONSÁVEL TÉCNICO · CREA 2623524742</p>
          </div>
          <p>© 2026 HEDUT ENGENHARIA</p>
        </div>
      </Container>
    </section>
  );
}
