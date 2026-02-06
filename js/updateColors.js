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

function hslToHex(h, s = 100, l = 50) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));

    return `#${[r, g, b].map(x =>
        x.toString(16).padStart(2, "0")
    ).join("")}`;
}

function updateColor(name) {
    console.log(name);
    let projectsData = loadJSON('/projects.json');

    const item = projectsData.find(o => o.name === name);

    console.log(item);

    let accent = item.accentColor

    document.body.style.setProperty(
        "--accent",
        `${accent}`
    );

    document.body.style.setProperty(
        "--nav-bg-color",
        `${hslToHex(accent)}`
    );

}