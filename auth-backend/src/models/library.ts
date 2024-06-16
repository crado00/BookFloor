import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

class Library extends Model{
    public LBRRY_CD!: Number
    public LIBRARY_NAME!: string
    public ADDRESS!: string
    public LIBRARY_TEL!: string
    public LIBRARY_URL!: string
    public LIBRARY_CLOSED!: string
    public OPERATINGTIME!: string
    public LATITUDE!: Number
    public LONGITUDE!: Number
}

Library.init(
    {
        LBRRY_CD: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
        },
        LIBRARY_NAME: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        ADDRESS: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        LIBRARY_TEL: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        LIBRARY_URL: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        LIBRARY_CLOSED: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        OPERATINGTIME: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        LATITUDE: {
            type: DataTypes.DECIMAL(13, 10),
            allowNull: false,
        },
        LONGITUDE: {
            type: DataTypes.DECIMAL(13, 10),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'library',
        timestamps: false,
      }
)

export default Library;