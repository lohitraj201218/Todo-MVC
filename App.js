(function () {
    var model = new TodoModel(),
        view = new TodoView(model),
        controller = new TodoController(model, view);
        console.log("App called itself!")
        
})();