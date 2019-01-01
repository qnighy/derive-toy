import React from 'react';
import ReactDOM from 'react-dom';
import { DeriveTree } from './DeriveTree';
import { ActionDispatcher } from './DeriveTreeContainer';

it('renders without crashing', () => {
    const actions = new ActionDispatcher(() => {});
    const div = document.createElement('div');
    ReactDOM.render(<DeriveTree actions={actions} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
