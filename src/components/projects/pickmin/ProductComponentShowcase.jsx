import PostcardCardDemo from './PostcardCardDemo.jsx';
import FolderCardDemo from './FolderCardDemo.jsx';
import CollectionSheetDemo from './CollectionSheetDemo.jsx';

const DEMOS = {
  postcardCard: PostcardCardDemo,
  folderCard: FolderCardDemo,
  collectionSheet: CollectionSheetDemo,
};

export default function ProductComponentShowcase({ content }) {
  return (
    <div className="pickmin-product-components">
      <p className="pickmin-section-intro">{content.intro}</p>
      {['postcardCard', 'folderCard', 'collectionSheet'].map((key) => {
        const item = content[key];
        const Demo = DEMOS[key];

        return (
          <article className="pickmin-component-family" key={key}>
            <div className="pickmin-component-family__copy">
              <span>{item.title}</span>
              <h3>{item.purpose}</h3>
              <p>{item.reason}</p>
            </div>
            <div className={`pickmin-component-family__states pickmin-component-family__states--${key}`}>
              {item.states.map((state) => (
                <Demo key={state.id} state={state.id} label={item.stateCopy[state.id]} />
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
