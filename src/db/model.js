'use strict';
/**
 * Arikaim Services
 *
 * @link        http://www.arikaim.com
 * @copyright   Copyright (c) Konstantin Atanasov <info@arikaim.com>
 * @license     http://www.arikaim.com/license.html
 * 
*/

import Path from './../system/path.js';

export default class Model {

    static async create(modelName, serviceName) {
        var modelFile;
        if (isEmpty(serviceName) == true) {
            modelFile = './models/' + modelName + '.js';
        } else {
            modelFile = Path.getDbModelsPath(serviceName,modelName);
        }
        var { default: modelClass } = await import(modelFile);

        
        return modelClass;
    }
}
