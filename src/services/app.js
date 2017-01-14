'use strict';

import request from '../utils/request';
import {stringify} from 'qs';

export function auth(payload) {
    return request('/api/token', {
        method: 'post',
        headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }),
        body: stringify({
            ...payload,
            grant_type: 'password'
        })
    });
}

export function verifyToken({token}) {
    return request('/api/token', {
        method: 'get',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}