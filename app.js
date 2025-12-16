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

app.get('/tasks/:taskName/open', (req,res) => {
    utils.OpenTaskInCode(res,req.params.taskName)
})

app.get('/tasks/:taskName/data', (req, res) => {
    const taskName = req.params.taskName
    const task = utils.GetTask(taskName)
    if (task) {
        const dataFile = path.join(task.parentPath + `/data.json`)
        const taskDataExists = fs.existsSync(dataFile)
    
        if (!taskDataExists) {
            fs.writeFileSync(dataFile,'{"description":"N/A"}')
        } 
    
        const readFile = fs.readFileSync(dataFile)
        const taskStats = fs.statSync(dataFile)
        const fileData = JSON.parse(readFile.toString())
        const size = `${utils.GetTaskSize(taskName)} B`
        const dateCreated = taskStats.birthtime.toLocaleString()
        const dateUpdated = taskStats.mtime.toLocaleString()
        const parentPath = task.parentPath
        res.json({fileData,size,dateCreated,dateUpdated,parentPath})

    } else res.send(error(`No task found with the name: ${taskName}.`))
});

app.listen(port, () => {
    console.log(`TaskManager listening on port ${port}!`);
});