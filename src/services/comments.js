'use strict';

import request from '../utils/request';
import {stringify} from 'qs';
import {storageTokenKey} from '../utils/constant';

export function createComment({post_id, commentInput}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/comments?${stringify({post_id})}`, {
        method: 'post',
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }),
        body: stringify({
            post_id,
            content: commentInput
        })
    });
}

export function deleteComment({comment_id}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/comments/${comment_id}`, {
        method: 'delete',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}

export function patchComment({comment_id, editorContent}) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/comments/${comment_id}`, {
        method: 'PATCH',
        headers: new Headers({
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }),
        body: stringify({
            updatedContent: editorContent
        })
    });
}