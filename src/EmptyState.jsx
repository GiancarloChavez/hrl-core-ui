import { Icon } from './icons.jsx';

export function EmptyState({ icon = 'sh-lines', tone = 'var(--subtle-foreground)', title, body, children }) {
  return (
    <div className="hrl-empty">
      <span className="hrl-empty__icon" style={{ '--tone': tone }}>
        <Icon name={icon} size={30} />
      </span>
      <strong className="hrl-empty__title">{title}</strong>
      {body && <p className="hrl-empty__body">{body}</p>}
      {children}
    </div>
  );
}
