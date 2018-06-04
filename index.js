let qs = document.querySelector.bind(document);
qs('#h2btn').addEventListener('click', () => {
    qs('#heading2').textContent = 'Different Text!';
});
qs('#h1frm').addEventListener('submit', (e) => {
    e.preventDefault();
    qs('#heading1').textContent = qs('input[name=textInput]').value;
});