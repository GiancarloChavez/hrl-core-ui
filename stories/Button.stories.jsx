import { Button, IconButton } from '../src/index.js';

export default { title: 'Primitivos / Button' };

export const Tonos = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <Button tone="cta">cta</Button>
    <Button tone="blue">blue</Button>
    <Button tone="ghost">ghost</Button>
    <Button tone="danger">danger</Button>
    <Button tone="plain">plain</Button>
  </div>
);

export const Tamanos = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button size="md">md (40px)</Button>
    <Button size="sm">sm</Button>
  </div>
);

export const ConIconoYEstados = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <Button icon="sh-export">Exportar</Button>
    <Button tone="danger" size="sm" icon="sh-close">Eliminar</Button>
    <Button loading>Guardar</Button>
    <Button disabled>Deshabilitado</Button>
  </div>
);

export const Icono = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <IconButton icon="sh-eye" aria-label="Ver" />
    <IconButton icon="sh-gear" aria-label="Configuración" tone="accion" />
  </div>
);
