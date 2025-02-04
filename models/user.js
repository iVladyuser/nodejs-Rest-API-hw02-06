import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleMongooseError } from "../helpers/index.js";

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
	{
		password: {
			type: String,
			minlength: 6,
			required: [true, "Set password for user"],
		},
		email: {
			type: String,
			match: emailRegexp,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		avatarURL: {
			type: String,
			require: true,
		},
		token: {
			type: String,
			default: null,
		},
		verify: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
			required: [true, "Verify token is required"],
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const registerSchema = Joi.object({
	email: Joi.string()
		.pattern(emailRegexp)
		.required()
		.messages({ "any.required": "missing required email field" }),
	password: Joi.string()
		.required()
		.min(6)
		.messages({ "any.required": "missing required password  field" }),
});

export const verifyEmailSchema = Joi.object({
	email: Joi.string()
		.pattern(emailRegexp)
		.required()
		.messages({ "any.required": "missing required field email" }),
});

export const logInSchema = Joi.object({
	email: Joi.string()
		.pattern(emailRegexp)
		.required()
		.messages({ "any.required": "missing required email field" }),
	password: Joi.string()
		.required()
		.min(6)
		.messages({ "any.required": "missing required password field" }),
});

export const patchSubscriptionSchema = Joi.object({
	subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const User = model("user", userSchema);

export default User;
