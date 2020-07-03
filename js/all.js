let inputCm = document.getElementById('inputCm');
let inputKg = document.getElementById('inputKg');
let inputInfo = document.getElementById('inputInfo');
let result = document.querySelector('.result');
let reFresh = result.querySelector('.refresh')
let recordList = document.querySelector('.record-content');
let deleteAll = document.querySelector('.delet-all')
let today = new Date();
let bmiData = JSON.parse(localStorage.getItem('bmiData')) || [];
let bmiContent = [
    {
        content: '過輕',
        color: '#31BAF9',
    },
    {
        content: '理想',
        color: '#86D73F',
    },
    {
        content: '輕度肥胖',
        color: '#FF982D',
    },
    {
        content: '中度肥胖',
        color: '#FF6C02',
    },
    {
        content: '重度肥胖',
        color: '#FF1200',
    },
]

result.addEventListener('click', addData);
reFresh.addEventListener('click', reFreshBtn);
inputKg.addEventListener('keydown', enterAdd);
recordList.addEventListener('click', deleteOneData);
deleteAll.addEventListener('click', deleteAllData);

updataRecord(bmiData);

// 計算 BMI
function countBmi(cm, kg) {
    let bmi = kg / ((cm / 100) ** 2);
    bmi = bmi.toFixed(2);
    return bmi;
}

// 檢查 BMI
function checkBmi(bmi) {
    let bmiContentIndex = ''
    if (bmi < 18.5) {
        bmiContentIndex = '0';
    } else if (bmi >= 18.5 && bmi < 25) {
        bmiContentIndex = '1';
    } else if (bmi >= 25 && bmi < 30) {
        bmiContentIndex = '2';
    } else if (bmi >= 30 && bmi < 35) {
        bmiContentIndex = '3';
    } else {
        bmiContentIndex = '4';
    }
    return bmiContentIndex;
}

// 新增資料到 resuletBtn updataRecord and localstorage
function addData(e) {
    e.stopPropagation();
    let cmText = inputCm.value;
    let kgText = inputKg.value;
    let bmiNum = countBmi(cmText, kgText);
    if (result.querySelector('.value').textContent !== '看結果') {
      return; 
    } else if ( cmText === '' || kgText === '' ) { 
      alert('請輸入資料。')
      return; 
    }
    let bmiIndex = checkBmi(bmiNum);
    let day = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let bmi = {
        day: day,
        cm: cmText,
        kg: kgText,
        BMI: bmiNum,
        bmiIndex: bmiIndex,
    }
    bmiData.push(bmi);
    updataRecord(bmiData);

    localStorage.setItem('bmiData', JSON.stringify(bmiData));

    // showResult btn
    let showResult = 'result show-result'
    let resultContent = result.children;
    resultContent[0].textContent = bmi.BMI;
    resultContent[3].textContent = bmiContent[bmi.bmiIndex].content;
    result.setAttribute('class', showResult);
    result.style.border = `6px solid ${bmiContent[bmi.bmiIndex].color}`;
    result.style.color = bmiContent[bmi.bmiIndex].color;
    reFresh.style.background = bmiContent[bmi.bmiIndex].color;
    
}

// Enter in
function enterAdd(e) {
    if (e.keyCode === 13) {
        addData(e);
    }
}

// 更新資料
function updataRecord(items) {
    let str = ''
    let itemsLen = items.length;
    for (let i = 0; i < itemsLen; i++) {
        str += `
            <div class="card d-flex" data-bmicolor = ${items[i].bmiIndex}>
                <div class="color-side" style="background: ${bmiContent[items[i].bmiIndex].color}"></div>
                <div class="card-main">
                    <p class="bmi-value">${items[i].BMI}<span>BMI</span></p>
                    <p class="bmi-text">${bmiContent[items[i].bmiIndex].content}</p>
                    <p class="time">${items[i].day}</p>
                </div>
                <div class="card-info d-flex">
                    <div class="card-record d-flex align-items-center">
                        <div class="weight">
                            <p>weight</p>
                            <p>${items[i].kg} kg</p>
                        </div>
                        <div class="height">
                            <p>height</p>
                            <p>${items[i].cm} cm</p>
                        </div>
                    </div>
                    <div class="card-delet" data-index = ${i}><i class="fa fa-trash-o" aria-hidden="true"></i></div>
                </div>
            </div>`
    }
    recordList.innerHTML = str;

    recordList.scrollTop = 0;

}

// 刪除一個資料
function deleteOneData(e) {
    let nowNodeName = e.target.nodeName;
    let dataIndex = e.target.parentNode.dataset.index;
    if (nowNodeName !== 'I') {return; };
    bmiData.splice(dataIndex,1);
    localStorage.setItem('bmiData', JSON.stringify(bmiData));
    updataRecord(bmiData);


}

// 刪除全部資料
function deleteAllData() {
    bmiData = [];
    localStorage.removeItem('bmiData');
    updataRecord(bmiData);
    reFreshBtn();
    
}

// 清除結果的 btn
function reFreshBtn(e) {
  e.stopPropagation();
  result.querySelector('.value').textContent = '看結果';
  result.setAttribute('class', 'result');
  result.style.border = 'none';
  result.style.color = '#ffffff';
  reFresh.style.background = 'rgb(211, 128, 50)';
  inputInfo.reset();
}