// Form and inputs 

const elForm = get('js-form');

const elNameInp = get('js-name-input');
const elTelInp = get('js-tel-input');
const elTypeInp = get('js-type-input');

const elTelError = get('js-tel-input-error');


// Btns 

const typeBtnGroup = Array.from(get('js-type-btn-group').children);
const sortBtnGroup = Array.from(get('js-sort-btn-group').children);

const allBtn = get('js-all-btn');
const familyBtn = get('js-family-btn');
const friendsBtn = get('js-friends-btn');
const workBtn = get('js-work-btn')
const ascBtn = get('js-asc-btn');
const descBtn = get('js-desc-btn');

// Templates 

const elTemp = get('js-data-temp');
const elNotFoundTemp = get('js-not-found-temp');
const fragment = new DocumentFragment();

// Data 

let contacts = JSON.parse(localStorage.getItem('contacts') || "[]");
let filtered = [];
const list = get('js-list');
const telRegex = new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$', 'g');
// Add active class

addActiveClass(typeBtnGroup);
addActiveClass(sortBtnGroup);

// Render 

render(contacts, list);


elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    
    if(!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g.test(elTelInp.value)) {
        elTelInp.classList.add('is-invalid');
        elTelError.textContent = 'Tel number is not valid !';
        return;
    }else {
        elTelInp.classList.remove('is-invalid');
        elTelError.textContent = '';
    }

    const telInpVal = elTelInp.value.split('').filter(item => !isNaN(item) && item !== " ").join('');
    const isTelExists = contacts.find(item => item.tel === telInpVal);
    if(isTelExists) {
        elTelInp.classList.add('is-invalid');
        elTelError.textContent = 'Tel number already exists !';
        return;
    }else {
        elTelInp.classList.remove ('is-invalid');
        elTelError.textContent = '';
    }

    contacts.push({
        id: contacts.length ? contacts.at(-1).id + 1 : 1,
        name: elNameInp.value.trim(),
        tel: telInpVal,
        type: elTypeInp.value
    });

    localStorage.setItem('contacts', JSON.stringify(contacts));
    render(contacts, list);
    elForm.reset();

});


// Sorting 

sortedRender(allBtn);
sortedRender(familyBtn, 'Family');
sortedRender(friendsBtn, 'Friends');
sortedRender(workBtn, 'Work');
sortedRender(familyBtn, 'Family');
sortedRender(ascBtn, 'Asc', true);
sortedRender(descBtn, 'Desc', true);

workBtn.addEventListener('click', (evt) => {
    const filteredContacts = contacts.filter(item => item.type === 'Work');
    render(filteredContacts, list);
});



// Delete

list.addEventListener('click', (evt) => {
    if(evt.target.matches('.js-delete-btn')) {
        console.log("Bosildi");
        const id = evt.target.dataset.id;
        contacts = contacts.filter(item => item.id != id);
        filtered = contacts;
        render(contacts, list);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
})


function sortedRender(btn, type = 'all', sort = null) {
    let filteredContacts = [];

    btn.addEventListener('click', (evt) => {
        if(type === 'all') {
            filtered = contacts;
            render(contacts, list);
            return;
        }

        if(sort) {
            
            if(filtered.length) {
                if(type === 'Asc') filteredContacts = filtered.sort(ascSort);
                if(type === 'Desc') filteredContacts = filtered.sort(descSort);
            }else {
                if(type === 'Asc') filteredContacts = contacts.sort(ascSort);
                if(type === 'Desc') filteredContacts = contacts.sort(descSort);
            }

            filtered = filteredContacts;
            render(filteredContacts, list);
            return;
        }

        if(filtered.length) filteredContacts = filtered.filter(item => item.type === type);
        else filteredContacts = contacts.filter(item => item.type === type);
        render(filteredContacts, list);
    });
}


function ascSort(a, b) {
    
        const x = a.name.toLowerCase();
        const y = b.name.toLowerCase();

        if(x < y) return -1;
        else if(x > y) return 1;
        else return 0;
}



function descSort(a, b) {
    
        const x = a.name.toLowerCase();
        const y = b.name.toLowerCase();

        if(x > y) return -1;
        else if(x < y) return 1;
        else return 0;
}




function render(arr, node) {
    node.innerHTML = '';

    if(!arr.length) {
        node.appendChild(elNotFoundTemp.content.cloneNode(true));
        return;
    }

    arr.forEach(item => {
        const temp = elTemp.content.cloneNode(true);

        temp.querySelector('.js-name').textContent = item?.name;
        temp.querySelector('.js-tel').textContent = `+${item?.tel}`;
        temp.querySelector('.js-type').textContent = item?.type;
        temp.querySelector('.js-delete-btn').dataset.id = item?.id;

        fragment.appendChild(temp);
    });

    node.appendChild(fragment);
}






function addActiveClass(btns) {

    btns.forEach(btn => {
        btn.addEventListener('click', (evt) => {
            btns.forEach(btn => {
                btn.classList.remove('active');
            });

            btn.classList.add('active');
        });
    });
}




function get(className, getAll = false) {
    if(getAll) return document.querySelectorAll(`.${className}`);
    return document.querySelector(`.${className}`);
}