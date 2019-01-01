import { ReduxAction, ReduxState } from "../../store";
import { connect } from "react-redux";
import { Dispatch } from "react";
import { DeriveTree } from "./DeriveTree";

export class ActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {}
}

export default connect(
    (state: ReduxState) => ({}),
    (dispatch: Dispatch<ReduxAction>) => ({actions: new ActionDispatcher(dispatch)})
)(DeriveTree)