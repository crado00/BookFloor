import { Model, DataTypes } from 'sequelize';
import sequelize from '../database';

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public name!: string;
  public email!: string;
  public birth_date!: Date;
  public gender!: string;
  public profileImage!: string;
  public libCode!: Number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: new DataTypes.STRING(10),
      allowNull: true,
    },
    profileImage: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    libCode: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

export default User;
