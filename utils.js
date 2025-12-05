import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const utils = {
    directory : '',
    GetTasks : () => {
        const dir = path.join(utils.directory + '/tasks')
        const tasks = fs.readdirSync(dir,{withFileTypes: true, recursive: true}).filter((val) => val.name.includes('.php') || val.name.includes('.html'));
        tasks.map((task) => {
            task.parentName = null
        })
        return tasks
    },

    GetTask : (taskName) => {
        const tasks = utils.GetTasks()
        const task = tasks.find((val) => {
            const taskPath = val.parentPath
            const taskPathArray = taskPath.split('\\')
            const foundTaskName = taskPathArray[taskPath.split('\\').length - 1]
            return foundTaskName == taskName
        })

        return task, task.parentPath
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