'use strict';
/**
 * Arikaim Services
 * @link        http://www.arikaim.com
 * @copyright   Copyright (c) Konstantin Atanasov <info@arikaim.com>
 * @license     http://www.arikaim.com/license
*/

import { DataTypes, Model } from 'sequelize';
import findById from './../query/find.js';

export default class Users extends Model {

    static init() {
        super.init({
            id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
            },
            uuid: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            status: {
                type: DataTypes.INTEGER
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },{ 
            sequelize,
            modelName: 'Users',
            timestamps: false,
            tableName: 'users',
            scopes: {
                active: {
                    where: { status: 1 }
                }
            }
        });
        // add custom methods
        this.findById = findById;
    }
}

Users.init();
