import React from 'react';
import ReactDOM from 'react-dom';
import { DeriveTree } from './DeriveTree';
import { ActionDispatcher } from './DeriveTreeContainer';
import * as Linear from '../../models/Linear';

it('renders without crashing', () => {
    const actions = new ActionDispatcher(() => {});
    const div = document.createElement('div');
    ReactDOM.render(<DeriveTree prop1={Linear.newTensor([Linear.newAtomic("A"), Linear.newAtomic("B")])} actions={actions} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
