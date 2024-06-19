import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

class ocr extends Model{
    static execute(query: string, arg1: any[]): [any] | PromiseLike<[any]> {
        throw new Error('Method not implemented.');
    }
    public id!: Number
    public isbn13!: string
    public isbn_set!: string
    public add_sym!: string
    public volume!: string
    public class_no!: string
    public book_smbl_no!: string
    public num_col!: number
    public checkout!: number
    public registration!: Date;
}

ocr.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: true,
        },
        isbn13: {
            type: DataTypes.STRING(20),
            allowNull: true,
            
        },
        isbn_set: {
            type: DataTypes.STRING(20),
            allowNull: false,
            
        },
        add_sym: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        volume: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        class_no: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        book_smbl_no: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        num_col: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        checkout: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        registration: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'booklist_141263',
        timestamps: false,
    }
)

export default ocr