import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface GadgetAttributes {
  id: number;
  codename: string;
  description: string;
  status: "Available" | "Deployed" | "Destroyed" | "Decommissioned";
  decommissionedAt: Date | null;
}

interface GadgetCreationAttributes
  extends Optional<GadgetAttributes, "id" | "status" | "decommissionedAt"> {}

class Gadget
  extends Model<GadgetAttributes, GadgetCreationAttributes>
  implements GadgetAttributes
{
  public id!: number;
  public codename!: string;
  public description!: string;
  public status!: "Available" | "Deployed" | "Destroyed" | "Decommissioned";
  public decommissionedAt!: Date | null;
}

Gadget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
    decommissionedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "gadgets",
  }
);

export default Gadget;
