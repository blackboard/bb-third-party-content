import React from 'react';
import ReactDOM from 'react-dom';
import 'bb-public-library/styles/index.scss';
import App from './components/app';
// NOTE: Order matters for these css files
// ...the latter will overwrite the former
import './styles/tailwind/styles.css';
import './styles/index.scss';

ReactDOM.render(
    <App title="Hello, content provider!" />,
    document.getElementById('app'),
);
