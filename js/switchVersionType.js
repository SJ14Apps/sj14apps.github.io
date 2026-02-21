let btns = document.getElementById("versions-type").children;

function versionType(id, path) {
    for (let i = 0;  i < btns.length; i++) {
        btns[i].classList.remove("active");
    }
    btns[id].classList.add("active");

    if (path === undefined) {
        changelogsPath = pageName;
    }else changelogsPath = `${pageName}/${path}`
    displayVersions()

}
