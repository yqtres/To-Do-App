document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        input: document.getElementById("input"),
        addButton: document.querySelector(".adding button"),
        todoContainer: document.querySelector(".todo-container"),
        openbtn: document.getElementById("openbtn"),
        sidebar: document.getElementById("mySidebar"),
        main: document.querySelector(".todo-app"),
        counter: document.getElementById("counter") 
    };

    let openDropdown = null;
    let todoCount = 0;

    // retrieves stored items from local storage, create html elements, update counter
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    storedTodos.forEach((todo) => {
        elements.todoContainer.appendChild(createTodoItem(todo.text, todo.isCompleted));
        if (!todo.isCompleted) todoCount++;
    });
    updateCounter(); 

    elements.addButton.addEventListener("click", addTodo);
    elements.openbtn.addEventListener("click", toggleNav);
    elements.input.addEventListener("keypress", (event) => event.key === "Enter" && addTodo());
    elements.todoContainer.addEventListener("click", handleTodoClick);

    // if input is not empty, add new todo, update counter and save to local storage
    function addTodo() {
        const inputValue = elements.input.value.trim();
        if (inputValue !== "") {
            const newTodoItem = createTodoItem(inputValue);
            elements.todoContainer.insertBefore(newTodoItem, elements.todoContainer.firstChild);
            elements.input.value = "";
            todoCount++;
            updateCounter(); 
            saveTodosToLocalStorage();
        }
    }

    // style sidebar, close any open dropdowns
    function toggleNav() {
        const sidebarWidth = elements.sidebar.style.width;
        elements.sidebar.style.width = sidebarWidth === "200px" ? "0" : "200px";
        elements.main.style.marginLeft = sidebarWidth === "200px" ? "0" : "200px";
        closeDropdown();
    }

    function handleTodoClick(event) {
        const target = event.target;
        if (target.classList.contains("checkbox")) {
            event.stopPropagation();
            toggleTodoItem(target.closest(".todo-item"));
        } else if (target.classList.contains("menu-button")) {
            event.stopPropagation();
            toggleDropdown(target.querySelector(".dropdown-content"));
        }
    }

    // show only one dropdown menu
    function toggleDropdown(dropdownContent) {
        if (openDropdown && openDropdown !== dropdownContent) openDropdown.classList.remove("show");
        dropdownContent.classList.toggle("show");
        openDropdown = dropdownContent;
    }

    function closeDropdown() {
        if (openDropdown) openDropdown.classList.remove("show");
    }

    // create a new to do item with a checkbox, text and menu button. Added event listeners for to do interactions
    function createTodoItem(text, isCompleted = false) {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");

        // create checkbox 
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.checked = isCompleted;
        checkbox.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleTodoItem(todoItem);
        });

        const paragraph = document.createElement("p");
        paragraph.textContent = text;

        const menuButton = document.createElement("button");
        menuButton.classList.add("menu-button");
        const dotIcon = document.createElement("i");
        dotIcon.classList.add("fas", "fa-ellipsis");
        menuButton.appendChild(dotIcon);

        const dropdownContent = document.createElement("div");
        dropdownContent.classList.add("dropdown-content");

        // create edit and delete options for the dropdown menu, attach click events to them
        const options = ["Edit", "Delete"];
        options.forEach((option) => {
            const link = document.createElement("a");
            link.innerHTML = `<i class="fas ${option.includes("fa-") ? option : `fa-${option.toLowerCase()}`}"></i> ${option}`;
            dropdownContent.appendChild(link);

            link.addEventListener("click", () => {
                switch (option) {
                    case "Delete":
                        deleteTodoItem(todoItem);
                        break;
                    case "Edit":
                        editToDo(todoItem);
                        break;
                    default:
                        break;
                }
            });
        });

        // append dropdown content to the menu button and toggle its visibility while closing any other open dropdown
        menuButton.appendChild(dropdownContent);
        menuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            if (openDropdown && openDropdown !== dropdownContent) openDropdown.classList.remove("show");
            dropdownContent.classList.toggle("show");
            openDropdown = dropdownContent;
        });

        todoItem.append(checkbox, paragraph, menuButton);
        todoItem.classList.toggle("completed", isCompleted);
        paragraph.classList.toggle("completed", isCompleted);

        return todoItem;
    }

    // toggle the completion status of a todo item, update counter and dom, save local storage
    function toggleTodoItem(todoItem) {
        const isCompleted = todoItem.classList.toggle("completed");
        const paragraph = todoItem.querySelector("p");
        paragraph.classList.toggle("completed", isCompleted);
        if (isCompleted) {
            todoCount--;
        } else {
            todoCount++;
        }
        updateCounter();
        if (isCompleted) elements.todoContainer.appendChild(todoItem);
        else elements.todoContainer.insertBefore(todoItem, elements.todoContainer.querySelector(".completed"));

        saveTodosToLocalStorage();
    }

    // remove the added todo item, update counter and save to local storage
    function deleteTodoItem(todoItem) {
        const isCompleted = todoItem.classList.contains("completed");
        elements.todoContainer.removeChild(todoItem);
        if (!isCompleted) {
            todoCount--;
            updateCounter(); 
        }
        saveTodosToLocalStorage();
    }

    // edit the todo item and saving it to local storage
    function editToDo(todoItem) {
        const paragraph = todoItem.querySelector("p");
        const current = todoItem.querySelector("p").textContent;
        const newText = prompt("Edit the To-Do Item", current);

        if (newText !== null) {
            paragraph.textContent = newText;
            saveTodosToLocalStorage();
        }
    }

    // save todos from the todo container to local storage in JSON format
    function saveTodosToLocalStorage() {
        const todos = Array.from(elements.todoContainer.children).map((todoItem) => {
            return {
                text: todoItem.querySelector("p").textContent,
                isCompleted: todoItem.classList.contains("completed"),
            };
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    function updateCounter() {
        elements.counter.textContent = todoCount;
    }

    const darkModeElement = document.querySelector(".icons:nth-child(2)"); 
    darkModeElement.addEventListener("click", toggleDarkMode);

    if (document.body.classList.contains("dark-mode")) {
        document.querySelector(".infoContainer").classList.add("dark-mode");
    }

    // darkmode, adjusting style of the todo app
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        
        if (document.body.classList.contains("dark-mode")) {
            document.querySelector(".infoContainer").classList.add("dark-mode");
        } else {
            document.querySelector(".infoContainer").classList.remove("dark-mode");
        }
    }

    const infoLink = document.querySelector(".icons:nth-child(1)"); 
    infoLink.addEventListener("click", openInfoPage);

    function openInfoPage() {
        window.location.href = "info.html";
    }
});