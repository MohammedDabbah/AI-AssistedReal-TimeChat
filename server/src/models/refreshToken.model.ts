import { Schema, Document, model, Types } from "mongoose";


export interface IRefreshToken extends Document {
    userId: string | Types.ObjectId,
    accessToken: string,
    expiresAt: Date,
    createdAt: Date,
    revoked: boolean
};

export const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: {
        type: String, // adding Schema.Types.ObjectId
        required: true
    },
    accessToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now 
    },
    revoked: {
        type: Boolean,
        required: true,
        default: false
    }
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<IRefreshToken>("RefreshToken", refreshTokenSchema);