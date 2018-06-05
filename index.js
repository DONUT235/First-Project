let qs = document.querySelector.bind(document);
/*qs('#h2btn').addEventListener('click', () => {
    qs('#heading2').textContent = 'Different Text!';
});*/
qs('#h1frm').addEventListener('submit', (e) => {
    e.preventDefault();
    const textInput = e.target.textInput;
    qs('#spells').innerHTML += textInput.value + '<br />';
    textInput.value = '';
});