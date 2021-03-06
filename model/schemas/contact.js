const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { ContactType } = require('../../helpers/constants');

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
    category: {
      type: String,
      enum: {
        values: [ContactType.FRIEND, ContactType.WORK, ContactType.OTHER],
        message: "It isn't allowed",
      },
      default: ContactType.OTHER,
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

contactSchema.plugin(mongoosePaginate);

const Contact = model('contact', contactSchema);

module.exports = Contact;
