const Todo = require('../models/todo');
const User = require('../models/user');
const dueDate = require('../helpers/dueDate');
const createObjectId = require('../helpers/createObjectId');

module.exports = {
  create: (req, res) => {
    let userId = createObjectId(req.body.userId);
    let input = {
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate
    }

    User.findById(userId)
    .then(user => {
      if(!user) {
        res.status(403).json({
          error: 'You are not authorized'
        });  
      } else {
        Todo.create(input)
        .then(todo => {
          let userId = createObjectId(user._id);

          User.updateOne( {_id: userId}, { $push: {todos: todo} })
          .then(query => {
            res.status(201).json({
              message: 'success create new todo',
              userId: userId,
              todo: todo
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err.message
            });
          })
        })
        .catch(err => {
          res.status(500).json({
            error: err.message
          });    
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
  },

  findByUser: (req, res) => {
    let id = createObjectId(req.params.userId);

    User.findOne({_id: id}).populate({
      path: 'todos',
      match: { status: false }
    })
    .then(todos => {
      res.status(200).json({
        message: 'success get all todos',
        data: todos
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'failed create new todo',
        error: err.message
      });
    });
  },

  findById: (req, res) => {
    let todoId = createObjectId(req.params.todoId);

    Todo.findById({ _id: todoId })
    .then(todo => {
      res.status(200).json({
        message: 'success get todo by id',
        todo
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'failed get todo',
        error: err.message
      });
    })
  },

  update: (req, res) => {
    let todoId = createObjectId(req.params.todoId);
    let input = {
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate
    }

    Todo.findByIdAndUpdate({_id: todoId}, input)
    .then(oldTodo => {
      res.status(200).json({
        message: 'success update todo',
        info: input
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      })
    });
  },

  finish: (req, res) => {
    let todoId = createObjectId(req.params.todoId);

    Todo.findByIdAndUpdate({_id: todoId}, { status: true })
    .then(oldTodo => {
      res.status(200).json({
        message: 'success finish todo',
        todo: oldTodo
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      })
    });
  },

  remove: (req, res) => {
    let userId = createObjectId(req.body.userId);
    let todoId = createObjectId(req.params.todoId);

    User.findById(userId)
    .then(user => {
      if(!user) {
        res.status(403).json({
          error: 'You are not authorized'
        });  
      } else {
        User.update({_id: userId}, { $pull: { todos:  todoId} })
        .then(affected => {
          res.status(200).json({
            message: 'success delete todo',
            info: affected
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err.message
          });    
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
  }
}