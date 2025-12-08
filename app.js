const { exec } = require('child_process');
const { default: utils } = require('./utils');
utils.directory = __dirname
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3333;
const phpDirectory = "/tasks/php/"
const htmlDirectory = "/tasks/html/"

app.use(express.static(__dirname));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/websites/main/index.html'))
})

app.get('/tasks',(req,res) => {
    const tasks = utils.GetTasks()
    res.json({tasks})
})

app.get('/tasks/:taskName',(req,res) => {
    const task = utils.GetTask(req.params.taskName)
    if (task) {
        const extension = task.name.split('.')[1]
        const completeDir = task.parentPath + `\\${task.name}`
        switch (extension) {
            case 'php':
                utils.ExecutePhpFile(completeDir,res)
            break
    
            case 'html':
                res.sendFile(completeDir)
            break    
        }
    }
})

app.get('/php',(req,res) => {
    res.sendFile(path.join(__dirname + '/websites/php/index.html'))
})

app.get('/html',(req,res) => {
    res.sendFile(path.join(__dirname + '/websites/html/index.html'))
})

app.get('/php/tasks', (req,res) => {
    const files = fs.readdirSync(path.join(__dirname + phpDirectory));
    res.json({files})
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
        const fileData = JSON.parse(readFile.toString())
        const taskStats = fs.statSync(dataFile)
        const size = `${utils.GetTaskSize(taskName)} B`
        const dateCreated = taskStats.birthtime.toLocaleString()
        const dateUpdated = taskStats.mtime.toLocaleString()
        const parentPath = task.parentPath
        res.json({fileData,size,dateCreated,dateUpdated,parentPath})

    } else res.send(error(`No task found with the name: ${taskName}.`))
});

/// OLD CODE

app.get('/html/tasks', (req,res) => {
    const files = fs.readdirSync(path.join(__dirname + htmlDirectory));
    res.json({files})
})

app.get('/php/tasks/:taskName', (req, res) => {
    const taskName = req.params.taskName

    exec(`php ${path.join(__dirname + phpDirectory + taskName + '/index.php')}`, (error, stdout, stderr) => {
        if (error) {
        console.error(`Error: ${error.message}`);
        return;
        }
        if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
        }
        res.send(stdout);
    });
});

app.get('/html/tasks/:taskName', (req, res) => {
    const taskName = req.params.taskName
    res.sendFile(path.join(__dirname + htmlDirectory + taskName + '/index.html'))
});

app.get('/html/tasks/:taskName/data', (req, res) => {
    const taskName = req.params.taskName
    const fileDirectory = path.join(__dirname + `/tasks/html/${taskName}/data.json`)
    const fileTaskDirectory = path.join(__dirname + `/tasks/html/${taskName}`)
    const taskExists = fs.existsSync(fileTaskDirectory)
    const taskDataExists = fs.existsSync(fileDirectory)

    if (!taskDataExists && taskExists) {
        fs.writeFileSync(fileDirectory,'{"description":"N/A"}')
    } else if (!taskExists) {res.send(error(`No task found with the name: ${taskName}.`)); return}

    const readFile = fs.readFileSync(fileDirectory)
    const data = JSON.parse(readFile.toString())
    res.json(data)

});

app.post('/html/tasks/:taskName/data', (req, res) => {
    const query = req.query
    const taskName = req.params.taskName
    const fileDirectory = path.join(__dirname + `/tasks/html/${taskName}/data.json`)
    const fileTaskDirectory = path.join(__dirname + `/tasks/html/${taskName}`)
    const taskExists = fs.existsSync(fileTaskDirectory)
    const taskDataExists = fs.existsSync(fileDirectory)

    if (!taskDataExists && taskExists) {
        fs.writeFileSync(fileDirectory,'{"description":"N/A"}')
    } else if (!taskExists) {res.send(error(`No task found with the name: ${taskName}.`)); return}

    const readFile = fs.readFileSync(fileDirectory)
    const newData = JSON.parse(readFile.toString())
    for (const property in newData) newData[property] = query[property] || newData[property]
    fs.writeFileSync(fileDirectory,JSON.stringify(newData))

    res.json(true)
});



app.listen(port, () => {
    console.log(`TaskManager listening on port ${port}!`);
});