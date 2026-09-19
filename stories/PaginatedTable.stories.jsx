import { PaginatedTable } from '../src/index.js';

export default { title: 'Datos / PaginatedTable' };

const FILAS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  nombre: `Registro ${i + 1}`,
  valor: Math.round(Math.random() * 100),
}));

const COLUMNAS = [
  { key: 'id', label: '#' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'valor', label: 'Valor', align: 'right' },
];

export const Basico = () => <PaginatedTable columns={COLUMNAS} rows={FILAS} legend={`${FILAS.length} registros en total`} />;

export const ConSelectorDeTamano = () => <PaginatedTable columns={COLUMNAS} rows={FILAS} resizable />;
