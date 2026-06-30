export default function PostcardCardDemo({ state, label }) {
  const isLoading = state === 'loading';
  const isFailed = state === 'failed';

  return (
    <article className={`pickmin-postcard-demo pickmin-postcard-demo--${state}`}>
      <div className="pickmin-postcard-demo__media" aria-hidden="true">
        {isLoading && <span className="pickmin-postcard-demo__loader" />}
        {isFailed && <span className="pickmin-postcard-demo__failed">!</span>}
        {!isLoading && !isFailed && (
          <>
            <span className="pickmin-postcard-demo__sun" />
            <span className="pickmin-postcard-demo__tower" />
          </>
        )}
      </div>
      <div className="pickmin-postcard-demo__body">
        <span className="pickmin-postcard-demo__label">{label}</span>
        <strong>Tokyo Tower Postcard</strong>
        <span>Minato City · Japan</span>
      </div>
    </article>
  );
}
