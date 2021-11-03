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
        let disableButtonClass = "";

        if (task.completed) {
            status = "Completed"
            disableButtonClass = "disabled"
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
                    <div class="row">                        
                        <div class="col border-rounded-left"><a class="btn btn-outline-light ${disableButtonClass} completeBtn">Complete</a></div>
                        <div class="col border"><button class="btn btn-outline-light ${disableButtonClass} editBtn" data-bs-toggle="modal" data-bs-target="#edit-task-modal">Edit</button></div>
                        <div class="col border-rounded-right"><button class="btn btn-outline-light deleteBtn">Delete</button></div>                            
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
        card.children[1].children[1].children[0].children[1].children[2].children[0].children[0].src = "/images/true.png";
        card.children[1].children[1].children[0].children[1].children[2].children[0].children[1].innerHTML = "Completed";
        clickedTarget.classList.add("disabled");
        clickedTarget.parentElement.nextElementSibling.children[0].classList.add("disabled");

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

//Startup/reload event
document.addEventListener("DOMContentLoaded", applicationStart)

//Functions run at app startup/reload
function applicationStart() {
    TaskUI.displayTasks();
    MovieUI.displayMovies();

}

//Changing the background every minute. Meant to change depending on time of day (day/night), but that doesn't make sense in this project.
setInterval(() => {
    let today = new Date();
    let hr = today.getMinutes();
    console.log(hr);
    if (hr % 2 == 0) {
        document.body.style.backgroundImage = `url("https://www.desktopbackground.org/download/o/2014/05/28/769561_wallpapers-dream-theater-descargar-imagenes-en-hd-de-todo-un-poco_1920x1200_h.jpg")`
    }

    else {
        document.body.style.backgroundImage = `url("https://images6.alphacoders.com/438/thumb-1920-438947.jpg")`
    }
}, 1000);

//Switch between Remindr och Filmr
document.getElementById("hamburger-menu-buttons").addEventListener("click", (e) => {
    if (e.target.id == "remindr") {
        document.getElementById("task-section").classList.remove("hidden");
        document.getElementById("movie-section").classList.add("hidden");

        document.getElementById("filmr").classList.add("hidden");
        document.getElementById("remindr").classList.remove("hidden");

        document.getElementById("search-movie").parentElement.classList.add("hidden");
        document.getElementById("add-new-task").parentElement.classList.remove("hidden");

    } else if (e.target.id == "filmr") {
        document.getElementById("task-section").classList.add("hidden");
        document.getElementById("movie-section").classList.remove("hidden");

        document.getElementById("filmr").classList.remove("hidden");
        document.getElementById("remindr").classList.add("hidden");

        document.getElementById("search-movie").parentElement.classList.remove("hidden");
        document.getElementById("add-new-task").parentElement.classList.add("hidden");
    }
});

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

class Movie {
    constructor(id, title, released, runtime, genre, director, actors, plot, poster, imdbRating, imdbVotes) {
        this.id = id;
        this.title = title;
        this.released = released;
        this.runtime = runtime;
        this.genre = genre;
        this.director = director;
        this.actors = actors;
        this.plot = plot;
        this.poster = poster;
        this.imdbRating = imdbRating;
        this.imdbVotes = imdbVotes;
        this.seen = false;
    }

}

class MovieUI {

    //Movies for demo if you don't wanna add them yourself
    static displayDemoMovies() {
        const StoredMovies = [
            {
                id: crypto.randomUUID(),
                title: "Harry Potter and the deathly hallows pt2",
                released: "15 Jul 2011",
                runtime: "130min",
                genre: "Adventure, Fantasy, Mystery",
                director: "David Yates",
                actors: "Daniel Radcliffe, Emma Watson, Rupert Grint",
                plot: "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.",
                poster: "https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDNlXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
                imdbRating: "8.1",
                imdbVotes: 806041,
                seen: false
            },
            {
                id: crypto.randomUUID(),
                title: "Harry Potter and the deathly hallows pt2",
                released: "15 Jul 2011",
                runtime: "130min",
                genre: "Adventure, Fantasy, Mystery",
                director: "David Yates",
                actors: "Daniel Radcliffe, Emma Watson, Rupert Grint",
                plot: "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.",
                poster: "https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDNlXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
                imdbRating: "8.1",
                imdbVotes: 806041,
                seen: false
            },
            {
                id: crypto.randomUUID(),
                title: "Harry Potter and the deathly hallows pt2",
                released: "15 Jul 2011",
                runtime: "130min",
                genre: "Adventure, Fantasy, Mystery",
                director: "David Yates",
                actors: "Daniel Radcliffe, Emma Watson, Rupert Grint",
                plot: "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.",
                poster: "https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDNlXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
                imdbRating: "8.1",
                imdbVotes: 806041,
                seen: false
            },
            {
                id: crypto.randomUUID(),
                title: "Harry Potter and the deathly hallows pt2",
                released: "15 Jul 2011",
                runtime: "130min",
                genre: "Adventure, Fantasy, Mystery",
                director: "David Yates",
                actors: "Daniel Radcliffe, Emma Watson, Rupert Grint",
                plot: "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.",
                poster: "https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDNlXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
                imdbRating: "8.1",
                imdbVotes: 806041,
                seen: false
            },
            {
                id: crypto.randomUUID(),
                title: "Harry Potter and the deathly hallows pt2",
                released: "15 Jul 2011",
                runtime: "130min",
                genre: "Adventure, Fantasy, Mystery",
                director: "David Yates",
                actors: "Daniel Radcliffe, Emma Watson, Rupert Grint",
                plot: "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.",
                poster: "https://m.media-amazon.com/images/M/MV5BMGVmMWNiMDktYjQ0Mi00MWIxLTk0N2UtN2ZlYTdkN2IzNDNlXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
                imdbRating: "8.1",
                imdbVotes: 806041,
                seen: false
            },

        ];

        const movies = StoredMovies;

        movies.forEach(movie => {
            MovieUI.addMovieToList(movie);
            //MovieStore.addTask(movie);
        })
    }
    //Get movies from localstorage and send them to UI
    static displayMovies() {

        const movies = MovieStore.getMovies();

        movies.forEach(movie => {
            MovieUI.addMovieToList(movie);
        })
    }
    //Add movie to UI
    static addMovieToList(movie) {
        const moviesToSee = document.getElementById("movies-to-see");
        const seenMovies = document.getElementById("seen-movies");
        let movieStatus = "unseen";

        if (movie.seen) {
            movieStatus = "seen"
        }


        let card = `
        <div class="col-xl-4 col-lg-4 col-md-6" id="card-top">
        <p hidden id="${movie.id}">${movie.id}</p>
        <div class="card border">

          <div class="row card-header ">
          <div class="col no-padding text-start"><img id="movie-status" onmouseenter="MovieUI.hover(this)" onmouseleave="MovieUI.unhover(this)" class="icon-medium" src="/Images/${movieStatus}.png"></div>
          <div class="col-8 no-padding movie-title-trunc">${movie.title}</div>
          <div class="col no-padding text-end"><img class="icon-medium" id="deleteMovieBtn" src="/Images/trash.png"></div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-2"><img class="img-fit-to-card"
                  src="${movie.poster}">
              </div>
              <div class="col-10">
                <p class="movie-plot-trunc">${movie.plot}</p>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="row">
              <div class="col no-padding"><img class="icon-medium" src="/Images/hourglass.png">${movie.runtime}</div>
              <div class="col no-padding text-center"><img class="icon-medium" src="/Images/rating.png">${movie.imdbRating}/10</div>
              <div class="col no-padding text-end"><a><img class="icon-medium" id="movie-details" data-bs-toggle="modal"
              data-bs-target="#add-movie-modal" src="/Images/info.png" alt="">Details</a>
              </div>
            </div>
          </div>
        </div>
      </div>
`;

        if (movie.seen) {
            seenMovies.innerHTML += card;
        } else {
            moviesToSee.innerHTML += card;
        }
    }

    //Populates add-movie-modal
    static populateAddMovieModal(movie, instructions) {
        if (movie.title == undefined) {
            
            //Hides movie info fields and add-button
            document.getElementById("add-movie-info").classList.add("hidden");
            document.getElementById("add-movie-btn").classList.add("hidden");

            //Shows error message
            let error = document.getElementById("add-movie-error-message");
            error.classList.remove("hidden");
            error.innerText = instructions;            
        }
        else {

            //Hides error message field
            document.getElementById("add-movie-error-message").classList.add("hidden");

            //Shows move info fields and add-button
            document.getElementById("add-movie-info").classList.remove("hidden");
            document.getElementById("add-movie-btn").classList.remove("hidden");

            //Added instructionsparameter to be able to use the same modal for showing movie details as adding movie to movie list.
            if (instructions == "details") {
                document.getElementById("add-movie-btn").classList.add("hidden");
            }

            //Populating modal with movie info
            document.getElementById("add-movie-info").children[0].id = movie.id;
            document.getElementById("add-movie-poster").src = movie.poster;
            document.getElementById("add-movie-runtime").innerText = movie.runtime;
            document.getElementById("add-movie-imdbRating").innerText = movie.imdbRating;
            document.getElementById("add-movie-imdbVotes").innerText = movie.imdbVotes;
            document.getElementById("add-movie-title").innerText = movie.title;
            document.getElementById("add-movie-plot").innerText = movie.plot;
            document.getElementById("add-movie-released").innerText = movie.released;
            document.getElementById("add-movie-genre").innerText = movie.genre;
            document.getElementById("add-movie-actors").innerText = movie.actors;
            document.getElementById("add-movie-director").innerText = movie.director;
        }
    }
    //Deleting movie from UI
    static deleteMovie(target) {
        let card = target.closest("#card-top");
        card.remove();
    }
    //Updateing movie in UI
    static updateMovie(clickedTarget) {
        let card = clickedTarget.closest("#card-top");
        card.children[1].children[0].children[0].children[0].src = "/images/seen.png";
        card.remove();
        let seenMovies = document.getElementById("seen-movies");
        seenMovies.appendChild(card);
    }

    static hover(element) {
        let movieId = element.closest("#card-top").children[0].id;
        const movie = MovieStore.getSingleMovie(movieId);
        if (movie.seen == false) {
            element.setAttribute('src', '/Images/seen.png');
            element.style.height = "35px";
            element.style.margin = "0px";
        }
    }

    static unhover(element) {

        //Kolla om filmer är sett (seen == true)
        let movieId = element.closest("#card-top").children[0].id;
        const movie = MovieStore.getSingleMovie(movieId);
        if (movie.seen == false) {
            element.setAttribute('src', '/Images/unseen.png');

        }
        element.style.height = "30px";
        element.style.margin = "5px";


    }
}

class MovieStore {
    static getMovies() {
        let movies;
        if (localStorage.getItem("movies") === null) {
            movies = [];
        } else {
            movies = JSON.parse(localStorage.getItem("movies"));
        }
        return movies;
    }
    //Get specific task
    static getSingleMovie(movieId) {

        const movies = MovieStore.getMovies();
        const movie = movies.find(movie => movie.id == movieId);

        return movie;
    }
    //Add task
    static addMovie(movie) {
        const movies = MovieStore.getMovies();
        movies.push(movie);
        localStorage.setItem("movies", JSON.stringify(movies))
    }
    static deleteMovie(target) {

        let movieId = target.closest("#card-top").children[0].id;
        let movie = this.getSingleMovie(movieId);


        const id = target.closest("#card-top").children[0].id;
        let movies = this.getMovies();
        movies.forEach((movie, index) => {
            if (movie.id == id) {
                movies.splice(index, 1);
            }
        });

        localStorage.setItem("movies", JSON.stringify(movies));

    }
    static updateMovie(target) {
        let movies = this.getMovies();
        let movieId = target.closest("#card-top").children[0].id;
        let index = movies.findIndex(movie => movie.id == movieId)
        let movie = this.getSingleMovie(movieId);
        movie.seen = true;
        movies.splice(index, 1, movie);
        localStorage.setItem("movies", JSON.stringify(movies));
    }
}

class MovieApi {
    static async getMovieAsync(movieTitle) {
        let res = await axios.get(`http://www.omdbapi.com/?apikey=2c40f502&t=${movieTitle}`);
        const rawMovie = res.data;
        let movie = new Movie(crypto.randomUUID(), rawMovie.Title, rawMovie.Released, rawMovie.Runtime, rawMovie.Genre, rawMovie.Director, rawMovie.Actors, rawMovie.Plot, rawMovie.Poster, rawMovie.imdbRating, rawMovie.imdbVotes);
        MovieUI.populateAddMovieModal(movie, rawMovie.Error);
    }
}

//------
//Events
//------

//Add movie
document.getElementById("add-movie-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const id = document.getElementById("add-movie-info").children[0].id;
    const poster = document.getElementById("add-movie-poster").src;
    const runtime = document.getElementById("add-movie-runtime").innerText;
    const imdbRating = document.getElementById("add-movie-imdbRating").innerText;
    const imdbVotes = document.getElementById("add-movie-imdbVotes").innerText;
    const title = document.getElementById("add-movie-title").innerText;
    const plot = document.getElementById("add-movie-plot").innerText;
    const released = document.getElementById("add-movie-released").innerText
    const genre = document.getElementById("add-movie-genre").innerText
    const actors = document.getElementById("add-movie-actors").innerText;
    const director = document.getElementById("add-movie-director").innerText;


    let movie = new Movie(id, title, released, runtime, genre, director, actors, plot, poster, imdbRating, imdbVotes);

    MovieUI.addMovieToList(movie);
    MovieStore.addMovie(movie);

});
//Search movie
document.getElementById("search-movie-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const movieTitle = document.getElementById("search-movie-title").value;
    document.getElementById("search-movie-title").value = null;
    //Make api call
    MovieApi.getMovieAsync(movieTitle);


});

//Movie details
document.getElementById("movie-lists").addEventListener("click", (e) => {
    let target = e.target;
    if (target.id == "movie-details") {
        let movieId = target.closest("#card-top").children[0].id;
        let movie = MovieStore.getSingleMovie(movieId);
        MovieUI.populateAddMovieModal(movie, "details");
    } else if (target.id == ("deleteMovieBtn")) {
        MovieUI.deleteMovie(target);
        MovieStore.deleteMovie(target);
    } else if (target.id == "movie-status") {
        //let testMovie = MovieStore.getSingleMovie(target.closest("#card-top").children[0].id)

        MovieUI.updateMovie(target);
        MovieStore.updateMovie(target);
    }


});

