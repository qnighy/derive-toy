import { ReduxAction, ReduxState } from "../../store";
import { connect } from "react-redux";
import { Dispatch } from "react";
import { PropositionInput } from "./PropositionInput";

export default connect(
    (state: ReduxState) => ({ text: state.proposition_text, message: state.proposition_parse_message }),
    (dispatch: Dispatch<ReduxAction>) => ({
        updateText: (text: string): void => {
            dispatch({
                type: 'INPUT_PROPOSITION',
                text,
            })
        },
        startParse: (): void => {
            dispatch({
                type: 'START_PARSE',
            })
        },
    })
)(PropositionInput)
