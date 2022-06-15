var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;

var taskFormHandler = function(event) { 
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name ='task-name']").value;
    var taskTypeInput = document.querySelector("select[name ='task-type']").value;

    //check to make sure input values have something in them
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    
    //this is to reset the form every time it gets clicked THIS WILL BE USED IN THE CHALLENGE TO GENERATE A NEW PAGE EVERY TIME. Things need to be in a form for it to work.
    formEl.reset();
    
    //package up data an an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj);

};

var createTaskEl = function(taskDataObj) {
      //create list item
      var listItemEl = document.createElement("li");
      listItemEl.className = "task-item";

      //add task id (this is from data-*) as a custom attribute THIS IS WHERE data-task-id IS DEFINED
      listItemEl.setAttribute("data-task-id", taskIdCounter);

      //create div to hold task info and add to list item
      var taskInfoEl = document.createElement("div");
      //give it a class name
      taskInfoEl.className = "task-info";
      //add HTML content to div
      taskInfoEl.innerHTML = "<h3 class ='task-name'>" + taskDataObj.name + "</h3><span class = 'task-type'>" + taskDataObj.type + "</span>";
      //make the previous div with the innerHTML a child of the listItemEl (li element)
      listItemEl.appendChild(taskInfoEl);

      //add all the data from the createTaskActions function 
      var taskActionsEl = createTaskActions(taskIdCounter);
      listItemEl.appendChild(taskActionsEl);

      //add entire list item to list
      tasksToDoEl.appendChild(listItemEl);

      //increase task counter (stored in a global variable at the top, taskIdCounter) for next unique ID, which will be a number starting at 0 and ascending from there.
      taskIdCounter++;

};

var createTaskActions = function(taskId) {
    //create div 
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute = ("data-task-id", taskId);

    //make the edit button a child of actionContainerEl div that was just created.
    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute = ("data-task-id", taskId);

    //make the delete button a child of the actionContainerEl div
    actionContainerEl.appendChild(deleteButtonEl);

    //add a dropdown menu for the tasks. Need to create a <select> element to make a dropdown menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    //make the select menu a child of the actionContainerEl div
    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i=0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //appent these options to the select dropdown menu above (statusSelectEl)
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};//end createTaskActions function

formEl.addEventListener("submit", taskFormHandler);