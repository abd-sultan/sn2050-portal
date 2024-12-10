import mongoose, { Document, Model, Schema } from "mongoose";

interface IProject extends Document {
  name: string;
  file: string;
  fileKey: string;
  sector: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema: Schema<IProject> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String,
      required: true,
    },
    sector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sector',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;