'use strict';

import request from '../utils/request';
import {stringify} from 'qs';
import {storageTokenKey} from '../utils/constant';

export function fetchPosts({pageInfo}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/posts?${stringify(pageInfo)}`, {
        method: 'get',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}