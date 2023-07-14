'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Comments, { // 2. Comments 모델에게 hasMany 1:N 관계 설정을 합니다.
        sourceKey: 'itemId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'ItemId', // 4. Comments 모델의 UserId 컬럼과 연결합니다.
      });
    }
  }

  Items.init(
    {
      itemId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.INTEGER,
      },
      itemName: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      explanation: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      imageUrl: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Items',
    }
  );
  return Items;
};