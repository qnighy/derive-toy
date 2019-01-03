import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinusSquare, faPlusSquare, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { DeriveTreeNode, updateUiStateFromProof } from './DeriveTreeNode';
import * as Linear from '../../models/Linear';

library.add(faMinusSquare, faPlusSquare, faTimesCircle)

it('renders without crashing', () => {
    const cproof = Linear.example();
    const ui = updateUiStateFromProof(cproof);

    const div = document.createElement('div');
    ReactDOM.render(<DeriveTreeNode cproof={Linear.example()} ui={ui} path={null} expand={() => {}} />, div);
    ReactDOM.unmountComponentAtNode(div);
});
