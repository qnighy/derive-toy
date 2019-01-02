import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons'
import { DeriveTreeNode } from './DeriveTreeNode';
import * as Linear from '../../models/Linear';

library.add(faMinusSquare)

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DeriveTreeNode cproof={Linear.example()} ui={null} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
