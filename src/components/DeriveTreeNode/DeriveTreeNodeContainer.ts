import { ReduxAction, ReduxState } from "../../store";
import { connect } from "react-redux";
import { Dispatch } from "react";
import { DeriveTreeNode } from "./DeriveTreeNode";

export class ActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {}
}

export default connect(
    (state: ReduxState) => ({ cproof: state.cproof }),
    (dispatch: Dispatch<ReduxAction>) => ({actions: new ActionDispatcher(dispatch)})
)(DeriveTreeNode)