import { Skeleton, SkeletonRows } from '../src/index.js';

export default { title: 'Estados / Skeleton' };

export const Basico = () => (
  <div style={{ display: 'grid', gap: 8, width: 260 }}>
    <Skeleton width="65%" />
    <Skeleton width="90%" />
    <Skeleton width="40%" />
  </div>
);

export const Filas = () => (
  <table>
    <tbody>
      <SkeletonRows rows={4} columns={3} />
    </tbody>
  </table>
);
