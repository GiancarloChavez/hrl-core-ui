/* Modo oscuro.

   El atributo va en <html> y no en el contenedor de la aplicación porque los
   diálogos, avisos y tooltips se montan en document.body: si el interruptor
   viviera dentro de .hrl-nuevo, todo lo portalado se quedaría en claro.

   La clave de almacenamiento es un parámetro y no una constante del kit: en
   Oncología vale `hrl_theme` porque la interfaz nueva convive con la heredada
   y comparten preferencia; un sistema que no convive con nadie usa la suya y
   no hereda el tema de otro. */
const CLAVE_POR_DEFECTO = 'hrl_theme';

export function readTheme(key = CLAVE_POR_DEFECTO) {
  try {
    return localStorage.getItem(key) === 'dark' ? 'oscuro' : 'claro';
  } catch {
    /* Modo privado o almacenamiento bloqueado: se asume el tema claro. */
    return 'claro';
  }
}

export function applyTheme(tema, key = CLAVE_POR_DEFECTO) {
  document.documentElement.dataset.temaHrl = tema;
  try {
    localStorage.setItem(key, tema === 'oscuro' ? 'dark' : 'light');
  } catch {
    /* Si no se puede recordar, al menos se aplica en esta sesión. */
  }
}
