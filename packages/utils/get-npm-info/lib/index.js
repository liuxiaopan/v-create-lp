'use strict';

const  axios = require("axios");
const semver = require("semver");
const urlJoin = require("url-join");
const colors = require('colors')

module.exports = {
    getNpmInfo,
    getPublishVersions,
    getUpdatableVersions
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
        return Object.keys(data.versions).sort((a, b) => semver.gt(b, a) ? 1: -1)
    } else {
        return []
    }
}

async function getUpdatableVersions(name, currentVersion, registry) {
    const data = await getPublishVersions(name, registry)
    if (!currentVersion) {
        throw new Error(colors.red('请输入当前版本')) 
    }
    if (data.length) {
        return data.filter(value => semver.gt(value, currentVersion))
    }else {
        return []
    }
}

function getRegistry (isOrigin) {
    return isOrigin ? 'https://registry.npmjs.org': 'https://registry.npm.taobao.org'
}
