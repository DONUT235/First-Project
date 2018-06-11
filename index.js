function SpellBook() {
	this.spellList = [];
	this.selectedSpell = null;
	this.addSpell = function(name, level, school) {
		if(name) {
			const newSpell = new Spell(name,level,school,false);
			this.spellList.push(newSpell);
		}
		this.save();
	};
	this.removeSpell = function(name) {
		for(let i = 0; i < this.spellList.length; ++i) {
			if(this.spellList[i].name === name && !this.spellList[i].isFavorite) {
				this.spellList[i].remove();
				this.spellList.splice(i,1);
				this.save();
				return;
			}
		}
	};

	//TODO: Make save/load interface
	this.save = function() {
		localStorage.setItem('list',JSON.stringify(this.spellList));
	};
	this.load = function() {
		let prevData = localStorage.getItem('list');
		if(prevData) {
			prevData = JSON.parse(prevData);
			for(let spell of prevData) {
				this.spellList.push(new Spell(spell.name,spell.level,spell.school,spell.isFavorite))
			}
		}
	};
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
	};
	this.buildSpan = function() {
		const newSpan = document.createElement('span');
		newSpan.className = this.school;
		newSpan.textContent = this.name;
		return newSpan;
	};
	this.toggleFavorite = function() {
		this.isFavorite = !this.isFavorite;
		if(this.isFavorite) {
			this.favButton.src = 'filled_star.png';
		} else {
			this.favButton.src = 'unfilled_star.png';
		}
		save();
	};
	this.buildFavButton = function() {
		this.favButton = document.createElement('img');
		this.favButton.src = this.isFavorite ? 'filled_star.png' : 'unfilled_star.png';
		this.favButton.addEventListener('click', () => {
			this.toggleFavorite();
		})
		this.favButton.className = 'favButton'
	};
	this.remove = function() {
		const ul = this.li.parentNode;
		ul.removeChild(this.li);
		if(ul.childNodes.length === 0) {
			ul.parentNode.style.display = 'none';
		}
	};
	this.toJSON = function() {
		return {name: this.name, level: this.level, school: this.school, isFavorite: this.isFavorite};
	};
	this.buildListItem();
	this.li.appendChild(this.buildSpan());
	this.buildFavButton();
	this.li.appendChild(this.favButton);
}

function SlotList() {
	this.levels = [];
	this.setMax = function(level, newValue) {
		let baseCase = true;
		if(newValue >= 0) {
			this.levels[level].maxSlots = newValue;
			this.levels[level].form.maxSlots.value = newValue.toString();
			if(this.levels[level].slotsLeft > newValue) {
				this.setCurrent(level,newValue);
			}
		}
		if(level > 0 && newValue > 0) {
			if(this.levels[level-1].maxSlots <= 0) {
				this.setMax(level-1,1);
				baseCase = false;
			}
		}
		else if(level < 8 && newValue == 0) {
			if(this.levels[level+1].maxSlots > 0) {
				this.setMax(level+1,0);
				baseCase = false;
			}
		} 
		if(baseCase) {
			this.save();
		}
	};
	this.setCurrent = function(level, newValue) {
		if(newValue >= 0 && newValue <= this.levels[level].maxSlots) {
			this.levels[level].slotsLeft = newValue;
			this.levels[level].leftSpan.textContent = newValue.toString();
			this.save();
		}
	};
	this.makeHandlers = function(level) {
		this.levels[level].form.addEventListener('submit',
			ev => ev.preventDefault());
		this.levels[level].form.maxSlots.addEventListener('input',
			ev => this.setMax(level,parseInt(ev.target.value)));
		this.levels[level].form.castButton.addEventListener('click',
			ev => this.setCurrent(level,this.levels[level].slotsLeft-1));
		this.levels[level].form.restoreButton.addEventListener('click',
			ev => this.setCurrent(level,this.levels[level].slotsLeft+1));
	}
	const formTemplate = document.querySelector('.template.slotForm');
	const restButton = formTemplate.parentNode.querySelector('#restButton');
	for(let i = 0; i < 9; ++i) {
		const newLevel = {};
		this.levels[i] = newLevel;
		newLevel.slotsLeft = 0;
		newLevel.maxSlots=0;
		//make a DOM element for each level
		this.levels[i].form = formTemplate.cloneNode(true);
		this.levels[i].form.className = 'slotForm';
		this.levels[i].leftSpan = this.levels[i].form.querySelector('.slotsLeft');
		this.levels[i].form.insertBefore(document.createTextNode(`Level ${i+1}: `),
			this.levels[i].form.querySelector('label'));
		this.makeHandlers(i);
		formTemplate.parentNode.insertBefore(this.levels[i].form,restButton);
	}
	restButton.addEventListener('click', ev => this.rest());
	this.save = function() {
		const storedData = this.levels.map(level => ({
			slotsLeft: level.slotsLeft, maxSlots: level.maxSlots
		}));
		localStorage.setItem('slots',JSON.stringify(storedData));
	};
	this.load = function() {
		let loadedData = localStorage.getItem('slots');
		if(loadedData) {
			loadedData = JSON.parse(loadedData);
			for(let i = 0; i < 9; ++i) {
				const loadedSlotsLeft = loadedData[i].slotsLeft;
				const loadedMaxSlots = loadedData[i].maxSlots;
				this.setMax(i,loadedMaxSlots);
				this.setCurrent(i,loadedSlotsLeft);
			}
		}
	};
	this.rest = function() {
		for(let i = 0; i < 9; i++) {
			this.setCurrent(i,this.levels[i].maxSlots);
		}
	};
}

var save; //bluh

{
	const app = new SpellBook();
	const slots = new SlotList();
	const levelList = ['Cantrip'];
	let target = document.querySelector('main');
	for(let i = 1; i <= 9; ++i) {
		levelList.push(`Level ${i}`);
	}

	for(let level of levelList) {
		target.innerHTML += (
			`<div style="display:none">`+
			`<span class="spellCategory">${level==='Cantrip'?level+'s':level+' Spells'}`+
			`</span><ul id="${level.replace(' ','_')}_spells"></ul></div>`);
	}
	//Event listeners
	document.querySelector('#addForm').addEventListener('submit', ev => {
		ev.preventDefault();
		const gi = s => ev.target[s].value;
		if(gi('spellLevel') !== 'Cantrip') {
			const level = parseInt(gi('spellLevel').match(/\d/)[0])-1;
			if(slots.levels[level].maxSlots <= 0) {
				slots.setMax(level,1);
			}
		}
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
	slots.load();
	save = () => app.save();
}
