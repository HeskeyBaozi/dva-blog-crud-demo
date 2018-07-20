import React, {PropTypes} from 'react';
import styles from './PostsListBody.css';
import {Table} from 'antd';
import SearchKeyword from '../../components/SearchKeyword/SearchKeyword';
import PostItem from './PostItem/PostItem';
import QueueAnimate from 'rc-queue-anim';


const {Column} = Table;

function PostsListBody({
    postsList,
    pagination,
    onSearch,
    loading,
    currentAccountUserId,
    isSuper,
    onDelete,
    onChangeVisibility,
    onTableChange,
}) {
    return (
        <Table dataSource={postsList}
               showHeader={false}
               rowKey="post_id"
               loading={loading}
               pagination={pagination}
               title={() => <SearchKeyword onSearch={onSearch}/>}
               onChange={onTableChange}
        >
            <Column title="posts" key="posts"
                    render={(text, record) => {
                        return <PostItem record={record}
                                         isSelf={currentAccountUserId === record.author.user_id}
                                         isSuper={isSuper}
                                         onDelete={onDelete}
                                         onChangeVisibility={onChangeVisibility}/>;
                    }}/>
        </Table>
    );
}

PostsListBody.propTypes = {
    postsList: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    onSearch: PropTypes.func.isRequired,
    currentAccountUserId: PropTypes.string.isRequired,
    isSuper: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChangeVisibility: PropTypes.func.isRequired,
    onTableChange: PropTypes.func.isRequired
};


export default PostsListBody;
