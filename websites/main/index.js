const taskList = document.getElementById("taskList")
const taskTemplate = document.getElementById("taskTemplate").content

function CreateTaskElement(title = "", desc = "", dateCreated = new Date().toLocaleString(), dateUpdated = new Date(), fileSize = '0 Mb', fileType = 'html', path) {
   const clonedTemplate = taskTemplate.cloneNode(true)
   const taskObject = clonedTemplate.children[0]
   const mouseGradient = taskObject.children['mouse_gradient']
   const taskPanelElements = taskObject.children.task_panel.children
   const titleChildren = taskPanelElements.title.children
   titleChildren.value.innerHTML = title
   titleChildren.directory.innerHTML = path
   titleChildren.file_icon.src = `/assets/images/${fileType}.png`
   taskPanelElements.desc.children.value.innerHTML = desc
   taskPanelElements.creation_date.children.value.innerHTML = dateCreated
   taskPanelElements.update_date.children.value.innerHTML = dateUpdated
   taskPanelElements.file_size.children.value.innerHTML = fileSize
   taskObject.classList.add(`task_object--${fileType}`)

   taskObject.addEventListener('click', () => window.open(`/tasks/${title}`))
   taskObject.addEventListener('mousemove', (e) => {
      const gradientRect = taskObject.getBoundingClientRect()
      const x = e.clientX - gradientRect.left
      mouseGradient.style.setProperty('--x',`${x}px`)
      mouseGradient.style.opacity = 1
   })
   taskObject.addEventListener('mouseleave', () => {
      mouseGradient.style.opacity = 0
   })
   
   return clonedTemplate
}

async function UpdateTasks() {
   const request = fetch(`/tasks`)
   const res = await request
   const data = await res.json()
   const tasks = data.tasks
   console.log(tasks)
   tasks.forEach((task) => {
      const request = fetch(`/tasks/${task.parentName}/data`)
      request.then((res) => {
         res.json().then((data) => {
            const desc = data.fileData.description
            const dateCreated = data.dateCreated
            const dateUpdated = data.dateUpdated
            const fileSize = data.size
            const fileType = task.name.split('.')[1]
            const path = `${data.parentPath}\\${task.name}`.replaceAll('\\','/')
            const newTask = CreateTaskElement(task.parentName,desc,dateCreated,dateUpdated,fileSize,fileType,path)
            taskList.appendChild(newTask)
         })
      })
   });
}

UpdateTasks()