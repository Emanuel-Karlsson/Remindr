class Task {
    constructor(id, title, description, startTime, endTime, prio, completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.prio = prio;
        this.completed = completed;
    }
}


//-----------
//TaskUI class
//-----------
class TaskUI {
    //Add demo tasks to task list
    static displayDemoTasks() {
        const StoredTasks = [
            {
                id: crypto.randomUUID(),
                title: "Task one",
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, temporibus dolorum?",
                startTime: "01:00",
                endTime: "03:00",
                prio: "high",
                completed: false
            },
            {
                id: crypto.randomUUID(),
                title: "Task two",
                description: "Lorem ipsum dolor sit stias odit cupiditate quia sunt!",
                startTime: "03:00",
                endTime: "13:00",
                prio: "low",
                completed: false
            },
            {
                id: crypto.randomUUID(),
                title: "Task three",
                description: "Äta mat",
                startTime: "03:00",
                endTime: "13:00",
                prio: "low",
                completed: false
            },
            {
                id: crypto.randomUUID(),
                title: "Task four",
                description: "Springa!",
                startTime: "03:00",
                endTime: "13:00",
                prio: "low",
                completed: false
            }
        ];

        const tasks = StoredTasks;

        tasks.forEach(task => {
            TaskUI.addTaskToList(task);
            TaskStore.addTask(task);
        })
    }
    //Display tasks
    static displayTasks() {

        const tasks = TaskStore.getTasks();

        tasks.forEach(task => {
            TaskUI.addTaskToList(task);
        })
    }
    //Adding task to the list of tasks
    static addTaskToList(task) {
        const unfinishedTasks = document.getElementById("task-list");
        const finishedTasks = document.getElementById("finished-task-list");
        let status;

        if (task.completed) {
            status = "Completed"
        } else {
            status = "Not completed"
        }

        let card = `
        <div class="col-lg-4" id="card-top">  
        <p hidden id="${task.id}">${task.id}</p>  
            <div class="card border">
                <div class="card-header">${task.title}</div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-7"><p>${task.description}</p></div>
                        <div class="col">
                            <div class="row">
                                <div class="col"><img src="/Images/clock.png" class="icon"> <span>${task.startTime}</span>-<span>${task.endTime}</span></div>
                            </div>
                            <div class="row">
                                <div class="col"><img src="/Images/${task.prio}.png" class="icon"><span>${task.prio}</span> prio</div>
                            </div>
                            <div class="row">
                                <div class="col"><img src="/Images/${task.completed}.png" class="icon"> <span>${status}</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col border-rounded-left"><a class="btn btn-outline-light completeBtn">Complete</a></div>
                            <div class="col border"><button class="btn btn-outline-light editBtn" data-bs-toggle="modal" data-bs-target="#edit-task-modal">Edit</button></div>
                            <div class="col border-rounded-right"><button class="btn btn-outline-light deleteBtn">Delete</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

        if (task.completed) {
            finishedTasks.innerHTML += card;
        } else {
            unfinishedTasks.innerHTML += card;
        }
    }
    //Getting prio values from modals
    static getPrioValue(modalName) {
        let val;
        let radios = document.getElementsByName(`${modalName}-prio`);
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                val = radios[i].value;
            }
        }
        return val;
    }
    static clearModalFields() {
        //Clearing all fields in "add-task-modal"
        document.getElementById("add-task-title").value = null;
        document.getElementById("add-task-description").value = null;
        document.getElementById("add-task-start-time").value = null;
        document.getElementById("add-task-end-time").value = null;
        document.getElementsByName("add-prio").forEach(element => {
            element.checked = false;
        });
    }
    //Delete task
    static deleteTask(clickedElement) {
        if (clickedElement.classList.contains("deleteBtn")) {
            clickedElement.closest("#card-top").remove();
        }
    }
    //Edit Task
    static editTask(oldTask, updatedTask) {
        let taskCard = document.getElementById(oldTask.id).closest("#card-top");

        //Change card title
        taskCard.children[1].children[0].innerHTML = updatedTask.title;
        //Change card description
        taskCard.children[1].children[1].children[0].children[0].children[0].innerHTML = updatedTask.description;
        //Change card start time
        taskCard.children[1].children[1].children[0].children[1].children[0].children[0].children[1].innerHTML = updatedTask.startTime;
        //Change card end time
        taskCard.children[1].children[1].children[0].children[1].children[0].children[0].children[2].innerHTML = updatedTask.endTime;
        //Change card prio
        taskCard.children[1].children[1].children[0].children[1].children[1].children[0].children[1].innerHTML = updatedTask.prio;
        // //Change card prio img
        taskCard.children[1].children[1].children[0].children[1].children[1].children[0].children[0].src = `/images/${updatedTask.prio}.png`;
        //Change card status
        taskCard.children[1].children[1].children[0].children[1].children[2].children[0].children[1].innerHTML = updatedTask.completed;

    }
    //Complete task
    static completeTask(clickedTarget) {
        let card = clickedTarget.closest("#card-top");
        const cardTaskId = card.children[0].innerHTML;
        card.children[1].children[1].children[0].children[1].children[2].children[0].children[0].src = "/images/true.png";
        card.children[1].children[1].children[0].children[1].children[2].children[0].children[1].innerHTML = "Completed";

        card.remove();
        let finishedTasks = document.getElementById("finished-task-list");
        finishedTasks.appendChild(card);
    }
    //Populate edit modal
    static populateEditModal(clickedTarget) {
        let task = clickedTarget.closest("#card-top")

        document.getElementById("edit-task-id").value = task.children[0].innerHTML;
        document.getElementById("edit-task-title").value = task.children[1].children[0].innerHTML;
        document.getElementById("edit-task-description").value = task.children[1].children[1].children[0].children[0].children[0].innerHTML;
        document.getElementById("edit-task-start-time").value = task.children[1].children[1].children[0].children[1].children[0].children[0].children[1].innerHTML;
        document.getElementById("edit-task-end-time").value = task.children[1].children[1].children[0].children[1].children[0].children[0].children[2].innerHTML;
        let prio = task.children[1].children[1].children[0].children[1].children[1].children[0].children[1].innerHTML;
        document.getElementsByName("edit-prio").forEach(element => {
            if (element.value == prio) {
                element.checked = true;
            }
        })


    }
    //Show alert
    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `text-center alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const taskList = document.getElementById("task-section");
        container.insertBefore(div, taskList);

        //Making alert stay for 3 seconds
        setTimeout(() => document.querySelector(".alert").remove(), 5000)

    }
}


//-----------
//TaskStore class
//-----------
class TaskStore {
    //get tasks
    static getTasks() {
        let tasks;
        if (localStorage.getItem("tasks") === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }

        //tasks = tasks.sort((a, b) => a.startTime > b.startTime ? 1 : -1)
        return tasks;
    }
    //Get specific task
    static getSingleTask(taskId) {

        const tasks = TaskStore.getTasks();
        const task = tasks.find(task => task.id == taskId);

        return task;
    }
    //Add task
    static addTask(task) {
        const tasks = TaskStore.getTasks();
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    //Delete task
    static deleteTask(clickedTarget) {
        const id = clickedTarget.closest("#card-top").children[0].innerHTML;
        const tasks = TaskStore.getTasks();
        tasks.forEach((task, index) => {
            if (task.id == id) {
                tasks.splice(index, 1);
            }
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    //Edit task
    static editTask(oldTask, updatedTask) {

        let tasks = TaskStore.getTasks();
        const index = tasks.findIndex(task => task.id == oldTask.id);
        tasks.splice(index, 1, updatedTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    //Complete task
    static completeTask(target) {
        let taskId = target.closest("#card-top").children[0].id;
        let tasks = this.getTasks();
        let task = this.getSingleTask(taskId);
        task.completed = true;


        let index = tasks.findIndex(t => t.id == taskId);
        tasks.splice(index, 1, task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}



//----------
//**Events**
//----------

//Add demo tasks
document.getElementById("remindr").addEventListener("click", TaskUI.displayDemoTasks);



//Add task
document.getElementById("add-task-btn").addEventListener("click", (e) => {
    //Prevent actual submit
    e.preventDefault();

    //Get form values
    const id = crypto.randomUUID();
    const title = document.getElementById("add-task-title").value;
    const description = document.getElementById("add-task-description").value;
    const startTime = document.getElementById("add-task-start-time").value;
    const endTime = document.getElementById("add-task-end-time").value;
    const prio = TaskUI.getPrioValue("add");
    const completed = false;

    //Validate
    if (title == "") {
        TaskUI.showAlert("Title cannot be empty - task has not been added.", "danger");
    } else if (startTime > endTime) {
        TaskUI.showAlert("Start time cannot be greater than end time - task has not been added.", "danger");
    } else {
        //All good, lets create a task
        let task = new Task(id, title, description, startTime, endTime, prio, completed);

        //Add task to UI
        TaskUI.addTaskToList(task);

        //Add task to store
        TaskStore.addTask(task);

        //Clear modal fields
        TaskUI.clearModalFields();

    }



});

//Delete/Edit/Complete task
document.getElementById("task-section").addEventListener("click", (e) => {

    e.preventDefault();

    if (e.target.classList.contains("deleteBtn")) {
        TaskUI.deleteTask(e.target);
        TaskStore.deleteTask(e.target);
    } else if (e.target.classList.contains("editBtn")) {
        TaskUI.populateEditModal(e.target);
    }
    else if (e.target.classList.contains("completeBtn")) {
        TaskUI.completeTask(e.target);
        TaskStore.completeTask(e.target);
    }

});

//Update task
document.getElementById("edit-task-btn").addEventListener("click", (e) => {
    let taskId = document.getElementById("edit-task-id").value;

    let oldTask = TaskStore.getSingleTask(taskId);

    let updatedTitle = document.getElementById("edit-task-title").value;
    let updatedDescription = document.getElementById("edit-task-description").value;
    let updatedStartTime = document.getElementById("edit-task-start-time").value;
    let updatedEndTime = document.getElementById("edit-task-end-time").value;
    let updatedPrio = TaskUI.getPrioValue("edit");
    let updatedCompleted = false;

    // const updatedTask = new Task(taskId, updatedTitle, updatedDescription, updatedStartTime, updatedEndTime, updatedPrio, updatedCompleted)
    const updatedTask =
    {
        id: taskId,
        title: updatedTitle,
        description: updatedDescription,
        startTime: updatedStartTime,
        endTime: updatedEndTime,
        prio: updatedPrio,
        completed: updatedCompleted
    }



    //Change task in localStorage
    TaskStore.editTask(oldTask, updatedTask);

    //Change task in UI
    TaskUI.editTask(oldTask, updatedTask);



});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//END OF REMINDR JAVASCRIPT
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Display tasks
document.addEventListener("DOMContentLoaded", applicationStart)

function applicationStart(){
    TaskUI.displayTasks();
    MovieUI.displayMovies();
}
//Switch between Remindr och Filmr
document.getElementById("hamburger-menu-buttons").addEventListener("click", (e) => {
    if (e.target.id == "remindr") {
        document.getElementById("task-section").classList.remove("hidden");
        document.getElementById("movie-section").classList.add("hidden");

        document.getElementById("filmr").classList.add("hidden");
        document.getElementById("remindr").classList.remove("hidden");

        document.getElementById("add-new-movie").parentElement.classList.add("hidden");
        document.getElementById("add-new-task").parentElement.classList.remove("hidden");

    } else if (e.target.id == "filmr") {
        document.getElementById("task-section").classList.add("hidden");
        document.getElementById("movie-section").classList.remove("hidden");

        document.getElementById("filmr").classList.remove("hidden");
        document.getElementById("remindr").classList.add("hidden");

        document.getElementById("add-new-movie").parentElement.classList.remove("hidden");
        document.getElementById("add-new-task").parentElement.classList.add("hidden");
    }
});
// //Click event of everything for debugging
// document.querySelector(".container").addEventListener("click", (e) => {
//     console.log(e.target);
// })

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//START OF FILMR JAVASCRIPT
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

class Movie{
    constructor(title, description, length, rating, seen){

    }

}

class MovieUI{

 static displayMovies(){

    const movies = MovieStore.getMovies();

        movies.forEach(movie => {
            MovieUI.addMovieToList(movie);
        })
 }

 static addMovieToList(movie){
    const moviesToSee = document.getElementById("task-list");
    const seenMovies = document.getElementById("finished-task-list");


    

    let card = `
    
`;

    if () {
        finishedTasks.innerHTML += card;
    } else {
        unfinishedTasks.innerHTML += card;
    }
 }
}

class MovieStore{

}