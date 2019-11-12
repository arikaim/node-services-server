'use strict';
/**
 * Arikaim Services
 *
 * @link        http://www.arikaim.com
 * @copyright   Copyright (c) 2017-2018 Konstantin Atanasov <info@arikaim.com>
 * @license     http://www.arikaim.com/license.html
 * 
*/

const fs = require('fs');
const path = require('path');

const System = include('core/system/system.js');
const Utils = include('core/system/utils.js');

class Services {

    constructor() {

    }

    install() {
        System.message('Install Services'); 
        var services_path = System.getServicePath();
        var files = fs.readdirSync(services_path);
        files.forEach((file, index) => {
            var stats = fs.lstatSync(services_path + file);
            if (stats.isDirectory() == true) {
                this.installService(file);
            }
        });
    }

    installService(service_name) {
        console.log('install service ' + service_name);
        var service_properties = this.loadServiceConfigFile(service_name);
       
        var service = arikaim.db.create('Service');
        service.findOrCreate({
            where: { name: service_name },
            name: service_name,
            title: service_properties.title,
            descrption: service_properties.description,
            uuid: Utils.createUUID()
        }).spread(result => {
            var data = result.get({ plain:true });
            console.log('Service: ' + service_name + ' registered. service ID: ' + data.id);
            this.registerServiceActions(service_properties,data.id);
        }).catch(error => {
            console.log('Error register service:  ' + service_name + " details: " + error);
        });
       
        this.installServiceModels(service_name);
    }

    registerServiceActions(service_preperties,service_id) {
        var actions = service_preperties.actions;
        if (isArray(actions) == false) {
            console.log('Error: Service action properties not valid!');
        }
        var service_actions = arikaim.db.create('Actions');
        for(var item of actions) {
            console.log(item.class);
            service_actions.findOrCreate({
                where: { name: item.name, service_id: service_id },
                name: item.name,
                title: item.title,
                description: item.description,
                uuid: Utils.createUUID(),
                service_id: service_id,
                handler_class: item.class,
                handler_method: item.method
            }).spread(result =>{
                console.log('Action ' + item.name + ' registered.');
            }).catch(error => {
                console.log('Error register action:  ' + item.name + " for service: " + service_preperties.name + " details: " + error);
            });
        }
    }

    installServiceModels(service_name) {
        var models_include_path = System.getModelsIncludePath(service_name);
        var models_path = System.getModelsPath(service_name);
        //console.log(models_include_path);
        var files = fs.readdirSync(models_path);
        files.forEach((file, index) => {
            var model = arikaim.db.createModel(models_include_path + file);
        });
        arikaim.db.sequelize.sync().then(resut => {
            System.message('Service db tables created.');
            return true;
        }).catch(error => {
            System.message('Error create service database tables!');
            arikaim.exit();
        });
    }

    loadServiceConfigFile(service_name) {
        var config_file = Services.getConfigFile(service_name);
        var service_config = fs.readFileSync(config_file);
        return JSON.parse(service_config);
    }

    static getConfigFile(serice_name) {
        return System.getServicePath(serice_name) + serice_name + '.json';
    }

}

module.exports = Services;