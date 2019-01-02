import { ReduxAction, ReduxState } from "../../store";
import { connect } from "react-redux";
import { Dispatch } from "react";
import { DeriveTree } from "./DeriveTree";

export default connect(
    (state: ReduxState) => ({ cproof: state.cproof, ui: state.ui }),
    (dispatch: Dispatch<ReduxAction>) => ({
        expand: (path: number[], new_expanded: boolean): void => {
            dispatch({
                type: 'EXPAND_TREE',
                path,
                new_expanded,
            })
        }
    })
)(DeriveTree)
