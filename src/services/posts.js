'use strict';

import request from '../utils/request';
import {stringify} from 'qs';

export function fetchPosts({token, pageInfo}) {
    console.log(stringify(pageInfo));
    return request(`/api/posts?${stringify(pageInfo)}`, {
        method: 'get',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}