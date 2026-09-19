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
          title="Caso #00123"
          subtitle="Registrado el 12 de marzo de 2026"
          fields={
            <>
              <Field k="DNI" v="12345678" mono />
              <Field k="Sexo" v="Femenino" />
              <Field k="Edad" v="54 años" />
            </>
          }
          block={{ title: 'Diagnóstico', text: 'Descripción breve del caso.' }}
          note="Los datos mostrados son de ejemplo."
          aside={
            <Timeline
              title="Historial"
              items={[
                { key: '1', date: '2026-01-10', title: 'Primera consulta' },
                { key: '2', date: '2026-02-02', title: 'Resultado de biopsia' },
              ]}
            />
          }
          onClose={() => setAbierto(false)}
        />
      )}
    </>
  );
};
