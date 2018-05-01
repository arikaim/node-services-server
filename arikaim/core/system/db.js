'use strict';

const Sequelize = require('sequelize');

class Db {

    constructor() {
        this.db = null;
    }

    connect(settings) {
        return new Promise((resolve, reject) => {
            this.db = new Sequelize(settings);
            this.db.authenticate()
            .then(() => {
                console.log('Db Connection has been established successfully.');
                resolve();
            })
            .catch(error => {
                console.log('Unable to connect to the database:' + error);
            });
        });
    }
}

module.exports = Db;