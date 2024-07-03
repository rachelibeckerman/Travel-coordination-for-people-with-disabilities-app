import React from 'react';


async function get(url) {
    const response = await fetch(url)
    const data = await response.json();
    return data;
}


async function post(url, body) {
    console.log(body)
    const requestOptions = {
        method: 'POST',
        body: body,
        headers: { "Content-Type": "application/json; charset=UTF-8" }

    }
    const response = await fetch(url, requestOptions)
    const data = await response.json();
    return data;
}

async function put(url, body) {
    console.log(body)
    const requestOptions = {
        method: 'PUT',
        body: body,
        headers: { "Content-Type": "application/json; charset=UTF-8" }

    }
    const response = await fetch(url, requestOptions)
    const data = await response.json();
    return data;
}

export {
    get, post, put
}



