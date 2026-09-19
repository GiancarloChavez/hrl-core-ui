import { TruncatedText } from '../src/index.js';

export default { title: 'Primitivos / TruncatedText' };

export const Basico = () => (
  <div style={{ width: 220, border: '1px dashed var(--border)' }}>
    <TruncatedText
      text="Un texto bastante más largo de lo que cabe en la celda de la tabla"
      width={200}
      label="Descripción"
    />
  </div>
);

export const Vacio = () => (
  <div style={{ width: 220 }}>
    <TruncatedText text="" />
  </div>
);
