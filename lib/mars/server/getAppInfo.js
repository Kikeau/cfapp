/*
 *  Copyright (c) 2017 NiXPS, All rights reserved.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
'use strict';
const getAppListInfo = require('./getAppListInfo.js');
const getAppDetails = require('./getAppDetails.js');
const {NoSuchVersionAvailable} = require('../Errors.js');
const ConsoleOutputStream = require('../../util/ConsoleOutputStream.js');

async function getAppInfo (systemInfo, appName, forceVersion, forceLastVersion, outputStream = new ConsoleOutputStream()) {
    const marsURL = systemInfo.serverUrl;
    const customerCode = systemInfo.customerCode;
    const serial = systemInfo.serial;
    const site = systemInfo.site;

    outputStream.writeLine('get app info on MARS');
    const appListInfo = await getAppListInfo(marsURL, appName, customerCode, serial, site, 'en');

    // By default prefer the last release over the last version
    let appVersion = appListInfo.last_release || appListInfo.last_version;
    if (forceVersion) {
        // Force version wins over last version
        if (appListInfo.versions.includes(forceVersion)) {
            appVersion = forceVersion;
        } else {
            throw new NoSuchVersionAvailable(appName, forceVersion);
        }
    } else if (forceLastVersion) {
        // Force last version in case it is passed
        appVersion = appListInfo.last_version;
    }

    const appDetails = await getAppDetails(marsURL, appName, appVersion, customerCode, serial, site, 'en');
    const downloadUrl = appDetails.download_url;

    return {
        downloadUrl: downloadUrl,
        appName: appName,
        appVersion: appVersion,
        owner: appDetails.you_are_owner,
        changeset: appDetails.changeset,
        license: appDetails.license
    }
}

module.exports = getAppInfo;