import React, {PropTypes} from 'react';
import {Table, Card} from 'antd';
import Publish from '../CommentsPublish/CommentsPublish';
import moment from 'moment';
const {Column} = Table;

function CommentsList({
    descendants,
    loading
}) {

    const columnProps = {
        title: 'Comments',
        key: 'descendants',
        render: (text, record) => {
            const {
                content,
                author,
                created_at,
                visible
            } = record;

            return (
                <Card>
                    <p>{visible ? content : 'can not see'}</p>
                    <p>By <em>{author.username}</em>, {moment(created_at).fromNow()}</p>
                </Card>
            );
        }
    };

    const tableProps = {
        dataSource: descendants,
        showHeader: false,
        rowKey: 'comment_id',
        loading,
        title: currentPageData => {
            return <h2>Comments</h2>;
        },
        footer: currentPageData => {
            console.log(currentPageData);
            return <Publish loading={loading}/>;
        }
    };
    return (
        <Table {...tableProps}>
            <Column {...columnProps}/>
        </Table>
    );
}

CommentsList.propTypes = {
    descendants: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
};

export default CommentsList;