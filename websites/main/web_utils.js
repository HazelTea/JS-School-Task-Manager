const webUtils = {
    reactToMouse : (event,main,interaction) => {
    const background = main.children["background"]
    const gradient = background.children["mouseGradient"]
    const rect = background.getBoundingClientRect()
    const x = event.clientX - (rect.left + rect.width / 2)
    const y = event.clientY - (rect.top + rect.height / 2) 

    switch (interaction) {
        case "moving":
            background.style.transform = `rotateX(${-y / 7}deg) rotateY(${x / 7}deg)`
            if (gradient.style.display != "block") gradient.style.display = "block" 
            if (background.style.transition != "transform 0.1s") background.style.transition = "transform 0.1s"
            break

        case "leaving":
            background.style.transition = "transform 0.5s"
            background.style.transform = `rotateX(0deg) rotateY(0deg)`
            break
        }
    }
}

export default webUtils