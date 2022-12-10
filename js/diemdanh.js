import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore, getDoc, getDocs, doc, collection, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAyBIF-VzaZW17U8mcCVpWWwUupp90FW94",
    authDomain: "project-674e3.firebaseapp.com",
    projectId: "project-674e3",
    storageBucket: "project-674e3.appspot.com",
    messagingSenderId: "853764671123",
    appId: "1:853764671123:web:67ae0094296b6bb7eeef66"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let calendar = document.querySelector('.calendar')
var Day

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

function getFebDays(year) {
    return isLeapYear(year) ? 29 : 28
}

function generateCalendar(month, year) {
    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let currDate = new Date()
    if (!month) month = currDate.getMonth()
    if (!year) year = currDate.getFullYear()

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year

    // get first day of month
    
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement('div')
        // day.addEventListener("click", () => test())
        if (i >= first_day.getDay()) {
            day.classList.add('calendar-day-hover')
            day.innerHTML = i - first_day.getDay() + 1
            day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
            }
        }
        calendar_days.appendChild(day)
    }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
        Day = document.getElementsByClassName("calendar-day-hover")
        for(let i = 0; i < Day.length; i++) {
            Day[i].addEventListener("click", () => clickDay(i, 0, curr_month, curr_year))
        }
    }
    month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')
}

let currDate = new Date()

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
    Day = document.getElementsByClassName("calendar-day-hover")
    for(let i = 0; i < Day.length; i++) {
        Day[i].addEventListener("click", () => clickDay(i, 0, curr_month, curr_year))
    }
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
    Day = document.getElementsByClassName("calendar-day-hover")
    for(let i = 0; i < Day.length; i++) {
        Day[i].addEventListener("click", () => clickDay(i, 0, curr_month, curr_year))
    }
}   

Day = document.getElementsByClassName("calendar-day-hover")
const currentDay = document.getElementsByClassName("curr-date")
let clickedDay 

for(let i = 0; i < Day.length; i++) {
    Day[i].addEventListener("click", () => clickDay(i, 1, curr_month, curr_year))
}

function clickDay(key, haveCurrDate, currMonth, currYear) {
    if(haveCurrDate) {
        if(Day[key].innerText !== currentDay[0].innerText){
            if(clickedDay) {
                $(clickedDay).removeClass("clickedDay");
            }
            $(Day[key]).addClass("clickedDay");
            clickedDay = Day[key]
            const yyyy = currYear.value;
            let mm = currMonth.value + 1;
            let dd = Day[key].innerText;
  
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
  
            const clickDate = dd + '-' + mm + '-' + yyyy;
            console.log(clickDate);
            loadData(clickDate)
        }
        else {
            if(clickedDay) {
                $(clickedDay).removeClass("clickedDay");
            }
            loadData(formattedToday)
        }
    }
    else {
        if(clickedDay) {
            $(clickedDay).removeClass("clickedDay");
        }
        $(Day[key]).addClass("clickedDay");
        clickedDay = Day[key]
        const yyyy = currYear.value;
        let mm = currMonth.value + 1;
        let dd = Day[key].innerText;

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const clickDate = dd + '-' + mm + '-' + yyyy;
        console.log(clickDate);
        loadData(clickDate)
    }
}

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '-' + mm + '-' + yyyy;

  let  members = []

  async function getMembers() {
    const docRef = collection(db, "members");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) =>  {
      members.push({ id: doc.id, name: doc.data().name})
    });
  }

  const detail = document.getElementById("detail");

  async function renderCard() {
    await getMembers();
    for(let i = 0; i < 7; i++) {
        $(detail).append(`<div class="p-2 border rounded shadow-lg my-3">
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-2">
                        <img class="img border rounded-circle" src="./img/${ members[i].id }.jpg" alt="">
                    </div>
                    <div class="d-flex col-6 align-items-center fw-bold fs-4">
                        <p class="mb-0">${ members[i].name }</p>
                    </div>
                    <div id="${ members[i].id }" class="col d-flex align-items-center">
                    </div>
                </div>
            </div>`);
    }
  }

  renderCard();
  const btn1 = document.getElementById("btn1")
  const btn2 = document.getElementById("btn2")
  const btn3 = document.getElementById("btn3")

  async function loadData(date) {
    const date1 = document.getElementById("date1")
    date1.innerHTML = ""
    $(date1).append(`<h3> ${ date }</h3>`);
    const docSnap = await getDoc(doc(db, "diemdanh", date))
    if(docSnap.data() || date === formattedToday) {

        $(detail).removeClass("d-none");
        $(document.getElementById("noData")).addClass("d-none")
        if(date === formattedToday) 
            $(btn1).removeClass("d-none");
        else 
           $(btn1).addClass("d-none");

        for(let i = 0; i < 7; i++){
            document.getElementById(members[i].id).innerHTML = ""
        }
        if(docSnap.data()) {
            const data = docSnap.data().checked;
            for(let i = 0; i < data.length; i++) {
                const checkedId = document.getElementById(data[i]);
                $(checkedId).append(`<i class="fa-solid fa-check fa-xl cursor checked"></i>`);
            }
    
            for(let i = 0; i < 7; i++) {
                let flag = false
                for(let j = 0; j < data.length; j++) {
                    if(members[i].id == data[j]) {
                        flag = true;
                        break;
                    }
                }
                if(!flag) {
                    $(document.getElementById(members[i].id)).append(`<i class="fa-solid fa-x fa-xl cursor xmark"></i>`);
                }
            }
        }
    }
    else{
        $(detail).addClass("d-none");
        $(document.getElementById("noData")).removeClass("d-none")
        $(btn1).addClass("d-none");
    }
  }

  loadData(formattedToday);

  

  btn1.addEventListener("click", () => addData())
  btn2.addEventListener("click", () => cancel())
  btn3.addEventListener("click", () => saveData())

  function addData() {
    for(let i = 0; i < 7; i++) {
        document.getElementById(members[i].id).innerHTML = ""
        $(document.getElementById(members[i].id)).append(`<input id="check-${ members[i].id }" class="form-check-input checkbox" type="checkbox">`);
    }

    $(btn1).addClass("d-none");
    $(btn2).removeClass("d-none");
    $(btn3).removeClass("d-none");

  }

  function cancel() {
    for(let i = 0; i < 7; i++) {
        document.getElementById(members[i].id).innerHTML = ""
    }
    loadData(formattedToday);

    $(btn1).removeClass("d-none");
    $(btn2).addClass("d-none");
    $(btn3).addClass("d-none");
  }

  async function saveData() {
    const checked = [];
    let id
    for(let i = 0; i < 7; i++) {
        id = document.getElementById(`check-${ members[i].id }`)
        if(id.checked) {
            checked.push(members[i].id);
        }
        document.getElementById(members[i].id).innerHTML = ""
    }

    const docSnap = await getDoc(doc(db, "diemdanh", formattedToday))
    if(docSnap.data()){
        const check = docSnap.data().checked
        for(let i = 0; i < check.length; i++) {
            let flag = false
            checked.forEach(data => {
                if(check[i] === data) 
                    flag = true
            })
            if(!flag)   checked.push(check[i]);
        }
    }

    await setDoc(doc(db, "diemdanh", formattedToday), {
        checked: checked
    }); 

      const toast = document.querySelector(".toast");
      const closeIcon = document.querySelector(".close");
      const progress = document.querySelector(".progress");

      let timer1, timer2;

      toast.classList.add("active");
      progress.classList.add("active");

      timer1 = setTimeout(() => {
            toast.classList.remove("active");
      }, 5000); //1s = 1000 milliseconds

      timer2 = setTimeout(() => {
            progress.classList.remove("active");
      }, 5300);

      
      closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");
        
        setTimeout(() => {
          progress.classList.remove("active");
        }, 300);

        clearTimeout(timer1);
        clearTimeout(timer2);
      });

    loadData(formattedToday);

    $(btn1).removeClass("d-none");
    $(btn2).addClass("d-none");
    $(btn3).addClass("d-none");
  }





