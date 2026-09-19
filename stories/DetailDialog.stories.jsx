import { useState } from 'react';
import { Button, DetailDialog, Field, Timeline } from '../src/index.js';

export default { title: 'Capas flotantes / DetailDialog' };

export const Basico = () => {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <Button onClick={() => setAbierto(true)}>Ver detalle</Button>
      {abierto && (
        <DetailDialog
          tone="var(--accent)"
          toneText="var(--accent-text)"
          icon="sh-doc"
          badge={{ label: 'Activo', tone: 'ok' }}
          title="Registro #00123"
          subtitle="Registrado el 12 de marzo de 2026"
          fields={
            <>
              <Field k="Código" v="12345678" mono />
              <Field k="Categoría" v="A" />
              <Field k="Cantidad" v="54" />
            </>
          }
          block={{ title: 'Resumen', text: 'Descripción breve del registro.' }}
          note="Los datos mostrados son de ejemplo."
          aside={
            <Timeline
              title="Historial"
              items={[
                { key: '1', date: '2026-01-10', title: 'Alta del registro' },
                { key: '2', date: '2026-02-02', title: 'Validación completada' },
              ]}
            />
          }
          onClose={() => setAbierto(false)}
        />
      )}
    </>
  );
};
