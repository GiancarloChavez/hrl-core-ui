import { useEffect, useRef, useState } from 'react';
import { Card } from '../../src/index.js';
import tokens from '../../tokens.json';
import { useTemaHrl } from '../_compartido/useTemaHrl.js';

export default { title: 'Fundamentos / Colores' };

/* Cada sección se localiza por un token que solo existe en su grupo de
   tokens.json, no por su posición: si el archivo se reordena, la página no
   se descuadra. El texto de cada sección es el que ve el público. */
const SECCIONES = [
  { clave: 'background', titulo: 'Superficies y texto', desc: 'El lienzo de la aplicación, las tarjetas y el texto que se lee sobre ellas.' },
  { clave: 'primary', titulo: 'Acción principal', desc: 'El color de la marca en botones y elementos activos.' },
  { clave: 'accent', titulo: 'Acción secundaria y enlaces', desc: 'Para enlaces y acciones que no compiten con la principal.' },
  { clave: 'destructive', titulo: 'Estados', desc: 'Correcto, atención y error. Cada uno trae su texto legible sobre su propio fondo.' },
  { clave: 'info-soft', titulo: 'Fondos teñidos', desc: 'Versiones suaves de cada estado, para avisos y etiquetas.' },
  { clave: 'input', titulo: 'Bordes, campos y foco', desc: 'Trazos de los controles y el anillo de foco del teclado.' },
  { clave: 'marca-verde', titulo: 'Identidad institucional', desc: 'Los colores del logotipo del hospital. No expresan ningún estado.' },
  { clave: 'serie-1', titulo: 'Paleta categórica', desc: 'Para distinguir series en gráficos, sin significado de semáforo.' },
];

/* Un token es color si su valor lo es; los de escala (radios, sombras,
   tipografía) viven en otros grupos y no entran aquí. */
const esColor = (nombre, valor) =>
  !nombre.startsWith('shadow') && /^(#|rgba?\(|hsla?\(|var\(--)/.test(valor);

function aHex(rgb) {
  const m = rgb.match(/rgba?\(([^)]+)\)/);
  if (!m) return rgb;
  const [r, g, b, a] = m[1].split(',').map((n) => Number(n.trim()));
  const hex = [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
  return a !== undefined && a < 1 ? `#${hex} · ${Math.round(a * 100)} %` : `#${hex}`;
}

function Muestra({ nombre }) {
  const ref = useRef(null);
  const tema = useTemaHrl();
  const [valor, setValor] = useState('');

  /* El valor se lee del navegador ya resuelto para el tema activo, no de
     tokens.json: en oscuro muchos tokens cambian y el archivo solo guarda la
     definición base. */
  useEffect(() => {
    if (ref.current) setValor(aHex(getComputedStyle(ref.current).backgroundColor));
  }, [tema]);

  return (
    <div className="showroom-muestra">
      <div ref={ref} className="showroom-muestra__color" style={{ background: `var(--${nombre})` }} />
      <div className="showroom-muestra__texto">
        <span className="showroom-muestra__nombre">--{nombre}</span>
        <span className="showroom-muestra__valor">{valor}</span>
      </div>
    </div>
  );
}

export const Paleta = () => (
  <div className="showroom-pagina">
    <header>
      <h1 className="showroom-titulo">Colores</h1>
      <p className="showroom-bajada">
        Los valores se leen en vivo del navegador: cambia el tema en la barra superior y verás cómo responde cada
        uno.
      </p>
    </header>

    {SECCIONES.map(({ clave, titulo, desc }) => {
      const grupo = tokens.light.find((g) => clave in g.tokens);
      if (!grupo) return null;
      const nombres = Object.entries(grupo.tokens)
        .filter(([nombre, valor]) => esColor(nombre, valor))
        .map(([nombre]) => nombre);

      return (
        <Card key={clave} title={titulo}>
          <p className="showroom-seccion-desc">{desc}</p>
          <div className="showroom-muestras">
            {nombres.map((nombre) => (
              <Muestra key={nombre} nombre={nombre} />
            ))}
          </div>
        </Card>
      );
    })}
  </div>
);
