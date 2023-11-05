"use strict";
/*Vi behöver plocka in referenserna för
textrutan & knappen, sedan sökdelen*/
/*Hämta referenser till html-elementen*/
/*Vi behöver, om vi kör strict = true, veta vilka tper det är
Vissa referenser kan den själv tolka utifrån omgivning*/
/*Vi lägger till form i addbutton istället för document.
Det är nu typescript, då får vi rött under ordet form som säger att
form ev. kan vara null. Den säger också att form är
av typen element.

Vi vet att den översta är ett formulär, så vi talar om det.
as HTMLFormElement.

Vi vet även att input ÄR ett input element, lägger vi till det.

Ts hämtar knappen i formuläret och ser att det är en button och kan se att typen
är av HTMLButtonElement.
*/
const form = document.querySelector('#grocery-form');
const input = document.querySelector('#grocery-input');
const addButton = form.querySelector('button');
const list = document.querySelector('#grocery-list');
const clearButton = document.querySelector('#clear-list');
const filterInput = document.querySelector('#filter');
/*Nu vill vi hantera knappen och koppla den till formulärets submit händelse.
Koppla händelser till elementet

1. submit händelsen på formuläret*/
form.addEventListener('submit', onSaveGrocery);
clearButton.addEventListener('click', onClearList);
list.addEventListener('click', onClickRemoveGrocery);
filterInput.addEventListener('input', onFilterGroceries);
document.addEventListener('DOMContentLoaded', onDisplayGroceries);
/*2. Spara inköps till listan.
Vi behöver tala om vilken typ e är */
function onSaveGrocery(e) {
    e.preventDefault();
    const grocery = input.value;
    if (grocery.trim().length > 0) {
        addGroceryToDOME(grocery);
        addToStorage(grocery);
    }
    input.value = '';
}
/*Lägg till inköp till DOM*/
function addGroceryToDOME(grocery) {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(grocery));
    item.appendChild(createIconButton('btn-remove text-red'));
    list.appendChild(item);
}
function createIconButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    button.appendChild(createIcon('fa-regular fa-trash-can'));
    return button;
}
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}
/*Så länge som vi har något i listan = firstChild,
så gör vi list.removeChild(list.firstChild)
while -> kör tills det inte längre finns några
firstchilds.*/
function onClearList() {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    localStorage.removeItem('groceries');
}
function onClickRemoveGrocery(e) {
    var _a;
    const target = e.target;
    // console.log('target', target?.parentElement?.parentElement);
    if ((_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.classList.contains('btn-remove')) {
        const item = target.parentElement.parentElement;
        removeGrocery(item);
    }
}
function removeGrocery(item) {
    item.remove();
    //Ta bort från localStorage också
    removeFromStorage(item.textContent);
}
function onFilterGroceries() {
    var _a, _b;
    const value = this.value;
    const groceries = document.querySelectorAll('li');
    for (let grocery of groceries) {
        /*grabba tag i elementet vi får via grocery via listan
        "Ge mig första barnet, och ge mig textinnehållet, ?
        för vi kanske inte har något förstabarn, sedan toLowerCase*/
        const item = (_b = (_a = grocery.firstChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        /*Nu ska vi titta om om vårt item, har ett index, för mitt value,
        om det existerar, om den inte är = -1 innebär det att den finns där,
        annars tar vi nästa steg.*/
        if ((item === null || item === void 0 ? void 0 : item.indexOf(value)) !== -1) {
            //sätt displaytypen flex
            grocery.style.display = 'flex';
        }
        else {
            grocery.style.display = 'none';
        }
    }
}
/*Vi måste först hämta upp det som finns i listan */
function addToStorage(grocery) {
    /*1. hämta ut listan om den finns i localstorage*/
    const groceries = getFromStorage();
    /*2. Om den finns, lägger vi till grocery*/
    groceries.push(grocery);
    /*3. Spara ned listan igen till localStorage */
    localStorage.setItem('groceries', JSON.stringify(groceries));
}
/*Funktion för att läsa in listan.
Denna returnerar en string-array.
Här ska vi hämta ut det som finns i localStorage*/
function getFromStorage() {
    var _a;
    let items;
    items = (_a = JSON.parse(localStorage.getItem('groceries'))) !== null && _a !== void 0 ? _a : [];
    return items;
}
function removeFromStorage(grocery) {
    let groceries = getFromStorage();
    groceries = groceries.filter(item => item !== grocery);
    localStorage.setItem('groceries', JSON.stringify(groceries));
}
function onDisplayGroceries() {
    const groceries = getFromStorage();
    groceries.forEach(item => addGroceryToDOME(item));
}
