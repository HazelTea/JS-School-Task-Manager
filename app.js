const { exec } = require('child_process');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const app = express();
const port = 3333;
const phpDirectory = "/tasks/php/"
const htmlDirectory = "/tasks/html/"

app.use(express.static(__dirname));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/websites/main/index.html'))
})

app.get('/tasks',(req,res) => {
    const dir = path.join(__dirname + '/tasks')
    const files = fs.readdirSync(dir,{withFileTypes: true, recursive: true}).filter((val) => val.name.includes('.php'));
    res.json({files})
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

app.get('/html/tasks', (req,res) => {
    const files = fs.readdirSync(path.join(__dirname + htmlDirectory));
    res.json({files})
})

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