const taskList = document.getElementById("taskList")
const taskTemplate = document.getElementById("taskTemplate").content

function CreateTaskElement(title = "", desc = "", dateCreated = new Date(), dateUpdated = new Date(), fileSize = '0 Mb') {
   const clonedTemplate = taskTemplate.cloneNode(true)
   const taskObject = clonedTemplate.children[0]
   const taskPanelElements = taskObject.children.task_panel.children
   taskPanelElements.title.innerHTML = title
   taskPanelElements.desc.children.value.innerHTML = desc
   taskPanelElements.creation_date.children.value.innerHTML = dateCreated.toUTCString()
   taskPanelElements.update_date.children.value.innerHTML = dateUpdated.toUTCString()
   taskPanelElements.file_size.children.value.innerHTML = fileSize
   return clonedTemplate
}

async function UpdateTasks() {
   const request = fetch(`/tasks`)
   const res = await request
   const data = await res.json()
   const tasks = data.tasks
   tasks.forEach((task) => {
      const request = fetch(`/tasks/${task.name}/data`)
      request.then((res) => {
         res.json().then((data) => {
            console.log(data)
            const desc = data.description
            const newTask = CreateTaskElement(task.name,desc)
            taskList.appendChild(newTask)
         })
      })
   });
}

UpdateTasks()