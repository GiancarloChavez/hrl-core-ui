import { Button, Card, IconButton } from '../../src/index.js';
import tokens from '../../tokens.json';

export default { title: 'Fundamentos / Forma y elevación' };

const TODOS = Object.assign({}, ...tokens.light.map((g) => g.tokens));

const RADIOS = ['radius-xs', 'radius-sm', 'radius-md', 'radius', 'radius-lg', 'radius-xl', 'radius-full'];
const SOMBRAS = ['shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-overlay'];

export const Escalas = () => (
  <div className="showroom-pagina">
    <header>
      <h1 className="showroom-titulo">Forma y elevación</h1>
      <p className="showroom-bajada">
        Radios, sombras y tamaños táctiles. Como el resto, son tokens: una tarjeta, un botón y un diálogo
        comparten la misma familia de formas.
      </p>
    </header>

    <Card title="Radios">
      <div className="showroom-formas">
        {RADIOS.map((nombre) => (
          <div key={nombre} className="showroom-forma">
            <div className="showroom-forma__caja" style={{ borderRadius: `var(--${nombre})` }} />
            <span className="showroom-etiqueta">
              --{nombre}
              <br />
              {TODOS[nombre]}
            </span>
          </div>
        ))}
      </div>
    </Card>

    <Card title="Sombras">
      <div className="showroom-formas">
        {SOMBRAS.map((nombre) => (
          <div key={nombre} className="showroom-forma">
            <div
              className="showroom-forma__caja showroom-forma__caja--sombra"
              style={{ borderRadius: 'var(--radius)', boxShadow: `var(--${nombre})` }}
            />
            <span className="showroom-etiqueta">--{nombre}</span>
          </div>
        ))}
      </div>
    </Card>

    <Card title="Objetivos táctiles" subtitle="Ningún control interactivo baja de 40 px de alto; las acciones principales llegan a 44 px.">
      <div className="showroom-fila">
        <Button>Botón · {TODOS['touch-target']}</Button>
        <IconButton icon="sh-gear" aria-label="Configuración" />
      </div>
    </Card>
  </div>
);
