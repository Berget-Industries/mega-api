import { model, Schema } from "npm:mongoose";

export interface IResetPasswordToken {
	email: string;
	token: string;
}

export default model<IResetPasswordToken>(
	"ResetPasswordToken",
	new Schema({
		email: { type: String, required: true },
		token: { type: String, required: true, unique: true },
	})
);
