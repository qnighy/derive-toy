import React from 'react';
import ReactDOM from 'react-dom';
import { DeriveTree } from './DeriveTree';
import { ActionDispatcher } from './DeriveTreeContainer';
import { newTensor, newAtomic } from '../../models/LinearProposition';

it('renders without crashing', () => {
    const actions = new ActionDispatcher(() => {});
    const div = document.createElement('div');
    ReactDOM.render(<DeriveTree prop1={newTensor([newAtomic("A"), newAtomic("B")])} actions={actions} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
