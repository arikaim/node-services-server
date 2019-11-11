'use strict';
/**
 * Arikaim Services
 *
 * @link        http://www.arikaim.com
 * @copyright   Copyright (c) 2017-2018 Konstantin Atanasov <info@arikaim.com>
 * @license     http://www.arikaim.com/license.html
 * 
*/

const express = require('express');

const container = require('./core/system/container.js');
const System = container.resolve('System');
const Path = container.resolve('Path');
const config = container.resolve('Config')


module.exports = class Arikaim {

    constructor() {
        this.app = express();
        this.config = config;
      //  this.db = new Db();
       // this.routes = new Routes(this.app);

       // this.dev_mode = true;
        this.version = '1.0.0';
       // this.self = this;
        this.port = 8080;
    }
    
    setPort(port) {
        if (isEmpty(port) == false) {
            this.port = port;
            return true;
        }
        return false;
    }

    setDevMode(mode = true) {
        this.dev_mode = mode;
    }

    log(msg) {
        if (this.dev_mode == true) {
            console.log(msg);
        }
    }

    init() {
        System.log("Arikam Services version: " + this.version);
        return new Promise((resolve, reject) => {
            this.config.load('config.json').then(config => {
                System.log('Config loaded.');
                this.setPort(config.port);
               

            }).catch(error => {
                System.log('Error loading config: ' + error);
                reject(error);
            });
        });
    }

    run() {
        this.init().then(result => {
            this.start();
        }).catch(error => {
            System.log('Error start server');
            this.exit();
        });
    }

    start() {
        this.app.listen(this.port,() => {
            System.log('Server started on port: ' + this.port);
        });
    }

    isInstalled() {
        return true;
    }

    install() {
        const Services = include('core/system/services.js');
        var services = new Services();

        this.init().then(result => {
            System.log('Install');          
          
            var service = this.db.create('Service');
           

            this.db.sequelize.sync().then(resut => {
                System.log('Database tables created');
                services.install();
            }).catch(error => {
                System.log('Error create database tables');
                this.exit();
            });
        }).catch(error => {
            System.log('Error install Arikaim Services');
            this.exit();
        });
    }

    exit() {
        process.exit(0);
    }
}
