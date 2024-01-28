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

    function toggleDropdown(dropdownContent) {
        if (openDropdown && openDropdown !== dropdownContent) openDropdown.classList.remove("show");
        dropdownContent.classList.toggle("show");
        openDropdown = dropdownContent;
    }

    function closeDropdown() {
        if (openDropdown) openDropdown.classList.remove("show");
    }

    function createTodoItem(text, isCompleted = false) {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");

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

    function deleteTodoItem(todoItem) {
        const isCompleted = todoItem.classList.contains("completed");
        elements.todoContainer.removeChild(todoItem);
        if (!isCompleted) {
            todoCount--;
            updateCounter(); 
        }
        saveTodosToLocalStorage();
    }

    function editToDo(todoItem) {
        const paragraph = todoItem.querySelector("p");
        const current = todoItem.querySelector("p").textContent;
        const newText = prompt("Edit the To-Do Item", current);

        if (newText !== null) {
            paragraph.textContent = newText;
            saveTodosToLocalStorage();
        }
    }

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