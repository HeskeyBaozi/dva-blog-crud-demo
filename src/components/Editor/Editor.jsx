import React, {PropTypes} from 'react';
import {Popover} from 'antd';
import styles from './Editor.less';
import EditorBody from './EditorBody';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleVisibleChange = visible => {
        this.setState({visible});
    };

    render() {
        const {children} = this.props;

        function commit({editorContent}) {

        }


        return (
            <Popover
                content={<EditorBody commit={commit} onClose={this.hide} initialValue={'test'}/>}
                title={<h3>Editor</h3>}
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
            >
                {children}
            </Popover>
        );
    }
}

Editor.propTypes = {
    children: PropTypes.element.isRequired
};


export default Editor;