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

export function fetchContent({post_id}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/posts/${post_id}/content`, {
        method: 'get',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}

export function fetchComments({post_id}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/comments?${stringify({post_id})}`, {
        method: 'get',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}

export function createPost({title, content}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request('/api/posts', {
        method: 'POST',
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8"
        }),
        body: JSON.stringify({
            title, content
        })
    });
}

export function patchPost({title, content, post_id}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/posts/${post_id}`, {
        method: 'PATCH',
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8"
        }),
        body: JSON.stringify({
            title, content
        })
    });
}

export function deletePost({post_id}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/posts/${post_id}`, {
        method: 'DELETE',
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
        })
    });
}

export function fetchPostInfo({post_id}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/posts/${post_id}`, {
        method: 'GET',
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
        })
    });
}

