/* Nombres de icono aprobados.

   Vive fuera de icons.jsx porque un archivo de componentes solo puede exportar
   componentes si se quiere que funcione el refresco en caliente.

   Añadir un icono es un acto deliberado: se dibuja el <symbol> en icons.jsx y
   se declara su nombre aquí. Pedir uno que no esté en la lista avisa en
   desarrollo en lugar de pintar un hueco en silencio. */
export const ICONS = Object.freeze([
  'sh-diamond',
  'sh-check',
  'sh-lines',
  'sh-pie',
  'sh-table',
  'sh-swap',
  'sh-bell',
  'sh-close',
  'sh-chevron',
  'sh-crit',
  'sh-eye',
  'sh-chevron-abajo',
  'sh-info',
  'sh-upload',
  'sh-trash',
  'sh-doc',
  'sh-ok',
  'sh-warn',
  'sh-export',
  'sh-expand',
  'sh-chart',
  'sh-none',
  'sh-people',
  'sh-calendar',
  'sh-flask',
  'sh-pulse',
  'sh-clock',
  'sh-home',
  'sh-profile',
  'sh-folder',
  'sh-bill',
  'sh-shield',
  'sh-gear',
  'sh-plegar',

  /* Pictogramas de área y de flujo documental. */
  'sh-pastilla',
  'sh-gota',
  'sh-bisturi',
  'sh-lavadora',
  'sh-cubiertos',
  'sh-radiografia',
  'sh-llave',
  'sh-bebe',
  'sh-enviar',
  'sh-remitir',
  'sh-sello',
  'sh-semaforo',
  'sh-boletin',
  'sh-bandeja',
  'sh-lapiz',
  'sh-tijeras',
  'sh-caja'
]);
