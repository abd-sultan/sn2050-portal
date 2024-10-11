import mongoose, { Document, Model, Schema } from "mongoose";

// Define an interface for the User document
interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  sector: string;
  fonction: string;
  company: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    fonction: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// Define the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;