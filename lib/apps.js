/*
 *  Copyright (c) 2017 NiXPS, All rights reserved.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

'use strict';

var _ = require('lodash');
var cloudflowAPI = require('cloudflow-api');
var fs = require('fs');
const async = require('async');

var uploadWorkflows = require('../lib/apps/uploadWorkflows.js');
var uploadFiles = require('../lib/apps/uploadFiles.js');
var downloadFiles = require('../lib/apps/downloadFiles.js');
var downloadWorkflows = require('../lib/apps/downloadWorkflows.js');
var findCFApps = require('../lib/apps/findCFApps.js');

const defaultParameters = {
    host: 'http://localhost:9090',
    login: 'admin',
    password: 'admin',
    overwrite: false,
    install: '',
    download: ''
};

function uploadApp(app, options) {
    // Merge all the settings
    let parameters = {};
    _.assign(parameters, defaultParameters, {
        host: app.host,
        login: app.login,
        password: app.password
    }, options);

    console.log(`application: ${app.name}`);
    console.log(`Cloudflow: ${parameters.host}`);
    console.log(`user: ${parameters.login}`);

    // Get a Cloudflow API for the remote host and set the session
    var api = cloudflowAPI.getSyncAPI(parameters.host);
    var session = api.auth.create_session(parameters.login, parameters.password).session;
    api.m_session = session;

    // Install the Cloudflow application
    console.log(`installing app "${app.name}"`);

    // Adding workflows for this app
    uploadWorkflows(api, app, parameters.overwrite);

    // Adding the files
    return uploadFiles(api, app.getFilesToUpload(), parameters.overwrite);
}


function downloadApp(app, options) {
    // Merge all the settings
    let parameters = {};
    _.assign(parameters, defaultParameters, {
        host: app.host,
        login: app.login,
        password: app.password
    }, options);

    console.log(`application: ${app.name}`);
    console.log(`Cloudflow: ${parameters.host}`);
    console.log(`user: ${parameters.login}`);

    // Get a Cloudflow API for the remote host and set the session
    const api = cloudflowAPI.getSyncAPI(parameters.host);
    const session = api.auth.create_session(parameters.login, parameters.password).session;
    api.m_session = session;

    // Download the Cloudflow application
    console.log(`downloading app "${app.name}"`);

    const workflowDirectory = `${app.folder}/workflows`;
    const fileDirectory = `${app.folder}/workflows`;

    if (fs.existsSync(workflowDirectory) === false) {
        fs.mkdirSync(workflowDirectory);
    }

    if (fs.existsSync(fileDirectory) === false) {
        fs.mkdirSync(fileDirectory);
    }

    // Getting the workflows
    downloadWorkflows(api, app, parameters.overwrite);

    // Getting the files
    return downloadFiles(api, app.getFilesToDownload(api), parameters.overwrite);
}


module.exports = {
    upload: function(directory, options) {
        const cfApps = findCFApps(directory);
        return new Promise(function(resolve, reject) {
            async.forEachSeries(cfApps, function(app, callback) {
                uploadApp(app, options).then(callback).catch(callback);
            }, function(error) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    },
    download: function(directory, options) {
        const cfApps = findCFApps(directory);
        return new Promise(function(resolve, reject) {
            async.forEachSeries(cfApps, function(app, callback) {
                downloadApp(app, options).then(callback).catch(callback);
            }, function(error) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    },
    init: function(directory) {
        console.log(directory);
    }
};