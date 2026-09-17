import { Icon } from './icons.jsx';
import { PAGE_ACTIONS_ID } from './PageActions.jsx';

/* Encabezado estándar de una vista: migas, título, descripción y acciones.

     <PageHeader
       title="Título de la vista"
       description="Descripción breve de lo que se muestra"
       breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Vista actual' }]}
       actions={<Button icon="sh-export">Exportar</Button>}
     /> */
export function PageHeader({ title, description, breadcrumbs = [], actions }) {
  return (
    <header className="hrl-pagehead">
      <div style={{ minWidth: 0 }}>
        {breadcrumbs.length > 0 && (
          <nav className="hrl-migas" aria-label="Ruta de navegación">
            {breadcrumbs.map((m, i) => {
              const ultimo = i === breadcrumbs.length - 1;
              return (
                <span key={m.label} className="hrl-migas__paso">
                  {i > 0 && <Icon name="sh-chevron" size={12} />}
                  {ultimo || !m.href ? (
                    <span aria-current={ultimo ? 'page' : undefined}>{m.label}</span>
                  ) : (
                    <a href={m.href}>{m.label}</a>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {/* Siempre presente: además de `actions`, es el destino de
          `PageActions`, con el que una vista pone aquí sus controles. */}
      <div className="hrl-pagehead__acciones" id={PAGE_ACTIONS_ID}>
        {actions}
      </div>
    </header>
  );
}
