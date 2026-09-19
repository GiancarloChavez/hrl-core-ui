import { useState } from 'react';
import { Tabs } from '../src/index.js';

export default { title: 'Primitivos / Tabs' };

export const Basico = () => {
  const [activo, setActivo] = useState('resumen');
  return (
    <Tabs
      tabs={[
        { key: 'resumen', label: 'Resumen', icon: 'sh-pie' },
        { key: 'historico', label: 'Histórico', icon: 'sh-lines' },
        { key: 'config', label: 'Configuración', icon: 'sh-gear' },
      ]}
      active={activo}
      onChange={setActivo}
    />
  );
};

export const ConAviso = () => {
  const [activo, setActivo] = useState('resumen');
  return (
    <Tabs
      tabs={[
        { key: 'resumen', label: 'Resumen' },
        { key: 'calidad', label: 'Calidad' },
      ]}
      active={activo}
      onChange={setActivo}
      alerts={{ calidad: '3 avisos nuevos' }}
    />
  );
};
