'use strict';

const  axios = require("axios");
const semver = require("semver");
const urlJoin = require("url-join")

module.exports = {
    getNpmInfo
};

function getNpmInfo(name, registry) {
    if(!name) {
        return null
    }
    
    const registryUrl = registry || urlJoin(getRegistry(), name)
    
    return axios.get(registryUrl).then(res => {
        console.log(res)
    })
}

function getRegistry (isOrigin) {
    return isOrigin ? 'https://registry.npmjs.org': 'https://registry.npm.taobao.org'
}
