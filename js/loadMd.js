function loadMarkdown(path, id) {
    fetch(path)
        .then(res => res.text())
        .then(md => {
            let container = document.getElementById(id);
            container.innerHTML = marked.parse(md);

            container.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        })

        .catch(err => console.error(err));
}