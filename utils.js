import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

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

    ExecutePhpFile : (dir,res) => {
        exec(`C:\\xampp\\php\\php ${dir}`, (error, stdout, stderr) => {
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
    }
}

export default utils