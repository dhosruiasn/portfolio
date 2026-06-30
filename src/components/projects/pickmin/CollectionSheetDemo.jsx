export default function CollectionSheetDemo({ state, label }) {
  const message = {
    default: 'Choose a folder',
    selecting: 'Tokyo Finds selected',
    saving: 'Saving collection...',
    success: 'Saved to Tokyo Finds',
    error: 'Could not save. Try again.',
  }[state];

  return (
    <article className={`pickmin-sheet-demo pickmin-sheet-demo--${state}`}>
      <div className="pickmin-sheet-demo__handle" aria-hidden="true" />
      <header>
        <span>{label}</span>
        <strong>CollectionSheet</strong>
      </header>
      <div className="pickmin-sheet-demo__folders">
        <span className={state === 'selecting' || state === 'saving' || state === 'success' ? 'is-selected' : ''}>Tokyo Finds</span>
        <span>Rare Places</span>
      </div>
      <footer>
        <span>{message}</span>
        <button type="button" disabled={state === 'saving'}>{state === 'error' ? 'Retry' : 'Save'}</button>
      </footer>
    </article>
  );
}
