import { useState } from 'react';
import { Input } from '../src/index.js';

export default { title: 'Primitivos / Input' };

export const Texto = () => {
  const [valor, setValor] = useState('');
  return <Input label="Campo" value={valor} onChange={(e) => setValor(e.target.value)} />;
};

export const Select = () => {
  const [valor, setValor] = useState('a');
  return (
    <Input
      label="Lista"
      kind="select"
      value={valor}
      onChange={(e) => setValor(e.target.value)}
      options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]}
    />
  );
};

export const Numero = () => <Input label="Monto" kind="number" disabled />;

export const ConAyudaYRequerido = () => (
  <Input label="DNI" required info="Solo números, ocho dígitos" hint="Sin puntos ni guiones" />
);

export const ConError = () => (
  <Input label="Correo" value="no-es-un-correo" onChange={() => {}} error="El formato no es válido" />
);

export const Busqueda = () => <Input label="Buscar" labelHidden searchIcon placeholder="Buscar paciente…" />;
