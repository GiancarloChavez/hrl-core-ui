/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: 'stories/**/*.stories.jsx',
  // Quien llega al catálogo aterriza en la presentación, no en un botón suelto.
  defaultStory: 'fundamentos--introducción--portada',
  storyOrder: [
    'fundamentos*',
    'composición*',
    'primitivos*',
    'capas-flotantes*',
    'estados*',
    'datos*',
    'graficos*',
    'layout*',
    'iconos*',
  ],
  appendToHead:
    '<meta name="description" content="Componentes y tokens de diseño del Hospital Regional de Loreto.">',
  addons: {
    theme: {
      enabled: true,
      defaultState: 'light',
    },
    // El kit no dibuja controles de responsive en la barra de Ladle porque
    // este catálogo muestra componentes, no maquetas de página completas.
    width: {
      enabled: false,
    },
  },
};
