import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const phpPaths = [
    "C:\\xampp\\php\\php.exe",
    "C:\\php\\php.exe",
    "D:\\php\\php.exe",
    "php",
]

console.log(fs.existsSync("D:\\php\\php.exe"),phpPaths[2])

function GetPHPPath() {
    return phpPaths.find((phpPath) => fs.existsSync(phpPath))
}

const utils = {
    directory : '',
    GetTasks : () => {
        const dir = path.join(utils.directory + '/tasks')
        const tasks = fs.readdirSync(dir,{withFileTypes: true, recursive: true}).filter((val) => val.name.includes('.php') || val.name.includes('.html'));
        tasks.map((task) => {
            task.parentName = task.parentPath.split('\\').at(-1)
        })
        return tasks
    },

    GetTask : (taskName) => {
        const tasks = utils.GetTasks()
        const task = tasks.find((val) => {
            const taskPath = val.parentPath
            const foundTaskName = taskPath.split('\\').at(-1)
            return foundTaskName == taskName
        })

        return task
    },

    GetTaskData : (taskName) => {
        const task = utils.GetTask(taskName)
        if (task) {
            const dataFile = path.join(task.parentPath + `/data.json`)
            const taskDataExists = fs.existsSync(dataFile)
        
            if (!taskDataExists) {
                fs.writeFileSync(dataFile,'{"description":"N/A"}')
            } 
        
            const readFile = fs.readFileSync(dataFile)
            const taskStats = fs.statSync(dataFile)
            const innerData = JSON.parse(readFile.toString())
            const size = `${utils.GetTaskSize(taskName)} B`
            const dateCreated = taskStats.birthtime.toLocaleString()
            const dateUpdated = taskStats.mtime.toLocaleString()
            const parentPath = task.parentPath
            return ({innerData,size,dateCreated,dateUpdated,parentPath})
    
        } else return error(`No task found with the name: ${taskName}.`)
    },

    UpdateTask: (properties) => {
        
    },

    GetTaskSize : (taskName) => {
        const task = utils.GetTask(taskName)
        const files = fs.readdirSync(task.parentPath,{withFileTypes:true})
        let total = 0

        for (const file of files) {
            const filePath = path.join(file.parentPath + '\\' + file.name);
            total += fs.statSync(filePath).size;
        }

        return total;

    },

    OpenTaskInCode : (res,taskName) => {
        const task = utils.GetTask(taskName)
        exec(`code ${task.parentPath}`, (error, stdout, stderr) => {
            if (error) {
            console.error(`Error: ${error.message}`);
            return;
            }
            if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
            }
            res.send(stdout)
        });
    },

    ExecuteTask : (task,res) => {
        const completeDir = task.parentPath + `\\${task.name}`
        // const phpPath = GetPHPPath()
        // if (!phpPath) return;
        exec(`${GetPHPPath()} "${completeDir}"`, (error, stdout, stderr) => {
            if (error) {
            console.error(`Error: ${error.message}`);
            return;
            }
            if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
            }

            const dir = path.join(utils.directory)

            const baseDir = task.parentPath
            .replace(dir,'')
            .replaceAll('\\','/')

            const output = stdout
            .replaceAll("'",'"')
            .replaceAll('href="',`href="${baseDir}/`)
            .replaceAll('src="',`src="${baseDir}/`)
            res.send(output)
        });
    },
}

export default utils