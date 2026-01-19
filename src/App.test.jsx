
import { createRoot } from 'react-dom/client';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { it } from 'vitest';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<MemoryRouter><App /></MemoryRouter>);
  root.unmount();
});
