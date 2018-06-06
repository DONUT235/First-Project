function SpellBook() {
	this.spellList = [];
	this.addSpell = function(name, level, school) {
		const newSpell = new Spell(name,level,school);
		newSpell.makeDomElement();
		app.spellList.push(newSpell);
	}
}

function Spell(name, level, school) {
	this.name = name;
	this.level = level;
	this.school = school;
	this.buildListItem = function() {
		const newItem = document.createElement('li');
		const list = document.querySelector(`#${this.level.replace(' ','_')}_spells`);
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


(function () {
	const book = document.querySelector('main');
	//Dynamically add multiple spell categories
	for(let i = 1; i <= 9; ++i) {
		book.innerHTML += `<span class="spellCategory">Level ${i} Spells</span>`;
		book.innerHTML += `<ul id=Level_${i}_spells></ul>`;  
	}
	const app = new SpellBook();
	document.querySelector('#addForm').addEventListener('submit', (ev) => {
		ev.preventDefault();
		const gi = s => ev.target[s].value;
		app.addSpell(gi('spellName'),gi('spellLevel'),gi('spellSchool'));
		ev.target.spellName.value = '';
		ev.target.spellName.focus();
	});
})();