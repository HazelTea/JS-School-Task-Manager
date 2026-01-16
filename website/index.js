const taskList = document.getElementById("taskList")
const taskTemplate = document.getElementById("taskTemplate").content
const searchBar = document.getElementById("search_bar")
const searchTimer = 250

function ApplyGradientInteraction(taskObject,mouseGradient, e) {
   const gradientRect = taskObject.getBoundingClientRect()
   const x = e.clientX - gradientRect.left
   mouseGradient.style.setProperty('--x',`${x}px`)
   mouseGradient.style.opacity = 1
}

function CreateTaskElement(task, data) {
   const title = task.parentName
   const desc = data.innerData.description
   const dateCreated = data.dateCreated
   const dateUpdated = data.dateUpdated
   const fileSize = data.size
   const fileType = task.name.split('.')[1]
   const path = `${data.parentPath}\\${task.name}`.replaceAll('\\','/')
   
   const clonedTemplate = taskTemplate.cloneNode(true)
   const taskObject = clonedTemplate.children[0]
   const taskObjectElements = taskObject.children
   const mouseGradient = taskObjectElements.mouse_gradient
   const taskPanel = taskObjectElements.task_panel
   const taskPanelElements = taskPanel.children
   const sidePanel = taskObjectElements.side_panel
   const sidePanelElements = sidePanel.children
   const taskPanelEditButton = sidePanelElements.edit_button
   const taskPanelCodeButton = sidePanelElements.code_button

   const titleChildren = taskPanelElements.title.children

   titleChildren.value.innerHTML = title
   titleChildren.directory.innerHTML = path
   sidePanelElements.file_icon.src = `/assets/images/${fileType}.png`
   taskPanelElements.desc.children.value.innerHTML = desc
   taskPanelElements.creation_date.children.value.innerHTML = dateCreated
   taskPanelElements.update_date.children.value.innerHTML = dateUpdated
   taskPanelElements.file_size.children.value.innerHTML = fileSize
   taskObject.classList.add(`task_object--${fileType}`)

   taskPanel.addEventListener('click', () => window.open(`/tasks/${title}`))
   taskObject.addEventListener('mousemove', (e) => {ApplyGradientInteraction(taskObject,mouseGradient,e)})
   taskObject.addEventListener('mouseleave', () => {mouseGradient.style.opacity = 0})
   taskObject.addEventListener('mouseenter', () => {mouseGradient.style.opacity = 1})
   taskPanelCodeButton.addEventListener('click', () => {fetch(`/tasks/${title}/code`)})
   return clonedTemplate
}

function SortTasksByData(taskList,dataType,sortSign = 1) {
   return taskList.sort((task1,task2) => {
      const var1 = task1.data[dataType]
      const var2 = task2.data[dataType]
      if (var1 < var2) {return 1 * sortSign}
      if (var1 > var2) {return -1 * sortSign}
      return 0
   })
}

async function AddTaskElements(sortArgs) {
   const request = fetch(`/tasks?show_data=true`)
   const res = await request
   const tasksData = await res.json()
   const tasks = tasksData.tasks
   const searchInput = searchBar.value
   const sortedTasks = SortTasksByData(tasks,sortArgs.dataType,sortArgs.sortSign)
   sortedTasks.forEach((task) => {
      if (task.parentName.toLowerCase().match(searchInput)) {
         const data = task.data
         const newTask = CreateTaskElement(task,data)
         taskList.appendChild(newTask)
      }
   })
}

function RemoveTaskElements() {
   while (taskList.firstChild) { 
    taskList.firstChild.remove(); 
   }
}

async function UpdateTasks(sortArgs) {
   RemoveTaskElements()
   AddTaskElements(sortArgs)
}

let typingTimer;
let typingStarted = false

function Search() {
  clearTimeout(typingTimer);
  if (!typingStarted) taskList.classList.add('task_list--searching')
  typingStarted = true
  typingTimer = setTimeout(() => {
    taskList.classList.remove('task_list--searching')
    UpdateTasks({dataType: 'dateCreated', sortSign: 1})
    typingStarted = false;
  }, searchTimer);
}

searchBar.addEventListener("input", Search);
UpdateTasks({dataType: 'dateCreated', sortSign: 1})