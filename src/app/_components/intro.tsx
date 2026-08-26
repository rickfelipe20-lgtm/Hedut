const servicos = [
  { n: "01", t: "Carga Térmica" },
  { n: "02", t: "Seleção de Equipamentos" },
  { n: "03", t: "Projeto 2D/3D" },
  { n: "04", t: "Consultorias" },
  { n: "05", t: "ART's" },
];

export function Intro() {
  return (
    <section className="mt-16 mb-20">
      <span className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-hedut-blue">
        Projeto executivo completo de HVAC
      </span>

      <h1 className="font-display font-extrabold text-hedut-abissal text-4xl sm:text-5xl md:text-6xl tracking-tight mt-3">
        HEDUT <span className="text-hedut-blue">— Engenharia</span>
      </h1>

      <p className="text-lg text-hedut-abissal/80 mt-6 max-w-2xl leading-relaxed">
        Projetos de climatização do cálculo de carga térmica ao detalhamento
        executivo, com documentação pronta para execução e aprovação —
        precisão técnica que evita retrabalho em obra.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mt-12 pt-8 border-t border-hedut-aco/25 max-w-6xl">
        {servicos.map((item) => (
          <div key={item.n}>
            <span className="font-mono text-xs tracking-[0.2em] text-hedut-blue">
              {item.n}
            </span>
            <p className="font-display font-bold text-hedut-abissal text-xl mt-2">
              {item.t}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
