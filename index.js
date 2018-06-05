const qs = s => document.querySelector(s);
/*qs('#h2btn').addEventListener('click', () => {
    qs('#heading2').textContent = 'Different Text!';
});*/
//Dynamically add multiple spell categories
(function() {
    const book = qs('main');
    for(let i = 1; i <= 9; ++i) {
      book.innerHTML += `<span class="spellCategory">Level ${i} Spells</span>`
      book.innerHTML += `<ul id=Level_${i}_spells></ul>`  
    }
})();


function buildListItem(level) {
    const newItem = document.createElement('li');
    const list = qs(`#${level.replace(' ','_')}_spells`);
    list.appendChild(newItem);
    console.log(list);
    return newItem;
}

function buildSpan(name, school, listItem) {
    const newSpan = document.createElement('span');
    newSpan.className = school;
    newSpan.textContent = name;
    listItem.appendChild(newSpan);
}

qs('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const gi = s => e.target[s].value;
    buildSpan(gi('spellName'),gi('spellSchool'),buildListItem(gi('spellLevel')));
});