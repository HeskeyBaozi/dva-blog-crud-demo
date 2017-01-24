'use strict';
import request from '../utils/request';
import {storageTokenKey} from '../utils/constant';

export function createUser({username, password, email}) {
    return request('/api/user', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json; charset=utf-8"
        }),
        body: JSON.stringify({
            username, password, email
        })
    });
}

export function fetchUserDetail({user_id}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/user/${user_id}`, {
        method: 'GET',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}