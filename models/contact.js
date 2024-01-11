const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers/");

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
	name: Joi.string()
		.required()
		.messages({ "any.required": "missing required name field" }),
	email: Joi.string()
		.required()
		.messages({ "any.required": "missing required email field" }),
	phone: Joi.string()
		.required()
		.messages({ "any.required": "missing required phone field" }),
	favorite: Joi.boolean(),
});

const putSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phone: Joi.string(),
	favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

const patchSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const schemas = {
	addSchema,
	putSchema,
	patchSchema,
};
const Contact = model("contact", contactSchema);
module.exports = { Contact, schemas };