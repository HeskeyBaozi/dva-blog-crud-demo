import React, {PropTypes} from 'react';
import {Input} from 'antd';
import debounce from 'lodash.debounce';


class SearchKeyword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    handleSearch = keyword => {
        this.props.onSearch(keyword);
        this.setState({
            value: ''
        });
    };

    handleChange = e => {

        this.setState({value: e.target.value});
        console.log(e.target.value);
        if (this.state.value)
            this.debouncedSearch(e.target.value);
    };

    debouncedSearch = debounce(this.props.onSearch, 200);

    render() {
        return <Input.Search
            placeholder="Search Post By Title."
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            value={this.state.value}/>;
    }
}

SearchKeyword.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default SearchKeyword;