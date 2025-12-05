const taskList = document.getElementById("taskList")
const taskTemplate = document.getElementById("taskTemplate").content

function CreateTaskElement(title = "", desc = "", dateCreated = new Date().toLocaleString(), dateUpdated = new Date(), fileSize = '0 Mb', fileType = 'html') {
   const clonedTemplate = taskTemplate.cloneNode(true)
   const taskObject = clonedTemplate.children[0]
   const taskPanelElements = taskObject.children.task_panel.children
   taskPanelElements.title.innerHTML = title
   taskPanelElements.desc.children.value.innerHTML = desc
   taskPanelElements.creation_date.children.value.innerHTML = dateCreated
   taskPanelElements.update_date.children.value.innerHTML = dateUpdated
   taskPanelElements.file_size.children.value.innerHTML = fileSize

   switch (fileType) {
      case 'html' : taskObject.classList.add('task_object--html') 
      break
      case 'php' : taskObject.classList.add('task_object--php')
      break 
   }

   taskObject.addEventListener('click', () => {
      window.location.href = `/tasks/${title}`
   })
   
   return clonedTemplate
}

async function UpdateTasks() {
   const request = fetch(`/tasks`)
   const res = await request
   const data = await res.json()
   const tasks = data.tasks
   tasks.forEach((task) => {
      const request = fetch(`/tasks/${task.parentName}/data`)
      request.then((res) => {
         res.json().then((data) => {
            const desc = data.fileData.description
            const dateCreated = data.dateCreated
            const dateUpdated = data.dateUpdated
            const fileSize = data.size
            const fileType = task.name.split('.')[1]
            const newTask = CreateTaskElement(task.parentName,desc,dateCreated,dateUpdated,fileSize,fileType)
            taskList.appendChild(newTask)
         })
      })
   });
}

UpdateTasks()