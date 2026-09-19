import { GaugeArc, Sparkline, StackedBars, SeriesBars, Funnel, Ranking, SplitBar } from '../src/index.js';

export default { title: 'Gráficos / Charts' };

export const Gauge = () => (
  <div style={{ display: 'flex', gap: 24 }}>
    <GaugeArc value={42} color="var(--success)" label="Con dato" />
    {/* Denominador cero no es 0%: el arco se pinta vacío, no en cero. */}
    <GaugeArc value={null} color="var(--success)" label="Sin datos" />
  </div>
);

export const LineaMini = () => <Sparkline values={[3, 5, 4, 8, 6, 9, 7]} color="var(--accent)" />;

export const Apiladas = () => (
  <StackedBars
    labels={['ene', 'feb', 'mar']}
    series={[
      { name: 'SIS', color: 'var(--accent)', values: [4, 6, 3] },
      { name: 'Privado', color: 'var(--warning)', values: [1, 2, 2] },
    ]}
  />
);

export const SerieConMesesSinDato = () => (
  /* No se dibujan meses sin datos como ceros: la serie se recorta en el
     último mes con datos y el bloque vacío se rotula aparte. */
  <SeriesBars
    points={[
      { label: 'ene', value: 12 },
      { label: 'feb', value: 18 },
      { label: 'mar', value: null },
      { label: 'abr', value: null },
    ]}
    emptyTail="Sin cierre aún"
  />
);

export const EmbudoDeEtapas = () => (
  <Funnel
    stages={[
      { name: 'Recibidos', value: 500, color: 'var(--accent)' },
      { name: 'Validados', value: 120, color: 'var(--warning)' },
      { name: 'Cerrados', value: 80, color: 'var(--success)' },
    ]}
  />
);

export const RankingBasico = () => (
  <Ranking
    rows={[
      { name: 'Categoría A', value: 42, color: 'var(--accent)' },
      { name: 'Categoría B', value: 31, color: 'var(--warning)' },
      { name: 'Categoría C', value: 18, color: 'var(--success)' },
    ]}
  />
);

export const Division = () => <SplitBar value={68} total={100} color="var(--success)" />;
