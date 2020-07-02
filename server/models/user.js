const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'author', 'reviewer']
  },
  active: {
    type: Boolean,
    default: true,
    required: true
  },
  google: {
    id: {
      type: String
    },
    // token: {
    //   type: String,
    //   unique: true
    // }
  }
});

schema.methods.toJson = function toJson() {
  const { _id, firstName, lastName, displayName, email, created, role, active } = this.toObject();

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    displayName,
    email,
    created,
    role,
    active,
    _id
  };
};

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', schema, 'user');
