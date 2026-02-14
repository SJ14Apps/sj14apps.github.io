let btns = document.getElementById("versions-type").children;
let versionsContainer = document.getElementById("versions-container");

function versionType(id, path) {
    for (let i = 0;  i < btns.length; i++) {
        btns[i].classList.remove("active");
    }
    btns[id].classList.add("active");

    if (path === undefined) {
        versionsContainer.setAttribute("srcData",`${pageName}`)
    }else versionsContainer.setAttribute("srcData",`${pageName}/${path}`)
    displayVersions()

}