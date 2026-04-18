const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config.js');

class Database {
    constructor() {
        this._sequelize = new Sequelize(
            dbConfig.DB,
            dbConfig.USER,
            dbConfig.PASSWORD,
            {
                host: dbConfig.HOST,
                dialect: dbConfig.dialect,
                port: dbConfig.DB_PORT,
                pool: dbConfig.pool,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                logging: false
            }
        );

        this.Sequelize = Sequelize;
        this.models = {};

        this._loadModels();
        this._associateModels();
    }

    _loadModels() {
        const sequelize = this._sequelize;
        this.models.n8n = require('./n8n.js')(sequelize); 
    }


    _associateModels() {
        const { n8n} = this.models;


    }
    
    get sequelize() {
        return this._sequelize;
    }

    getModel(name) {
        return this.models[name];
    }
}

module.exports = new Database();