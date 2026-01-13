const { exec } = require('child_process');
const { default: utils } = require('./utils');
utils.directory = __dirname
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3333;

app.use(express.static(__dirname));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/website/index.html'))
})

app.get('/tasks',(req,res) => {
    const tasks = utils.GetTasks()
    res.json({tasks})
})

app.get('/tasks/:taskName',(req,res) => {
    const task = utils.GetTask(req.params.taskName)
    if (task) utils.ExecuteTask(task,res)
})

app.get('/tasks/:taskName/code', (req,res) => {
    utils.OpenTaskInCode(res,req.params.taskName)
})

app.get('/tasks/:taskName/data', (req, res) => {
    const taskName = req.params.taskName
    res.json(utils.GetTaskData(taskName))
});

app.patch('/tasks/:taskName/data', (req,res) => {
    const taskName = req.params.taskName
    const query = req.query
    const newTitle = query.title
    const newDesc = query.desc 
    const task = utils.GetTask(taskName)
    if (task) {
        const dataFile = path.join(task.parentPath + `/data.json`)
        const taskDataExists = fs.existsSync(dataFile)
    
        if (newDesc || !taskDataExists) {
            fs.writeFileSync(dataFile,`{"description":${`"${newDesc}"` || "N/A"}}`)
        } 

        if (newTitle) {
            const newTitleDest = task.parentPath
            .split('\\')
            .slice(0,-1)
            .join('\\')
            console.log(newTitleDest,task.parentPath)
            fs.renameSync(task.parentPath,`${newTitleDest}\\${newTitle}`)
        }
        res.send(task)
    }
})

app.listen(port, () => {
    console.log(`TaskManager listening on port ${port}!`);
});