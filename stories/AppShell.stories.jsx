import { useState } from 'react';
import { AppShell, Card } from '../src/index.js';

export default { title: 'Layout / AppShell', meta: { fullscreen: true } };

const NAV = [
  { id: 'resumen', label: 'Resumen', icon: 'sh-pie' },
  { id: 'indicadores', label: 'Indicadores', icon: 'sh-lines', group: 'Análisis' },
  { id: 'calidad', label: 'Calidad de datos', icon: 'sh-check', group: 'Análisis', badge: 3 },
  { id: 'config', label: 'Configuración', icon: 'sh-gear', group: 'Sistema' },
];

const NOTIFICACIONES = [
  { id: '1', title: 'Nuevo aviso', body: 'Se encontraron 3 registros por revisar.', unread: true },
  { id: '2', title: 'Reporte generado', body: 'El reporte mensual ya está disponible.', unread: false },
];

/* Ejemplo mínimo, no una réplica de ningún sistema real: el shell no sabe de
   ningún dominio concreto, así que esta demo tampoco debería fingir que sí. */
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
        user={{ name: 'Persona de prueba', role: 'Administración' }}
        notifications={NOTIFICACIONES}
        onSignOut={() => {}}
      >
        <Card title="Contenido de la vista">Aquí va el panel que corresponda a cada módulo.</Card>
      </AppShell>
    </div>
  );
};
