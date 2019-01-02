import { ReduxAction, ReduxState } from "../../store";
import { connect } from "react-redux";
import { Dispatch } from "react";
import { DeriveTree } from "./DeriveTree";

export default connect(
    (state: ReduxState) => ({ cproof: state.cproof }),
    (dispatch: Dispatch<ReduxAction>) => ({})
)(DeriveTree)
