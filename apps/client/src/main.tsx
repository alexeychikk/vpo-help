import moment from 'moment';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';

moment.locale('uk-UA');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
