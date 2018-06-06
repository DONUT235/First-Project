const qs = s => document.querySelector(s);
//Dynamically add multiple spell categories
(function() {
    const book = qs('main');
    for(let i = 1; i <= 9; ++i) {
      book.innerHTML += `<span class="spellCategory">Level ${i} Spells</span>`;
      book.innerHTML += `<ul id=Level_${i}_spells></ul>`;  
    }
})();

function Spell(name, level, school) {
    this.name = name;
    this.level = level;
    this.school = school;
    this.buildListItem = function() {
        const newItem = document.createElement('li');
        const list = qs(`#${this.level.replace(' ','_')}_spells`);
        console.log(list);
        list.appendChild(newItem);
        return newItem;
    }
    this.buildSpan = function() {
        const newSpan = document.createElement('span');
        newSpan.className = this.school;
        newSpan.textContent = this.name;
        return newSpan;
    }
    this.makeDomElement = function () {
        this.buildListItem().appendChild(this.buildSpan());
    }
}

qs('form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const gi = s => ev.target[s].value;
    new Spell(gi('spellName'),gi('spellLevel'),gi('spellSchool')).makeDomElement();
    ev.target.spellName.value = '';
    ev.target.spellName.focus();
});