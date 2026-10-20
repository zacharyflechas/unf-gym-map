import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const root = createRoot(document.getElementById('root'));

// Dev-only layout editor: `npm run dev`, then open the page with ?edit=1.
// In a production build import.meta.env.DEV is the constant `false`, so this whole branch
// (and the dynamic import of the editor) is removed from the bundle.
const editMode = import.meta.env.DEV && new URLSearchParams(window.location.search).get('edit') === '1';

if (editMode) {
  import('./editor/LayoutEditor.jsx').then(({ default: LayoutEditor }) => {
    root.render(
      <StrictMode>
        <LayoutEditor />
      </StrictMode>,
    );
  });
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
