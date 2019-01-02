import React from 'react';
import ReactDOM from 'react-dom';
import { DeriveTreeNode } from './DeriveTreeNode';
import * as Linear from '../../models/Linear';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DeriveTreeNode cproof={Linear.example()} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
