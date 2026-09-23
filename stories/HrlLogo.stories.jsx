import { HrlLogo, Stack } from '../src/index.js';

export default { title: 'Primitivos / HrlLogo' };

export const Completo = () => <HrlLogo width={280} />;

export const Escudo = () => <HrlLogo variant="mark" width={96} />;

export const Tamanos = () => (
  <Stack direction="row" gap={5} align="center" wrap>
    <HrlLogo width={158} />
    <HrlLogo width={220} />
    <HrlLogo variant="mark" width={48} />
  </Stack>
);
