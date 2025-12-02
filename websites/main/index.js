const fetchTestElement = document.getElementById("fetchtest")
const data = fetch('html/tasks')
data.then((res) => {
   res.json().then((data) => {
    console.log(data.files)
   })
})