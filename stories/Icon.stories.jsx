import { Icon, ICONS } from '../src/index.js';

export default { title: 'Iconos / Icon' };

/* Catálogo completo: cualquier nombre que no aparezca aquí no está
   registrado (ver CLAUDE.md § 2.3 del kit — icons.jsx / icon-catalog.js). */
export const Catalogo = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 16 }}>
    {ICONS.map((nombre) => (
      <div key={nombre} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <Icon name={nombre} size={22} />
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', textAlign: 'center', wordBreak: 'break-all' }}>
          {nombre}
        </span>
      </div>
    ))}
  </div>
);
