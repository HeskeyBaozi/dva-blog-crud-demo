import React, {PropTypes} from 'react';
import styles from './UserInfo.less';
import {Tooltip, Button} from 'antd';

const UserInfo = ({
    account,
    handleClickLogOut
}) => {
    const {ability, username} = account;
    const tooltipProps = {
        placement: 'bottom',
        title: ability === 'super' ? 'Super Admin' : 'Normal Admin',
    };

    return (
        <div className={styles.user}>
            <Tooltip {...tooltipProps}>
                <span>Hello, <em className={styles.username}>{username} !</em>
            </span>
            </Tooltip>
            <Button icon="logout" type="primary" onClick={handleClickLogOut}>Logout!</Button>
        </div>
    );
};

UserInfo.propTypes = {
    account: PropTypes.object.isRequired,
    handleClickLogOut: PropTypes.func.isRequired
};

export default UserInfo;