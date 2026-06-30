export default function FolderCardDemo({ state, label }) {
  const count = state === 'empty' ? '0' : state === 'new-items' ? '+3' : '24';

  return (
    <article className={`pickmin-folder-demo pickmin-folder-demo--${state}`}>
      <div className="pickmin-folder-demo__tab" aria-hidden="true" />
      <div className="pickmin-folder-demo__body">
        <span>{label}</span>
        <strong>{state === 'empty' ? 'Weekend Walks' : 'Tokyo Finds'}</strong>
        <em>{count}</em>
      </div>
    </article>
  );
}
