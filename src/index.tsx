import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import store from './store';
import * as serviceWorker from './serviceWorker';
import DeriveTree from './components/DeriveTree/DeriveTreeContainer';
import PropositionInputContainer from './components/PropositionInput/PropositionInputContainer';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinusSquare, faPlusSquare, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faMinusSquare, faPlusSquare, faTimesCircle)

ReactDOM.render(
    <Provider store={store}>
        <div id="main">
            <h1>Derive Toy</h1>
            <PropositionInputContainer />
        </div>
        <div id="playground">
            <DeriveTree />
        </div>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
