/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: 'stories/**/*.stories.jsx',
  addons: {
    theme: {
      enabled: true,
      defaultState: 'light',
    },
    // Sin datos de negocio ni control de ancho aquí: el kit no dibuja
    // controles de responsive en la barra de Ladle porque este catálogo
    // muestra componentes, no maquetas de página completas.
    width: {
      enabled: false,
    },
  },
};
