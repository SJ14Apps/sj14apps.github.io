let changelogsContainer = document.getElementById('versions-container')
let screenshotsContainer = document.getElementById('screenshots-container')

function loadJSON(filePath) {
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', filePath, false);
    xhr.send(null);
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Error loading JSON:', xhr.status);
        return null;
    }
}

function displayVersions() {
    changelogsContainer.innerHTML = '';

    let data = loadJSON(changelogsPath + '/changelogs.json');
    data.forEach(l => {

        let changelog = document.createElement('div')
        changelog.classList.add('corner')
        let title = document.createElement('h3')
        title.textContent = l.title
        let log = document.createElement('pre')
        let header = document.createElement('span')
        header.textContent = 'Changelog:'
        header.style.fontSize = '17px'
        let code = document.createElement('code')
        code.textContent = l.changelog.replaceAll(' ', '  ');
        downloadBtn = document.createElement('a')
        downloadBtn.textContent = 'Download'
        downloadBtn.href = './' + changelogsPath + '/versions/' + l.file
        let timestamp = document.createElement('span')
        timestamp.textContent = new Date(l.timestamp).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });  
        log.appendChild(header)
        log.appendChild(document.createTextNode("\n\n"))
        log.appendChild(code)
        changelog.appendChild(title) 
        if (l.timestamp !== undefined)
            changelog.appendChild(timestamp)
        changelog.appendChild(log)
        if (l.file !== undefined)
            changelog.appendChild(downloadBtn)

        changelogsContainer.appendChild(changelog)

    })
}

function displayScreenShots() {
    screenshotsContainer.innerHTML = '';
    if (typeof screenshots === 'undefined' || !screenshots || screenshots.length === 0)
        return;

    screenshots.forEach((value, index) => {
        let a = document.createElement('a')
        let img = document.createElement('img')

        a.href = value.src;
        a.setAttribute('data-index', index);
        a.setAttribute('aria-label', `View screenshot ${index + 1}`);
        img.src = value.src;
        img.alt = value.alt || `Screenshot ${index + 1}`;
        img.classList.add("corner");
        if (value.width)
            img.width = value.width;
        a.appendChild(img);

        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof openGallery === 'function') {
                openGallery(index);
            }
        });

        screenshotsContainer.appendChild(a);
    })

    if (typeof initGallery === 'function') {
        initGallery(screenshots);
    } else {
        let script = document.createElement('script');
        script.src = '/js/gallery.js';
        script.onload = () => {
            if (typeof initGallery === 'function') {
                initGallery(screenshots);
            }
        };
        document.body.appendChild(script);
    }
}

changelogsPath = pageName;
displayVersions()



if (screenshotsContainer){
    displayScreenShots()
}
