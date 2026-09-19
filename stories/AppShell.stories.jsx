import { useState } from 'react';
import { AppShell, Card } from '../src/index.js';

export default { title: 'Layout / AppShell' };

const NAV = [
  { id: 'resumen', label: 'Resumen', icon: 'sh-pie' },
  { id: 'indicadores', label: 'Indicadores', icon: 'sh-lines', group: 'Vigilancia' },
  { id: 'consistencia', label: 'Consistencia', icon: 'sh-check', group: 'Vigilancia', badge: 3 },
  { id: 'config', label: 'Configuración', icon: 'sh-gear', group: 'Sistema' },
];

const NOTIFICACIONES = [
  { id: '1', title: 'Nuevo hallazgo', body: 'Consistencia encontró 3 registros por revisar.', unread: true },
  { id: '2', title: 'Reporte generado', body: 'El reporte mensual ya está disponible.', unread: false },
];

/* Ejemplo mínimo, no una réplica de ningún sistema real: el shell no sabe de
   pacientes ni de biopsias, así que esta demo tampoco debería fingir que sí. */
export const Basico = () => {
  const [activo, setActivo] = useState('resumen');
  return (
    <div style={{ height: '100vh' }}>
      <AppShell
        navItems={NAV}
        active={activo}
        onSelect={setActivo}
        title="Resumen"
        brand="Sistema de ejemplo"
        logo={<span style={{ fontWeight: 700 }}>HRL</span>}
        user={{ name: 'Persona de prueba', role: 'Administración' }}
        notifications={NOTIFICACIONES}
        onSignOut={() => {}}
      >
        <Card title="Contenido de la vista">Aquí va el panel que corresponda a cada módulo.</Card>
      </AppShell>
    </div>
  );
};
