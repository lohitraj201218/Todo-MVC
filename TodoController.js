console.log("Controller Ready")
var TodoController = function (model, view) {
    this.model = model;
    this.view = view;
    this.init();
};

TodoController.prototype={

    init: function(){
        this.setupHandlers().enable();
    },

    setupHandlers: function () {
        return this;
    },
    enable: function () {

        this.view.addTodoEvent.attach(this.addTodo());
		this.view.selectTodoEvent.attach(this.selectTodo());
		this.view.unselectTodoEvent.attach(this.unselectTodo());
		this.view.deleteTodoEvent.attach(this.deleteTodo());

        return this;
    },

    addTodo: function () {
		var object = this;
		return function(sender, args) {
			object.model.addTodo(args.todo, args.update);
		}
    },

    selectTodo: function () {
		var object = this;
		return function(sender, args) {
			object.model.setSelectedTodo(args.todoIndex);
		}
    },
    unselectTodo: function () {
		var object = this;
		return function(sender, args) {
			object.model.unselectTodo(args.todoIndex);
		}
    },
	
	deleteTodo: function () {
		var object = this;
		return function(sender, args) {
			object.model.deleteTodo();
		}
    },
}