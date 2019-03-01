const getElement = (className) => document.getElementsByClassName(className);
const getEID =  (id) => document.getElementById(id);
getElement("MyInput")[0].disabled=false; //enabling name input field to take inputs; this feature makes sense in update field
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
        this.SelectAll = getEID("SelectAll");
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
        this.TableName.onclick=this.todoSelectionCheckBox();
        this.SelectAll.onclick=this.todoSelectAll();
        this.model.addTodoEvent.attach(this.loadTodo());
        this.model.deleteTodoEvent.attach(this.loadTodo());
        this.model.saveEditErrors.attach(this.saveEditErrors());
        return this;
    },
    
    test: function(){
        for(var i=0;i<this.todoCheckboxs.length;i++){
            todoCheckboxs[i].onclick=this.todoSelectionCheckBox();
        }
    },
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
        MyInputs[0].disabled=true;
        MyInputs[0].setAttribute("update",true);
        MyInputs[1].value=todo.description;
        MyInputs[2].value=todo.priority;
        MyInputs[3].value=todo.endtime;
    },

    addTodoButton : function () { 
        var object = this;
        const getEID =  (id) => document.getElementById(id);
        
        getElement("MyInput")[0].disabled=false; //enabling name input field to take inputs; this feature makes sense in update field
		return function(){
			var todo = {
				name: object.MyInputs[0].value,
				description: object.MyInputs[1].value,
				priority: object.MyInputs[2].value,
				endtime: object.MyInputs[3].value
            };
            
			var update = object.MyInputs[0].getAttribute("update");
			if(todo.name == null || todo.name == ""){
				getEID("AlertMessage2").style.display="block"; //name can't be empty
				return;
			}				
			object.addTodoEvent.notify({
				todo : todo,
				update : update
			});
		}
    },
    
    deleteTodo : function(){
        var object = this;
        getElement("MyInput")[0].disabled=false; //enabling name input field to take inputs; this feature makes sense in update field
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
        getEID("AlertMessage2").style.display="none";
        getEID("AlertMessage").style.display="none";
        getElement("MyInput")[0].disabled=false; //enabling name input field to take inputs; this feature makes sense in update field
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
                <input type="checkbox" class = js-todo-checkbox dataindex=${index} dataTodoSelected=${false}>
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

    todoSelectionCheckBox : function(){
        var object = this;
       
       return function(){
           if(event.target.tagName==="INPUT"){
               var element = event.target;
               var todoIndex = element.getAttribute("dataindex");
                if (element.getAttribute("datatodoselected")=="false") {
                     element.setAttribute("datatodoselected",true);
                     object.selectTodoEvent.notify({
                     todoIndex: todoIndex
                    });
                 } else {
                     element.setAttribute("datatodoselected",false);
                     object.unselectTodoEvent.notify({
                     todoIndex: todoIndex
                    });
                }
           }
           
      }
        
		
    },

    todoSelectAll : function(){
        var object = this;
        return function(){
            var todos = object.model.getTodos();
            if(event.target.checked){
                for(var i=0;i<todos.length;i++){
                    object.selectTodoEvent.notify({
                        todoIndex: i
                       });
                }
            }else{
                for(var i=0;i<todos.length;i++){
                    object.unselectTodoEvent.notify({
                        todoIndex: i
                       });
                }
            }
        }
    }
	
}