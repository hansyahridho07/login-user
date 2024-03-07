'use strict'
const { Model, Sequelize } = require('sequelize')
const utill = require('../helpers/Utility')
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // User.hasOne(models.productDigitalUser,{
            //   foreignKey: {
            //     name: 'product_digital_master_user_id',
            //     allowNull: false
            //   }
            // })
            // User.hasMany(models.transaction, {
            //   foreignKey: 'product_digital_master_user_id'
            // })
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                unique: {
                    args: true,
                    msg: 'Username sudah dipakai',
                },
            },
            name: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                unique: {
                    args: true,
                    msg: 'Email sudah dipakai',
                },
                validate: {
                    isEmail: {
                        msg: 'Periksa kembali email Anda',
                    },
                },
            },
            phone_number: {
                type: DataTypes.STRING,
                unique: {
                    args: true,
                    msg: 'Nomor hp sudah dipakai',
                },
                validate: {
                    len: {
                        args: [10, 14],
                        msg: 'Panjang minimal phone_number 10 karakter dan maximal 14 karakter',
                    },
                },
            },
            password: DataTypes.STRING,
            email_confirmation: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
            token_confirmation: {
                type: DataTypes.STRING,
                validate: {
                    isUUID: 4,
                },
            },
            image: DataTypes.STRING,
            role: DataTypes.ENUM('ADMIN', 'USER'),
            type: DataTypes.ENUM('MANUAL', 'GOOGLE', 'ETC'),
            created_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.now,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW,
            },
        },
        {
            sequelize,
            tableName: 'user',
            modelName: 'user',
            underscored: true,
            timestamps: false,
            hooks: {
                beforeCreate: (record, opt) => {
                    record.dataValues.password = utill.hashingBcrypt(
                        record.dataValues.password
                    )
                },
            },
        }
    )

    return User
}
