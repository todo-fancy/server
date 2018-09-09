require('dotenv').config()

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypt = require('../helpers/crypt');

module.exports = {
  checkLogin: (req, res) => {
    let token = req.headers.token;

    if(!token) {
      res.status(401).json({
        message: 'You are not authenticated'
      });
    } else {
      let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      let input = {
        email: decoded.email,
        loginType: decoded.loginType
      }

      User.findOne(input)
      .then(user => {
        if(!user) {
          res.status(401).json({
            message: 'invalid token'
          });
        } else {
          res.status(200).json({
            message: 'authenticated',
            user: {
              id: user._id,
              email: user.email,
              loginType: user.loginType
            }
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
    }
  },

  signin: (req, res) => {
    let input = {
      email: req.body.email,
      password: crypt(req.body.password)
    }

    User.findOne(input)
    .then(user => {
      if(!user) {
        res.status(401).json({
          message: 'username or password wrong'
        });
      } else {
        if(user.loginType === 'fb') {
          res.status(400).json({
            message: 'You are registered using facebook'
          });
        } else if(user.loginType === 'google') {
          res.status(400).json({
            message: 'You are registered using google'
          });
        } else {
          let token = jwt.sign({
            id: user._id,
            email: user.email,
            loginType: user.loginType
          }, process.env.JWT_SECRET_KEY);
  
          res.status(200).json({
            message: 'sign in successfully',
            token: token
          });
        }
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },
  
  signup: (req, res) => {
    let input = {
      email: req.body.email,
      password: crypt(req.body.password),
      loginType: 'app'
    }

    User.findOneAndCreate({email: input.email}, input)
    .then(newUser => {
      res.status(201).json({
        message: 'sign up successfully',
        user: newUser
      });
    })
    .catch(err => {
      if(!err) {
        res.status(400).json({
          message: 'email already used'
        });
      } else {
        res.status(500).json({
          message: err.message
        });
      }
    });
  },

  googleSignIn: (req, res) => {
    let input = {
      email: req.body.email,
      password: crypt('123'),
      loginType: 'google'
    }

    console.log(input.email, '<================= GOOGE MAIL');

    User.findOne({email: input.email})
    .then(user => {
      if(!user) {
        User.create(input)
        .then(newUser => {
          let token = jwt.sign({
            id: newUser._id,
            email: newUser.email,
            loginType: newUser.loginType
          }, process.env.JWT_SECRET_KEY);

          res.status(200).json({
            message: 'success sign in with google',
            token
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
      } else if(user.loginType === 'google') {

        let token = jwt.sign({
          id: user._id,
          email: user.email,
          loginType: user.loginType
        }, process.env.JWT_SECRET_KEY);

        res.status(200).json({
          message: 'success sign in with google',
          token
        });
      } else if(user.loginType === 'app') {
        res.status(400).json({
          message: 'You are registered with regular sign in'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  },

  fbSignIn: (req, res) => {
    let fbtoken = req.headers.fbtoken;

    axios({
      method: 'get',
      url: `https://graph.facebook.com/me?fields=id,name,email&access_token=${fbtoken}`
    })
    .then(response => {
      let fbInfo = response.data
      let input = {
        email: fbInfo.email,
        password: crypt('123'),
        loginType: 'fb'
      }
  
      User.findOne({email: input.email})
      .then(user => {
        if(!user) {
          User.create(input)
          .then(newUser => {
            let token = jwt.sign({
              id: newUser._id,
              email: newUser.email,
              loginType: newUser.loginType
            }, process.env.JWT_SECRET_KEY);

            res.status(200).json({
              message: 'success sign in with facebook',
              token
            });
          })
          .catch(err => {
            res.status(500).json({
              message: err.message
            });
          });
        } else if(user.loginType === 'fb') {

          let token = jwt.sign({
            id: user._id,
            email: user.email,
            loginType: user.loginType
          }, process.env.JWT_SECRET_KEY);

          res.status(200).json({
            message: 'success sign in with facebook',
            token
          });
        } else if(user.loginType === 'app') {
          res.status(400).json({
            message: 'You are registered with regular sign in'
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  }
}