function SpellBook() {
	this.spellList = [];
	this.addSpell = function(name, level, school) {
		if(name) {
			this.spellList.push(new Spell(name,level,school,false));
		}
		this.save();
	}
	this.removeSpell = function(name) {
		for(let i = 0; i < this.spellList.length; ++i) {
			if(this.spellList[i].name === name && !this.spellList[i].isFavorite) {
				this.spellList[i].remove();
				this.spellList.splice(i,1);
				return;
			}
		}
		this.save();
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
		app.save();
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

var app = new SpellBook(); //bluh

{
	const book = document.querySelector('main');
	//Dynamically add multiple spell categories
	for(let i = 1; i <= 9; ++i) {
		book.innerHTML += (`<div style="display:none"><span class="spellCategory">Level ${i} Spells</span>` +
		                   `<ul id=Level_${i}_spells></ul></div>`);  
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
}