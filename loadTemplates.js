function loadHTML(id, file) {
    console.log(id);
    return fetch(file)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}
loadHTML("contacts", "../template/contacts.html");
