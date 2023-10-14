import { model, Schema } from 'mongoose';

export interface ITokens {
  _id: string;
  slug: string;
  access_token: string;
  refresh_token: string;

  token_type: string;
  expires_in: number;
  expires_at?: number;
}

export const TokensSchema = new Schema<ITokens>({
  slug: { type: String, required: true, maxLength: 255, unique: true },
  access_token: { type: String, required: true, maxLength: 255 },
  refresh_token: { type: String, required: true, maxLength: 255 },

  token_type: { type: String, required: true, maxLength: 255 },
  expires_in: { type: Number, required: true },
  expires_at: { type: Number, required: false },
});

export const Tokens = model<ITokens>('Tokens', TokensSchema);
