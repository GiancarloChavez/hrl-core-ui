import { ChangePasswordScreen, LOGIN_BACKDROPS, LoginScreen } from '../src/index.js';

export default { title: 'Composición / Pantallas de acceso' };

const enviar = async ({ username }) => {
  await new Promise((r) => setTimeout(r, 600));
  if (username !== 'demo') throw new Error('Usuario o contraseña incorrectos.');
};

/* Sin `backdrop`, la fachada sigue la hora del equipo. */
export const PorHora = () => <LoginScreen systemName="Sistema de ejemplo" onSubmit={enviar} />;

export const SinFondo = () => <LoginScreen systemName="Sistema de ejemplo" backdrop="none" onSubmit={enviar} />;

/* Los seis tramos: amanecer, mañana, tarde, atardecer, noche iluminada y noche. */
export const Fachadas = () => (
  <div style={{ display: 'grid', gap: 0 }}>
    {LOGIN_BACKDROPS.map((b) => (
      <LoginScreen key={b} backdrop={b} systemName={`Fondo: ${b}`} onSubmit={enviar} />
    ))}
  </div>
);

export const CambioDeContrasena = () => (
  <ChangePasswordScreen systemName="Sistema de ejemplo" onSubmit={async () => {}} />
);
