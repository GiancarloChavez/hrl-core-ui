import { Card } from '../../src/index.js';
import tokens from '../../tokens.json';

export default { title: 'Fundamentos / Tipografía' };

const TOKENS_ESCALA = Object.assign({}, ...tokens.light.map((g) => g.tokens));

const MUESTRA = 'El seguimiento clínico empieza por un dato fiable';

const ESCALA = ['text-2xl', 'text-xl', 'text-lg', 'text-md', 'text-base', 'text-sm', 'text-xs'];
const PESOS = [
  ['weight-regular', 'Regular'],
  ['weight-medium', 'Medium'],
  ['weight-semibold', 'Semibold'],
  ['weight-bold', 'Bold'],
];

export const Escala = () => (
  <div className="showroom-pagina">
    <header>
      <h1 className="showroom-titulo">Tipografía</h1>
      <p className="showroom-bajada">
        Dos familias y una escala corta. Todo texto de los componentes sale de estos tokens: si se cambia la
        fuente aquí, cambia en todas partes.
      </p>
    </header>

    <Card title="Familias">
      <div style={{ display: 'grid', gap: 24 }}>
        <div className="showroom-familia">
          <span className="showroom-familia__aa" style={{ fontFamily: 'var(--font-sans)' }}>Aa</span>
          <div>
            <strong style={{ fontSize: 'var(--text-lg)' }}>Public Sans</strong>
            <p className="showroom-etiqueta">--font-sans</p>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)' }}>ABCDEFGHIJKLMNÑOPQRSTUVWXYZ abcdefghijklmnñopqrstuvwxyz 0123456789</p>
          </div>
        </div>
        <div className="showroom-familia">
          <span className="showroom-familia__aa" style={{ fontFamily: 'var(--font-mono)' }}>Aa</span>
          <div>
            <strong style={{ fontSize: 'var(--text-lg)' }}>IBM Plex Mono</strong>
            <p className="showroom-etiqueta">--font-mono</p>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>0123456789 · 00123 · 12345678 · 2026-09-19</p>
          </div>
        </div>
      </div>
    </Card>

    <Card title="Escala de tamaños">
      <div className="showroom-escala">
        {ESCALA.map((nombre) => (
          <div key={nombre} className="showroom-escala__fila">
            <span className="showroom-etiqueta">
              --{nombre}
              <br />
              {TOKENS_ESCALA[nombre]}
            </span>
            <span style={{ fontSize: `var(--${nombre})`, lineHeight: 'var(--leading-tight)' }}>{MUESTRA}</span>
          </div>
        ))}
      </div>
    </Card>

    <Card title="Pesos">
      <div className="showroom-escala">
        {PESOS.map(([nombre, rotulo]) => (
          <div key={nombre} className="showroom-escala__fila">
            <span className="showroom-etiqueta">
              --{nombre}
              <br />
              {TOKENS_ESCALA[nombre]}
            </span>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: `var(--${nombre})` }}>
              {rotulo} · {MUESTRA}
            </span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

/* Para probar una combinación concreta: los controles de la barra lateral
   cambian familia, tamaño y peso sobre un texto propio. */
export const Probador = ({ texto, familia, tamano, peso }) => (
  <div className="showroom-pagina">
    <Card title="Probador">
      <p
        style={{
          margin: 0,
          fontFamily: `var(--${familia})`,
          fontSize: `var(--${tamano})`,
          fontWeight: `var(--${peso})`,
          lineHeight: 'var(--leading-normal)',
        }}
      >
        {texto}
      </p>
    </Card>
  </div>
);

Probador.args = {
  texto: MUESTRA,
  familia: 'font-sans',
  tamano: 'text-xl',
  peso: 'weight-semibold',
};

Probador.argTypes = {
  familia: { control: { type: 'radio' }, options: ['font-sans', 'font-mono'] },
  tamano: { control: { type: 'select' }, options: ESCALA },
  peso: { control: { type: 'select' }, options: PESOS.map(([nombre]) => nombre) },
};
