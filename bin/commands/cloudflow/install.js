/*
 *  Copyright (c) 2017 NiXPS, All rights reserved.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */


'use strict';

var cloudflow=require("../../../lib/libcloudflow.js");

module.exports = {
    command: 'install <software_folder>',
    desc: 'Installs a Cloudflow build',
    builder: {},
    handler: cloudflow.install
};