import mongoose, { Document, Model, Schema } from "mongoose";

interface ISector extends Document {
  name: string;
  icon: string;
  iconKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const sectorSchema: Schema<ISector> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    iconKey: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Sector: Model<ISector> = mongoose.models.Sector || mongoose.model<ISector>("Sector", sectorSchema);

export default Sector;