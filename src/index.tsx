import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import App from './App/App';
import store from './store';
import * as serviceWorker from './serviceWorker';
import DeriveTree from './components/DeriveTreeNode/DeriveTreeNodeContainer';

ReactDOM.render(
    <Provider store={store}>
        <App />
        <DeriveTree />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
