import { ReduxAction, ReduxState } from "../../store";
import { connect } from "react-redux";
import { Dispatch } from "react";
import { DeriveTree } from "./DeriveTree";
import { PropositionPath } from "../Sequent/Sequent";

export default connect(
    (state: ReduxState) => ({ cproof: state.cproof, ui: state.ui }),
    (dispatch: Dispatch<ReduxAction>) => ({
        expand: (path: ReadonlyArray<number>, new_expanded: boolean): void => {
            dispatch({
                type: 'EXPAND_TREE',
                path,
                new_expanded,
            })
        },
        close_tree: (path: ReadonlyArray<number>): void => {
            dispatch({
                type: 'CLOSE_TREE',
                path,
            })
        },
        hover: (path: PropositionPath | null): void => {
            dispatch({
                type: 'HOVER',
                path,
            })
        },
        act_on_proposition: (path: PropositionPath, paired: boolean, option: number | undefined): void => {
            dispatch({
                type: 'PROPOSITION',
                path,
                paired,
                option,
            })
        },
    })
)(DeriveTree)
