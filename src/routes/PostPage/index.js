import React from 'react';
import { connect } from 'dva';
import styles from './index.css';

function PostPage(props) {
  return (
    <div className={styles.normal}>
      Route Component: 'PostPage'
    </div>
  );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(PostPage);
