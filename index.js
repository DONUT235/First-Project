function SpellBook() {
	this.spellList = [];
	this.addSpell = function(name, level, school) {
		this.spellList.push(new Spell(name,level,school));
	}
	this.removeSpell = function(name) {
		for(let i = 0; i < this.spellList.length; ++i) {
			if(this.spellList[i].name === name && !this.spellList[i].isFavorite) {
				this.spellList[i].remove();
				this.spellList.splice(i,1);
				return;
			}
		}
	}

	//TODO: Make save/load interface
	this.save = function() {	
	}
	this.load = function() {
	}
}

function Spell(name, level, school) {
	this.name = name;
	this.level = level;
	this.school = school;
	this.isFavorite = false; /*spells which are favorites may not be deleted, and are
	preserved when a JSON list is loaded */
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
	}
	this.buildFavButton = function() {
		this.favButton = document.createElement('img');
		this.favButton.src = 'unfilled_star.png';
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
	this.buildListItem();
	this.li.appendChild(this.buildSpan());
	this.buildFavButton();
	this.li.appendChild(this.favButton);
}


{
	const book = document.querySelector('main');
	//Dynamically add multiple spell categories
	for(let i = 1; i <= 9; ++i) {
		book.innerHTML += (`<div style="display:none"><span class="spellCategory">Level ${i} Spells</span>` +
		                   `<ul id=Level_${i}_spells></ul></div>`);  
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
	var spellBook = app.spellList;
}