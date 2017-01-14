'use strict';

import request from '../utils/request';
import {stringify} from 'qs';

export function fetchPosts({token, pageInfo}) {
    return request(`/api/posts?${stringify(pageInfo)}`, {
        method: 'get',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}