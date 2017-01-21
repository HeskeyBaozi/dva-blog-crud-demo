'use strict';
import request from '../utils/request';
import {stringify} from 'qs';
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