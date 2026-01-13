const taskList = document.getElementById("taskList")
const taskTemplate = document.getElementById("taskTemplate").content

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
   const mouseGradient = taskObject.children['mouse_gradient']
   const sidePanel = taskObject.children.side_panel
   const taskPanel = taskObject.children.task_panel
   const taskPanelElements = taskPanel.children
   const titleChildren = taskPanelElements.title.children

   titleChildren.value.innerHTML = title
   titleChildren.directory.innerHTML = path
   sidePanel.children.file_icon.src = `/assets/images/${fileType}.png`
   taskPanelElements.desc.children.value.innerHTML = desc
   taskPanelElements.creation_date.children.value.innerHTML = dateCreated
   taskPanelElements.update_date.children.value.innerHTML = dateUpdated
   taskPanelElements.file_size.children.value.innerHTML = fileSize
   taskObject.classList.add(`task_object--${fileType}`)

   taskPanel.addEventListener('click', () => window.open(`/tasks/${title}`))
   taskObject.addEventListener('mousemove', (e) => {ApplyGradientInteraction(taskObject,mouseGradient,e)})
   taskObject.addEventListener('mouseleave', () => {mouseGradient.style.opacity = 0})
   taskObject.addEventListener('mouseenter', () => {mouseGradient.style.opacity = 1})
   
   return clonedTemplate
}

async function UpdateTasks() {
   const request = fetch(`/tasks?showData=true`)
   const res = await request
   const tasksData = await res.json()
   const tasks = tasksData.tasks
   const sortedTasksByDate = tasks.sort((task1,task2) => {
      const date1 = task1.data.dateCreated
      const date2 = task2.data.dateCreated
      if (date1 < date2) {return 1}
      if (date1 > date2) {return -1}
      return 0
   })
   
   sortedTasksByDate.forEach((task) => {
      const data = task.data
      const newTask = CreateTaskElement(task,data)
      taskList.appendChild(newTask)
   })
}

UpdateTasks()