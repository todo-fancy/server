const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  loginType: {
    type: String
  },
  todos: [
    {type: Schema.Types.ObjectId, ref: 'Todo'}
  ]
}, {
  timestamps: true
});

userSchema.statics.findOneAndCreate = function(condition, input) {
  return new Promise((resolve, reject) => {
    this.findOne(condition)
    .then(user => {
      if(!user) {
        resolve(this.create(input));
      } else {
        reject(false);
      }
    })
    .catch(err => {
      reject(err);
    });
  });
}

const User = mongoose.model('User', userSchema);

module.exports = User;