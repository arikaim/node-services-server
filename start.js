'use strict';
/**
 * Arikaim Services
 * @link        http://www.arikaim.com
 * @copyright   Copyright (c) Konstantin Atanasov <info@arikaim.com>
 * @license     http://www.arikaim.com/license 
*/

import  { default as ArikaimServicesServer }  from "@arikaim/arikaim-services/server.js"

const server = new ArikaimServicesServer();

// boot
await server.boot();
// run
server.run();
