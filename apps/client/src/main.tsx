import moment from 'moment';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';

moment.locale('uk-UA');

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')!,
);
