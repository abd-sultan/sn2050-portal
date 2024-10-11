import mongoose, { Document, Model, Schema } from "mongoose";

interface IProjectUser extends Document {
  project: string;
  user: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectUserSchema: Schema<IProjectUser> = new Schema(
  {
    project: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectUser: Model<IProjectUser> = mongoose.models.ProjectUser || mongoose.model<IProjectUser>("ProjectUser", projectUserSchema);

export default ProjectUser;