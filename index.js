function SpellBook() {
	this.spellList = [];
	this.selectedSpell = null;
	this.addSpell = function(name, level, school) {
		if(name) {
			const newSpell = new Spell(name,level,school,false);
			this.spellList.push(newSpell);
			//newSpell.li.addEventHandler('mousedown'
		}
		this.save();
	}
	this.removeSpell = function(name) {
		for(let i = 0; i < this.spellList.length; ++i) {
			if(this.spellList[i].name === name && !this.spellList[i].isFavorite) {
				this.spellList[i].remove();
				this.spellList.splice(i,1);
				this.save();
				return;
			}
		}
	}

	//TODO: Make save/load interface
	this.save = function() {
		localStorage.setItem('list',JSON.stringify(this.spellList));
	}
	this.load = function() {
		let prevData = localStorage.getItem('list');
		if(prevData) {
			prevData = JSON.parse(prevData);
			for(let spell of prevData) {
				console.log(spell);
				this.spellList.push(new Spell(spell.name,spell.level,spell.school,spell.isFavorite))
			}
		}
	}
}

function Spell(name, level, school, isFavorite) {
	this.name = name;
	this.level = level;
	this.school = school;
	this.isFavorite = isFavorite; /*spells which are favorites may not be deleted*/
	this.buildListItem = function() {
		this.li = document.createElement('li');
		const list = document.querySelector(`#${this.level.replace(' ','_')}_spells`);
		if(list.parentNode.style.display === 'none') {
			list.parentNode.style.display = "block";
		}
		list.appendChild(this.li);
	}
	this.buildSpan = function() {
		const newSpan = document.createElement('span');
		newSpan.className = this.school;
		newSpan.textContent = this.name;
		return newSpan;
	}
	this.toggleFavorite = function() {
		this.isFavorite = !this.isFavorite;
		if(this.isFavorite) {
			this.favButton.src = 'filled_star.png';
		} else {
			this.favButton.src = 'unfilled_star.png';
		}
		save();
	}
	this.buildFavButton = function() {
		this.favButton = document.createElement('img');
		this.favButton.src = this.isFavorite ? 'filled_star.png' : 'unfilled_star.png';
		this.favButton.addEventListener('click', () => {
			this.toggleFavorite();
		})
		this.favButton.className = 'favButton'
	}
	this.remove = function() {
		const ul = this.li.parentNode;
		ul.removeChild(this.li);
		if(ul.childNodes.length === 0) {
			ul.parentNode.style.display = 'none';
		}
	}
	this.toJSON = function() {
		return {name: this.name, level: this.level, school: this.school, isFavorite: this.isFavorite};
	}
	this.buildListItem();
	this.li.appendChild(this.buildSpan());
	this.buildFavButton();
	this.li.appendChild(this.favButton);
}

var save; //bluh

{
	//Dynamically add multiple spell categories
	const book = document.querySelector('main');
	const levelList = ['Cantrip'];
	const app = new SpellBook();
	for(let i = 1; i <= 9; ++i) {
		levelList.push(`Level ${i}`);
	}
	for(let level of levelList) {
		const ul = document.createElement('ul');
		ul.id = level.replace(' ','_')+'_spells';
		const categorySpan = document.createElement('span');
		categorySpan.className = 'spellCategory';
		categorySpan.textContent = level==='Cantrip'?level+'s':level+' Spells';
		const div = document.createElement('div');
		div.style.display = 'none';
		ul.appendChild(categorySpan);
		div.appendChild(ul);
		book.appendChild(div);
	}
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
	app.load();
	save = ()=>app.save();
}
