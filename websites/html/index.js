const taskList = document.getElementById("taskList")
const taskTemplate = document.getElementById("taskTemplate").content
const directory = 'html'

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
   const request = fetch(`${directory}/tasks`)
   const res = await request
   const data = await res.json()
   const files = data.files
   files.forEach(taskName => {
      const request = fetch(`${directory}/tasks/${taskName}/data`)
      request.then((res) => {
         res.json().then((data) => {
            const desc = data.description
            const newTask = CreateTaskElement(taskName,desc)
            taskList.appendChild(newTask)
         })
      })
   });
}

UpdateTasks()