import * as React from "react";
import './PropositionInput.css';

interface Props {
    readonly text: string;
    readonly message: string;
    readonly updateText: (text: string) => void;
    readonly startParse: () => void;
}

export class PropositionInput extends React.Component<Props, {}> {
    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { updateText } = this.props;
        updateText(e.target.value);
    }
    handleStart = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const { startParse } = this.props;
        startParse();
    }
    render() {
        const { text, message } = this.props;
        return <div className="PropositionInput-top">
            <textarea className="PropositionInput-input" defaultValue={text} onChange={this.handleChange} />
            <button onClick={this.handleStart}>Start</button>
            <p className="PropositionInput-message">{message}</p>
        </div>;
    }
}