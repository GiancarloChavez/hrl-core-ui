import { useEffect } from 'react';
import { ThemeState } from '@ladle/react';
import { applyTheme } from '../src/theme.js';
import { IconSprite } from '../src/icons.jsx';
import '../tokens.css';
import './showroom.css';

/* El selector de tema de Ladle ya trae claro/oscuro/auto en su barra; solo
   falta traducirlo al atributo que tokens.css espera en <html>
   (data-tema-hrl), que es lo mismo que hace el interruptor real en
   cualquier app que consume el kit. */
function esOscuroDelSistema() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export const Provider = ({ globalState, storyMeta, children }) => {
  useEffect(() => {
    const quiereOscuro =
      globalState.theme === ThemeState.Dark ||
      (globalState.theme === ThemeState.Auto && esOscuroDelSistema());
    applyTheme(quiereOscuro ? 'oscuro' : 'claro');
  }, [globalState.theme]);

  useEffect(() => {
    document.title = 'Sistema de diseño HRL';
  }, []);

  /* Toda la base del kit —tipografía, box-sizing, tamaños, sombras, colores
     de texto— cuelga de `.hrl-nuevo`, el contenedor que dibuja AppShell. Una
     historia suelta no lo tiene y se vería con la tipografía del navegador y
     sin superficies; por eso cada historia se monta dentro de uno, como en
     una aplicación real. Las que ya traen su propio shell piden pantalla
     completa con `meta: { fullscreen: true }`. */
  const pantallaCompleta = storyMeta?.fullscreen === true;

  return (
    <>
      {/* La mayoría de los iconos son <use href="#nombre">: sin el sprite
         montado en algún punto del árbol, se ven en blanco. */}
      <IconSprite />
      <div className={pantallaCompleta ? 'hrl-nuevo' : 'hrl-nuevo showroom'}>{children}</div>
    </>
  );
};
