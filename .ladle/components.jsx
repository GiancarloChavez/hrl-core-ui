import { useEffect } from 'react';
import { ThemeState } from '@ladle/react';
import { applyTheme } from '../src/theme.js';
import { IconSprite } from '../src/icons.jsx';
import '../tokens.css';

/* El selector de tema de Ladle ya trae claro/oscuro/auto en su barra; solo
   falta traducirlo al atributo que tokens.css espera en <html>
   (data-tema-hrl), que es lo mismo que hace el interruptor real en
   cualquier app que consume el kit. */
function esOscuroDelSistema() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export const Provider = ({ globalState, children }) => {
  useEffect(() => {
    const quiereOscuro =
      globalState.theme === ThemeState.Dark ||
      (globalState.theme === ThemeState.Auto && esOscuroDelSistema());
    applyTheme(quiereOscuro ? 'oscuro' : 'claro');
  }, [globalState.theme]);

  return (
    <>
      {/* La mayoría de los iconos son <use href="#nombre">: sin el sprite
         montado en algún punto del árbol, se ven en blanco. AppShell lo trae
         consigo, pero ninguna otra historia lo tiene por su cuenta. */}
      <IconSprite />
      {children}
    </>
  );
};
