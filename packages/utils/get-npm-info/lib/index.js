'use strict';

const  axios = require("axios");
const semver = require("semver");
const urlJoin = require("url-join")

module.exports = {
    getNpmInfo,
    getPublishVersions
};

function getNpmInfo(name, registry) {
    if(!name) {
        return null
    }
    const registryUrl = urlJoin(getRegistry(registry || 'taobao'), name)
    return axios.get(registryUrl).then(res => {
        if (res.status == 200) {
            return res.data
        }
        return null
    }).catch(error => Promise.reject(error))
}

async function getPublishVersions(name, registry) {
    const data = await getNpmInfo(name, registry)
    if (data) {
        return Object.keys(data.versions)
    } else {
        return []
    }
}

function getRegistry (isOrigin) {
    return isOrigin ? 'https://registry.npmjs.org': 'https://registry.npm.taobao.org'
}
