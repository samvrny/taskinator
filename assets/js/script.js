//the # pound sign before these variable referecnes refers to the ID of an element, not it's class.
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasks = [];

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
    
    var isEdit = formEl.hasAttribute("data-task-id");
    
    //has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    //no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
    }

    createTaskEl(taskDataObj);
};// end taskFormHandler function

var completeEditTask = function(taskName, taskType, taskId) {
    //find the matching task list item THIS IS IMPORTANT. THIS FINDS THE ELEMENT WE WANT TO EDIT!
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //find the tasks in the "tasks" array to update them there
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) { //parseInt makes a string into a number.
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    saveTasks();

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function(taskDataObj) {
      //create list item
      var listItemEl = document.createElement("li");
      listItemEl.className = "task-item";

      //add task id (this is from data-*) as a custom attribute THIS IS WHERE data-task-id IS DEFINED. THIS IS REFERENCED IN GOOGLE DOCS AS 412
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

      //Adds the ID of the task to the taskDataObj variable
      taskDataObj.id = taskIdCounter;
      tasks.push(taskDataObj);

      //increase task counter (stored in a global variable at the top, taskIdCounter) for next unique ID, which will be a number starting at 0 and ascending from there.
      taskIdCounter++;

      saveTasks();

};

var createTaskActions = function(taskId) {
    //create div 
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    //make the edit button a child of actionContainerEl div that was just created.
    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

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

var taskButtonHandler = function(event) { //THIS WILL BE USED TO LISTEN FOR CLICKS IN THE CHALLENGE!
    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        //get the elements task id...
        var taskId = targetEl.getAttribute("data-task-id");
        //...and edit it
        editTask(taskId);
    }

    //delete button was clicked
    if (targetEl.matches(".delete-btn")) { // this classes name is actually btn delete-btn. Not sure exactly why this all works but it does.
        //get the elements task id...
        var taskId = targetEl.getAttribute("data-task-id");
        //...and remove it
        deleteTask(taskId);
    }
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); //this line is a demonstration of how/where to use double and single quotes and how insane that can be.
    taskSelected.remove(); //This removed the list item from the whole dealeo

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];
    
    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    };

    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var editTask = function(taskId) {
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content form task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

var taskStatusChangeHandler = function(event) {
    //get the task items id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    
    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    //update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    };

    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("click", taskButtonHandler); //add your event listeners at the bottom fo the page 
formEl.addEventListener("submit", taskFormHandler);
