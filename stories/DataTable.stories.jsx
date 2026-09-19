import { useState } from 'react';
import { DataTable, Badge, IconButton } from '../src/index.js';

export default { title: 'Datos / DataTable' };

const FILAS = [
  { id: '00123', nombre: 'Ana Torres', estado: 'ok', edad: 54 },
  { id: '00124', nombre: 'Luis Ríos', estado: 'warn', edad: 61 },
  { id: '00125', nombre: 'Marta Vela', estado: 'crit', edad: 47 },
];

/* La columna del identificador es el enlace que abre el registro, más un
   botón de acción explícito al final de la fila — nunca la fila entera
   clicable (ver CLAUDE.md § 3.4). */
const COLUMNAS = [
  { key: 'id', label: 'Caso', render: (f) => <a href={`#/${f.id}`}>{f.id}</a> },
  { key: 'nombre', label: 'Nombre' },
  { key: 'edad', label: 'Edad', align: 'right' },
  {
    key: 'estado',
    label: 'Estado',
    render: (f) => <Badge label={f.estado === 'ok' ? 'Normal' : f.estado === 'warn' ? 'Revisar' : 'Crítico'} tone={f.estado} />,
  },
  {
    key: 'acciones',
    label: '',
    align: 'right',
    render: (f) => <IconButton icon="sh-eye" aria-label={`Ver caso ${f.id}`} />,
  },
];

export const Basico = () => <DataTable columns={COLUMNAS} rows={FILAS} />;

export const ConGrupos = () => (
  <DataTable
    columns={[
      { key: 'nombre', label: 'Nombre' },
      { key: 'ene', label: 'Ene', group: 'SIS', align: 'right' },
      { key: 'feb', label: 'Feb', group: 'SIS', align: 'right' },
      { key: 'mar', label: 'Ene', group: 'Privado', align: 'right' },
    ]}
    rows={[{ nombre: 'Total', ene: 12, feb: 15, mar: 3 }]}
  />
);

export const Ordenable = () => {
  const [sort, setSort] = useState({ key: 'nombre', dir: 'asc' });
  return (
    <DataTable
      columns={[
        { key: 'nombre', label: 'Nombre', sortable: true },
        { key: 'edad', label: 'Edad', sortable: true, align: 'right' },
      ]}
      rows={FILAS}
      sort={sort}
      onSortChange={setSort}
    />
  );
};

export const Cargando = () => <DataTable columns={COLUMNAS} rows={[]} loading loadingRows={3} />;

export const Vacio = () => (
  <DataTable columns={COLUMNAS} rows={[]} empty="Sin registros para el periodo seleccionado." />
);
