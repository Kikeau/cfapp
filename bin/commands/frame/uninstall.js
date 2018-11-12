/*
 *  Copyright (c) 2018 NiXPS, All rights reserved.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */


 ['log','warn','error'].forEach(a=>{let b=console[a];console[a]=(...c)=>{try{throw new Error}catch(d){b.apply(console,[d.stack.split('\n')[2].trim().substring(3).replace(__dirname,'').replace(/\s\(./,' at ').replace(/\)/,''),'\n',...c])}}});

'use strict';

module.exports = {
    command: 'uninstall',
    desc: 'Uninstalls frame',
    builder: {},
    handler: function() {
        uninstall();
        return;
    }
};

function uninstall()
{
    var systeminfo=require("../../../lib/systeminfo.js");
    
    if (systeminfo["cloudflow"]["installed"]!=true) {
        console.error("Frame is not installed");
        return;
    }

    console.log("Uninstalling Frame");

    console.log()    
}