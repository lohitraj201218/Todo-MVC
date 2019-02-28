const getElement = (className) => document.getElementsByClassName(className);
console.log("View Ready")
var TodoView = function (model) {
	this.model = model;
    this.addTodoEvent = new Event(this);
	this.selectTodoEvent = new Event(this);
	this.unselectTodoEvent = new Event(this);
	this.deleteTodoEvent = new Event(this);
	this.init();
}

TodoView.prototype = {
    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
    },
    createChildren: function(){
        // const getElement = (className) => document.getElementsByClassName(className);
        // const getEID =  (id) => document.getElementById(id);
        this.MyInputs = getElement("MyInput");
        this.todoCheckboxs = getElement("js-todo-checkbox");
        this.resultset = getElement("Result")[0];
        this.TableName = getElement("TodoTable")[0];
        var ModifyButtons=getElement("ModifyButtons");
        this.addButton=ModifyButtons[0];
        this.deleteButton=ModifyButtons[1];
        this.updateButton=ModifyButtons[2];


        return this;
        
    },

    setupHandlers: function () {
    	return this;
    },

    enable : function(){
        this.addButton.onclick=this.addTodoButton();
        this.updateButton.onclick=this.updateTodo();
        this.deleteButton.onclick=this.deleteTodo();
        // this.TableName.onclick=this.todoSelectionCheckBox(event);
        this.resultset.onclick=this.todoSelectionCheckBox(event);
        
        this.model.addTodoEvent.attach(this.loadTodo());
        this.model.deleteTodoEvent.attach(this.loadTodo());
        this.model.saveEditErrors.attach(this.saveEditErrors());
        return this;
    },
    
    // test: function(){
    //     this.TableName.onclick=this.todoSelectionCheckBox();
    // },
    saveEditErrors : function (){ 
        var object = this;
        const getEID =  (id) => document.getElementById(id);
		return function (sender, args){
            // object.getEID("AlertMessage").innerHTML=args.error;
            getEID("AlertMessage").style.display="block";
		};
    },
    
    updateTodo : function () {
		var object = this;
		return function(){
			var selectedTodos = object.model.getSelectedTodo();
			if(selectedTodos.length != 1){
				alert("Please select only one Todo for the update operation");
				return;
			}
			
			var todo = object.model.getTodos()[selectedTodos];
			object.displayonInputField(todo);
		}
    },
    
    displayonInputField : function(todo){
        const getElement = (className) => document.getElementsByClassName(className);
        var MyInputs = getElement("MyInput");
        var object = this;
        MyInputs[0].value=todo.name;
        MyInputs[1].value=todo.description;
        MyInputs[2].value=todo.priority;
        MyInputs[3].value=todo.endtime;
    },

    addTodoButton : function () { 
        var object = this;
        const getEID =  (id) => document.getElementById(id);
        getEID("AlertMessage2").style.display="none";
        getEID("AlertMessage").style.display="none";
		return function(){
			var todo = {
				name: object.MyInputs[0].value,
				description: object.MyInputs[1].value,
				priority: object.MyInputs[2].value,
				endtime: object.MyInputs[3].value
			};
			var update = object.MyInputs[0].update;
			if(todo.name == null || todo.name == ""){
				getEID("AlertMessage2").style.display="block"; //name can't be empty
				return;
			}			
			//object.$TodoListContainer.toggle();
			//object.$TodoDetailContainer.toggle();		
			object.addTodoEvent.notify({
				todo : todo,
				update : update
			});
		}
    },
    
    deleteTodo : function(){
        var object = this;
		return function(){
			var selectedTodos = object.model.getSelectedTodo();
			if(selectedTodos.length == 0){
				alert("Please select atleast one Todo for delete operation");
				return;
			}
			object.deleteTodoEvent.notify();
		}
    },

    loadTodo : function(){
        var object = this;
        return function() {object.show();}
    },

    show : function () {
        this.buildList();
    },

    buildList: function () {
        var todos = this.model.getTodos();
        var initialhtml = `<tr>
        <th class="tbhead"><input type="checkbox" id = "SelectAll" ></th>
        <th class="tbhead">Name</th>
        <th class="tbhead">Description</th>
        <th class="tbhead">Priority</th>
        <th class="tbhead">End Time</th>
        </tr>`
        var tableName = this.TableName;
        tableName.innerHTML="";
        tableName.innerHTML=initialhtml;

        var index = 0;
        for (var todoIndex in todos) {
            const create_element = (element) => document.createElement(element);
        
			var RowContent = "";
			RowContent = create_element("tr");
            
            //Template literals
            var content =
             `<td>
                <input type="checkbox" class = js-todo-checkbox dataindex=${index} dataTodoSelected=false>
              </td>
              <td>
                ${todos[todoIndex].name}
              </td>
              <td>
                ${todos[todoIndex].description}
              </td>
              <td>
                ${todos[todoIndex].priority}
              </td>
              <td>
                ${todos[todoIndex].endtime}
              </td>`
              RowContent.innerHTML=content;
              tableName.appendChild(RowContent);
			
            index++;
        }

    },

    todoSelectionCheckBox : function(event){
        console.log("i am called");
        var object = this;
        var elememt = event.target;
        console.log(elememt.tagName);
        if(elememt.tagName==="INPUT"){
            return function(){
                var todoIndex = elememt.dataindex;
                
               if (element.datatodoselected===false) {
                   elememt.datatodoselected=true;
                   object.selectTodoEvent.notify({
                       todoIndex: todoIndex
                   });
               } else {
                   element.datatodoselected=false;
                   object.unselectTodoEvent.notify({
                       todoIndex: todoIndex
                   });
               }
           }
        }else{
            return;
        }
		
    }
	
}