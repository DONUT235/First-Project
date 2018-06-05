let qs = document.querySelector.bind(document);
/*qs('#h2btn').addEventListener('click', () => {
    qs('#heading2').textContent = 'Different Text!';
});*/
qs('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const textInput = e.target.spellName;
    qs('#spells').innerHTML += `<li>${textInput.value}</li>`;
    textInput.value = '';
});