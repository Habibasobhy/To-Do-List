let taskName = document.getElementById("taskName");
let addTaskBtn = document.getElementById("addTaskBtn");
let updateTaskBtn = document.getElementById("updateTaskBtn");
let form = document.getElementById("form");
let tasks = [];
let currentIndex = -1;
let checkBox = document.getElementById("checkBox");
let clearTasksBtn = document.getElementById("clearAllTasks");
let notification = document.getElementById("notificationMessage");


// & To prevent a form from refreshing the page when submitted
form.addEventListener("submit" , function(e){
    e.preventDefault();
})

// & Onclick event listener to the "addTaskBtn" button
addTaskBtn.addEventListener("click" , function () {
    // Call the function to add a new task when the button is clicked
    addNewTask(); 
})

// & Onclick event listener to the "updateTaskBtn" button
updateTaskBtn.addEventListener("click" , function () {
    // Call the function to update a task when the button is clicked
    updateTask(); 
})

// & Add event listener for the Enter key press (on input field)
taskName.addEventListener("keydown" , function(e){
    // Check if the pressed key is "Enter"
    if(e.key == "Enter"){
        // Call updateTask if the update button is visible
        if(updateTaskBtn.style.display == "block")
            updateTask();
        else
            addNewTask();
    } 
})

// & Add an event listener to the "clearTasksBtn" button
clearTasksBtn.addEventListener("click" , function(){
  
  // If there are no tasks, show a notification that there are no tasks to clear
  if(tasks.length == 0){
    showNotification("There are no tasks to clear!" , "clear");
  }
  else{
    // Confirm if the user wants to clear all tasks
    if(confirm("Are you sure you want to clear all tasks?")){

      const taskElements = document.querySelectorAll(".task-item"); // Select all task items

      // Add fade-out animation to each task element
      taskElements.forEach((task) => {
        task.classList.add("fade-out");
      });

      setTimeout(() => {
        tasks = [];  // If confirmed, reset the tasks array to an empty list
  
        localStorage.setItem("tasks" , JSON.stringify(tasks)); // Update localStorage to clear all tasks from persistent storage
    
        // Re-render the task list to show it is now empty
        displayTasks(tasks);
            
        // Update progress stats to reflect the cleared state
        updateStats();      
    
        // Show success notification
        showNotification("All Tasks deleted successfully!");
      } , 500);
      
    }
  }
})

// ^ =================================================================

// & Check if there are any saved tasks in localStorage
if(localStorage.getItem("tasks") == null)
  // If no tasks are found, initialize the tasks array as empty
  tasks = [];

else{
  // If tasks are found in localStorage, parse the JSON string into an array
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // Display the tasks on the page using the displayTasks function
  displayTasks(tasks);

  updateStats(); // Update the progress bar and stats
}

// ^ =================================================================

// & Function to handle adding a new task
function addNewTask(){

    let task = taskName.value; // Get the value entered in the input field (taskName)

    if(task === "") return;

    tasks.push({text : task , completed : false}); // Add the task as an object with 'completed' property

    // tasks.push(task); // Add the new task to the tasks array

    taskName.value = ''; // Clear the input field after adding the task

    localStorage.setItem("tasks" , JSON.stringify(tasks)); // Add tasks to local storage

    displayTasks(tasks); // Update the task list on the page by calling displayTasks

    updateStats(); // Update the progress bar and stats

    // Show success notification
    showNotification("Task added successfully!");
}

// ^ =================================================================

// & Function to render and display tasks on the page
function displayTasks(tasksList){

    let cartona = ``; // Initialize an empty string to hold the HTML for the task list

    // Loop through the list of tasks to generate the HTML for each task
    for (let i = 0; i < tasksList.length; i++) {
        
        // Check if task is completed, and apply the 'completed' class
        let completedClass = tasksList[i].completed ? "completed" : "";


        cartona += `<li class="${i === tasksList.length - 1 ? "animate-in" : ""}">
                <div class="task-item">
                    <input type="checkbox" onclick="toggleComplete(${i})" ${tasksList[i].completed ? "checked" : ""}>
                    <p class="task-text ${completedClass}">${tasksList[i].text}</p>
                </div>
                <div class="icons">
                    <img src="Images/edit-247.png" alt="edit-icon" onclick = "getUpdatedTask(${i})">
                    <img src="Images/56-512.webp" alt="trash icon" onclick = "deleteTask(${i})">
                </div>
            </li>`
    }
    
    // Update the content of the element with id "list" to display the tasks
    document.getElementById("list").innerHTML = cartona;

    setTimeout(() => {
      const lastTask = document.querySelector(".task-list li.animate-in");
      if (lastTask) {
          lastTask.classList.add("show"); // add show class on the last task to do the animation on it.

          setTimeout(() => {
            lastTask.classList.remove("animate-in", "show"); // remove this classes to apply remove class on the last task
          }, 50);
      }
  }, 50);

}

// ^ =================================================================

// & // Function to delete a task by its index
function deleteTask(index){

  // Get the task item element based on its index
  const taskItem = document.querySelectorAll('.task-list li')[index];

  // Add the "remove" class to trigger the animation
  taskItem.classList.add('remove');
  
    setTimeout(()=> {
      // Remove the task at the specified index from the tasks array
      tasks.splice(index,1); 

      // Update the tasks in localStorage to reflect the deletion
      localStorage.setItem("tasks" , JSON.stringify(tasks)); 
      
      // Update the displayed task list
      displayTasks(tasks);

      updateStats(); // Update the progress bar and stats

      }, 500)

    // Show success notification
    showNotification("Task deleted successfully!");
}

// ^ =================================================================

// & Function to get task from list and put it in input to edit
function getUpdatedTask(index){
    // Set the input value to the task being edited
    taskName.value = tasks[index].text;

    updateTaskBtn.style.display = "block"; // Show update button
    addTaskBtn.style.display = "none"; // Hide add task button

    currentIndex = index; // Set the current index to the task being edited
}

// ^ =================================================================

// & Function to update an existing task
function updateTask(){

    let updatedTask = taskName.value; // Get the value entered in the input field (taskName)

    if(updatedTask === "") return;  // Do nothing if the input is empty

    tasks[currentIndex].text = updatedTask; // Update task at the current index

    // Save the updated tasks array to localStorage to ensure changes persist
    localStorage.setItem("tasks" , JSON.stringify(tasks)); 

    // console.log(currentIndex); 

    currentIndex = -1; // Reset current index

    taskName.value = '';  // Clear input field

    console.log(`Habiba ${updatedTask}  +++++++`);
    

    // Hide update button and show add task button again
    updateTaskBtn.style.display = "none";
    addTaskBtn.style.display= "block";

    displayTasks(tasks); // Re-render the task list with the updated task

    // Show success notification
    showNotification("Task updated successfully!");
}

// ^ =================================================================

// & Function to toggle the completion state of a task
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed; // Toggle completed state

    localStorage.setItem("tasks" , JSON.stringify(tasks)); // Save changes

    displayTasks(tasks); // Re-render task list

    updateStats(); // Update the progress bar and stats
}

// ^ =================================================================

// & Function to Update stats
function updateStats(){

    // Count the number of completed tasks
    let completedTasks = tasks.filter(task => task.completed).length;

    // Count the number of total tasks
    let totalTasks = tasks.length;

    // Calculate the percentage of completed tasks
    let completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Update the width of the progress bar based on the percentage
    let progressBar = document.getElementById("progress");
    progressBar.style.width = `${completedPercentage}%`

    // Update the numbers showing the completed and total tasks
    let numbersElements = document.getElementById("numbers");
    numbersElements.innerHTML = `${completedTasks} / ${totalTasks}`;

    // Update the percentage of completed Tasks
    let percentageCompletedTasks = document.getElementById("percentageCompletedTasks");
    percentageCompletedTasks.innerText = `${completedPercentage}%`

    if(tasks.length && completedTasks == totalTasks)
        realisticLookConfetti();
}

// ^ =================================================================

// & Function show notification
function showNotification(message , actionType){

  if(actionType == "clear"){
    // Set red background for error messages
    notification.style.backgroundColor = "#f44336";
  }
  else{
    // Set green background for success messages
    notification.style.backgroundColor = "#4CAF50";
  }

  // Set the notification text
  notification.textContent = message;

  notification.style.transition = "opacity 0.5s ease, top 0.3s ease"; // Smooth transition for opacity and position


  // Make the notification visible and fade out after 3 seconds
    setTimeout(() => {
      notification.style.opacity = 1;
      notification.style.top = "20px"; // Make it slide down a bit

      setTimeout(() => {
        notification.style.opacity = 0;
        notification.style.top = "-100px"; // Make it slide down a bit
      } , 3000);

    }, 500);
  
}

// ^ =================================================================

// & Function to generate realistic looking confetti animation
function realisticLookConfetti(){
  const count = 200,
defaults = {
  origin: { y: 0.7 },
};

function fire(particleRatio, opts) {
confetti(
  Object.assign({}, defaults, opts, {
    particleCount: Math.floor(count * particleRatio),
  })
);
}

fire(0.25, {
spread: 26,
startVelocity: 55,
});

fire(0.2, {
spread: 60,
});

fire(0.35, {
spread: 100,
decay: 0.91,
scalar: 0.8,
});

fire(0.1, {
spread: 120,
startVelocity: 25,
decay: 0.92,
scalar: 1.2,
});

fire(0.1, {
spread: 120,
startVelocity: 45,
});
}