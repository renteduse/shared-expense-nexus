
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      email: String,
      avatar: String,
      dateJoined: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Group', GroupSchema);
