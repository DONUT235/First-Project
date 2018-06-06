function SpellBook() {
	this.spellList = [];
	this.addSpell = function(name, level, school) {
		const newSpell = new Spell(name,level,school);
		newSpell.makeDomElement();
		this.spellList.push(newSpell);
	}
	this.removeSpell = function(name) {
		for(let i = 0; i < this.spellList.length; ++i) {
			if(this.spellList[i].name === name) {
				this.spellList[i].remove();
				this.spellList.splice(i,1);
				return;
			}
		}
	}

	this.save = function() {
		document.querySelector('#secretLoad').value = JSON.stringify(this.spellList);
	}
	this.load = function() {
		const hiddenArea = document.querySelector('#secretLoad');
		if(hiddenArea.style.display !== 'none') {
			if(this.spellList.length === 0) {
				const input = JSON.parse(hiddenArea.value);
				while(input.length > 0) {
					const loadedSpell = input.pop();
					console.log(loadedSpell);
					this.addSpell(loadedSpell.name, loadedSpell.level, loadedSpell.school);
				}
			}
			hiddenArea.style.display = 'none';
		} else {
			hiddenArea.style.display = 'block';
		}
	}
}

function Spell(name, level, school) {
	this.name = name;
	this.level = level;
	this.school = school;
	this.buildListItem = function() {
		const newItem = document.createElement('li');
		const list = document.querySelector(`#${this.level.replace(' ','_')}_spells`);
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
		this.li = this.buildListItem();
		this.li.appendChild(this.buildSpan());
	}
	this.remove = function() {
		this.li.remove();
	}
}


{
	const book = document.querySelector('main');
	//Dynamically add multiple spell categories
	for(let i = 1; i <= 9; ++i) {
		book.innerHTML += `<span class="spellCategory">Level ${i} Spells</span>`;
		book.innerHTML += `<ul id=Level_${i}_spells></ul>`;  
	}
	const app = new SpellBook();
	document.querySelector('#addForm').addEventListener('submit', ev => {
		ev.preventDefault();
		const gi = s => ev.target[s].value;
		app.addSpell(gi('spellName'),gi('spellLevel'),gi('spellSchool'));
		ev.target.spellName.value = '';
		ev.target.spellName.focus();
	});
	document.querySelector('#removeForm').addEventListener('submit', ev => {
		ev.preventDefault();
		app.removeSpell(ev.target.removeName.value);
		ev.target.removeName.value = '';
		ev.target.removeName.focus();
	});
	document.querySelector('#quill').addEventListener('click', ev => app.save());
	document.querySelector('#skull').addEventListener('click', ev => app.load());
	var spellBook = app.spellList;
}