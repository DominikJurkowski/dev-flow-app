import { model, models, Schema, Document } from 'mongoose';

export interface IUser {
    name: string;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String, required: false, default: '' },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Clear cached model so schema changes (e.g. image optional) apply; avoids "Path `image` is required" after edits
if (typeof models?.User !== 'undefined') {
  delete models.User;
}
const User = model<IUser>("User", UserSchema);

export default User;