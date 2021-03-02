const { Schema, model, SchemaTypes } = require('mongoose');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Enter name for a contact'],
    },
    email: {
      type: String,
      required: [true, 'Enter email for a contact'],
      unique: true,
    },
    phone: {
      type: Number,
      required: [true, 'Enter phone for a contact'],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
