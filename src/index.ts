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

const form = document.querySelector('#grocery-form') as HTMLFormElement;
const input = document.querySelector('#grocery-input') as HTMLInputElement;
const addButton = form.querySelector('button');
const list = document.querySelector('#grocery-list') as HTMLUListElement;
const clearButton = document.querySelector('#clear-list') as HTMLButtonElement;
const filterInput = document.querySelector('#filter') as HTMLInputElement;



/*Nu vill vi hantera knappen och koppla den till formulärets submit händelse.
Koppla händelser till elementet

1. submit händelsen på formuläret*/

form.addEventListener('submit', onSaveGrocery);
clearButton.addEventListener('click', onClearList);
list.addEventListener('click', onClickRemoveGrocery);
// filterInput.addEventListener('input', onFilterGroceries);
document.addEventListener('DOMContentLoaded', onDisplayGroceries);

/*2. Spara inköps till listan.
Vi behöver tala om vilken typ e är */

function onSaveGrocery(e: SubmitEvent) {
    e.preventDefault();

    const grocery = input.value;

    if (grocery.trim().length > 0) {
        addGroceryToDOME(grocery)
        addToStorage(grocery)
    }

    input.value = '';
}

/*Lägg till inköp till DOM*/

function addGroceryToDOME(grocery:string): void {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(grocery));
    item.appendChild(createIconButton('btn-remove text-red'));
    list.appendChild(item);
}

function createIconButton(classes:string):HTMLButtonElement {
    const button = document.createElement('button');
    button.className = classes;
    button.appendChild(createIcon('fa-regular fa-trash-can'))
    return button;
}

function createIcon(classes: string): HTMLElement {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


/*Så länge som vi har något i listan = firstChild,
så gör vi list.removeChild(list.firstChild)
while -> kör tills det inte längre finns några
firstchilds.*/
function onClearList(): void {
    while(list.firstChild) {
        list.removeChild(list.firstChild)
    }

    localStorage.removeItem('groceries');
}

function onClickRemoveGrocery(e: UIEvent): void {
    const target = e.target as HTMLElement;
    // console.log('target', target?.parentElement?.parentElement);

    if(target.parentElement?.classList.contains('btn-remove')){
        const item = target.parentElement!.parentElement as HTMLLIElement
        removeGrocery(item)
    }
}

function removeGrocery(item: HTMLLIElement):void{
    item.remove();
    //Ta bort från localStorage också
    removeFromStorage(item.textContent!);
}

// function onFilterGroceries(this:HTMLInputElement): void{
//     const value = this.value;
//     const groceries = document.querySelectorAll('li');

//     for(let grocery of groceries) {
//         /*grabba tag i elementet vi får via grocery via listan
//         "Ge mig första barnet, och ge mig textinnehållet, ? 
//         för vi kanske inte har något förstabarn, sedan toLowerCase*/
//         const item = grocery.firstChild?.textContent?.toLowerCase();
        
//         /*Nu ska vi titta om om vårt item, har ett index, för mitt value, 
//         om det existerar, om den inte är = -1 innebär det att den finns där,
//         annars tar vi nästa steg.*/


//         if(item?.indexOf(value) !== -1 ) {
//             //sätt displaytypen flex
//             grocery.style.display = 'flex'
//         } else {
//             grocery.style.display = 'none'
//         }

//     }
// }

/*Funktionen ovan med arrow-function */
const onFilterGroceries = (e:Event): void => {
    //vi typar om e.target till ett html element
    const value = (<HTMLInputElement>e.target).value;
    const groceries = document.querySelectorAll('li');

    for (let grocery of groceries) {
        const item = grocery.firstChild?.textContent?.toLowerCase();

            if(item?.indexOf(value) !== -1 ) {
            grocery.style.display = 'flex'
        } else {
            grocery.style.display = 'none'
        }
    }
}



filterInput.addEventListener('input', onFilterGroceries);


/*Vi måste först hämta upp det som finns i listan */
function addToStorage(grocery: string): void {
    /*1. hämta ut listan om den finns i localstorage*/
    const groceries = getFromStorage()
    /*2. Om den finns, lägger vi till grocery*/
    groceries.push(grocery);
    /*3. Spara ned listan igen till localStorage */
    localStorage.setItem('groceries', JSON.stringify(groceries))
}


/*Funktion för att läsa in listan.
Denna returnerar en string-array.
Här ska vi hämta ut det som finns i localStorage*/
function getFromStorage(): string[] {
    let items: string[];

    items = JSON.parse(localStorage.getItem('groceries')!) ?? [];

    return items;
}

function removeFromStorage(grocery:string): void {
    let groceries: string[] = getFromStorage();
    groceries = groceries.filter(item => item !== grocery)
    localStorage.setItem('groceries', JSON.stringify(groceries));
}

function onDisplayGroceries(): void {
    const groceries = getFromStorage();
    groceries.forEach(item => addGroceryToDOME(item));
}