async function crud(url, options) {
    const address = await fetch(url, options);
    const result = await address.json();
    return result;
}

function solve() {
    loadAllStudents();
    document.getElementById('form').addEventListener(
        'submit', addNewStudent)
}
solve();

async function loadAllStudents() {
    const result = await crud('http://localhost:3030/jsonstore/collections/students');
    console.log(result);
    let body = document.getElementById('tbody');
    body.innerHTML = '';
    Object.entries(result).map((st) => {
        let row = document.createElement('tr');
        let thName = document.createElement('th');
        thName.innerText = st[1].firstName;
        let thLastName = document.createElement('th');
        thLastName.innerText = st[1].lastName;
        let thFaculty = document.createElement('th');
        thFaculty.innerText = st[1].facultyNumber;
        let thGrade = document.createElement('th');
        thGrade.innerText = st[1].grade;
        row.appendChild(thName);
        row.appendChild(thLastName);
        row.appendChild(thFaculty);
        row.appendChild(thGrade);
        body.appendChild(row);
    });


}

async function addNewStudent(e) {
    e.preventDefault();
    let fromData = new FormData(document.getElementById('form'));
    if (fromData.get('firstName').trim() == '' || fromData.get('lastName').trim() == ''
        || !Number(fromData.get('facultyNumber')) 
        || fromData.get('facultyNumber').trim()==''
        || !Number(fromData.get('grade'))
        || fromData.get('grade').trim()==''
        ) {
        alert('Try again :)');
        return;
    }else{
        let firstName=  fromData.get('firstName');
        let lastName=  fromData.get('lastName');
        let facultyNumber=  fromData.get('facultyNumber');
        let grade=  fromData.get('grade');

        
       await crud('http://localhost:3030/jsonstore/collections/students',{
         method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({firstName, lastName, facultyNumber, grade})
        })
        loadAllStudents();
    }
    
}