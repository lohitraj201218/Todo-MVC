console.log("Model ready")
var TodoModel = function () {
    this.todos = [];
    this.todoNameMap = {};
    this.selectedTodos = [];	 
    this.addTodoEvent = new Event(this);
    this.saveEditErrors = new Event(this);
    this.deleteTodoEvent = new Event(this);
};

TodoModel.prototype = {
    addTodo: function (todo, update) {		 
        var findTodo = this.todoNameMap[todo.name];
        // if update is undefined then findTodo should be null
        if (typeof update == 'undefined' && findTodo != null){
            this.saveEditErrors.notify({error : todo.name + " already exist, please give different name"});
            return;
        }
        if(findTodo == null){
            var todoDetails = {
                name: todo.name,
                description : todo.description,
                priority : todo.priority,
                endtime : todo.endtime
            };
            console.log(todoDetails);
            this.todos.push(todoDetails);
            console.log(this.todos.length);
            this.todoNameMap[todo.name] = todoDetails; 
       }else{
           findtodo.description = todo.description;
           findtodo.priority = todo.priority;
           findtodo.endtime = todo.endtime;
       }
       this.clear();
       this.addTodoEvent.notify();
    },
    clear : function () {
        this.selectedTodos = [];
    },

    getTodos : function(){
        return this.todos;
    },
    getSelectedTodo : function () {
		var selectedTodos = this.selectedTodos;
		return selectedTodos;
     },
     setSelectedTodo : function (todoIndex) {
         console.log("index is "+todoIndex);
        this.selectedTodos.push(todoIndex);
    },

    deleteTodo : function (){
        if(this.selectedTodos.length != 0){
            var selectedTodos = this.selectedTodos;
            // remove from the Todo name to Todo map
            for(var i in selectedTodos){
                console.log("see.. "+selectedTodos[i])
            }
            for(var index in selectedTodos){
                var todo = this.todos[selectedTodos[index]];
                console.log("Model "+todo);
                delete this.todoNameMap[todo.name];
            }
            
            // remove from the todos
            this.todos = [];
            for(var todo in this.todoNameMap){
                this.todos.push(this.todoNameMap[todo]);
            }
        }
        this.clear();
        this.deleteTodoEvent.notify();
    },
    unselectTodo : function (todoIndex) {
        var targetIndex = -1;
        var selectedTodos = this.selectedTodos;
        for(var index in selectedTodos){
            if(todoIndex == selectedTodos[index]){
                targetIndex = index;
                break;
            }
        }
        if(targetIndex != -1){
           this.selectedTodos.splice(targetIndex, 1);
        }
    }
}
