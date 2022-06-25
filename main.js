const inputs = document.querySelectorAll('input');
const resultContent = document.querySelectorAll(".res-section span");

const closeBtn = document.querySelector(".close-inf-bar");
const infSection = document.querySelector(".information");
closeBtn.addEventListener("click", function() {
    infSection.classList.add("hidden");
})

const closeSettingsBtn = document.querySelector(".close-settings-bar");
const settingsSection = document.querySelector(".settings-bar");
closeSettingsBtn.addEventListener("click", function() {
    settingsSection.classList.add("hidden");
})

const closeStats = document.querySelector('.close-item');
const statsSection = document.querySelector(".stats");
closeStats.addEventListener("click", function() {
    statsSection.classList.add("hidden");
})

const openStats = document.querySelector(".stats-btn");
openStats.addEventListener("click", function() {
    statsSection.classList.remove("hidden");
})

const settingsBar = document.querySelector(".settings-bar");
const settingsBtn = document.querySelector(".settings-btn");
settingsBtn.addEventListener("click", function() {
    settingsBar.classList.remove("hidden");
})

inputs.forEach(x => {
    x.setAttribute("autocomplete", "off");
})
const time = 1000;
let step = 1;
$.Tween.propHooks.number = {
        get: function(tween) {
        var num = tween.elem.innerHTML.replace(/^[^\d-]+/, ' ');
        return parseFloat(num) || 0;
        },
    set: function(tween) {
    var opts = tween.options;
    tween.elem.innerHTML = (opts.prefix || '') +
        tween.now.toFixed(opts.fixed || 0) +
        (opts.postfix || '');
    }
};

function animationNum(id, key) {
    $(id)
        .delay(500)
        .animate({
        number: key
    }, {
        duration: 2000,
        prefix: ''
    });
}


const cfgValues = document.querySelectorAll(".st-section input");
let config = [];
let default_config = [];
const list = JSON.parse(sessionStorage.getItem('list')) || [];

const user = {
    work: 12,
    attendance_bonus: 30000,
    tax_from: 433700,
    currency: "HUF"
}
window.addEventListener("load", function() {
    for(i = 0; i < cfgValues.length; i++) {
        default_config.push({
            text: cfgValues[i].getAttribute("data-text"),
            value: cfgValues[i].value
        })
    }
    let getMemory = this.sessionStorage.getItem("settings-cfg");
    for(i = 0; i < cfgValues.length; i++) {
        config.push({
            text: cfgValues[i].getAttribute("data-text"),
            value: cfgValues[i].value
        })
    }
    if(getMemory == null) {
        this.sessionStorage.setItem("settings-cfg", JSON.stringify(config));
    }

    base.get();
})



const getBtn = document.querySelector("#get-result");
getBtn.addEventListener("click", function() {
    infSection.classList.remove("hidden");
});


function reload() {
    location.reload();
}
let outResult;
class myMath {
    simple() {
        let days_all = Number(document.querySelector("#days").value) || 0;
        let overtimes = Number(document.querySelector("#overtimes").value) || 0;
        let nightShifts = Number(document.querySelector("#night-shifts").value) || 0;
        let dayShifts = Number(document.querySelector("#day-shifts").value) || (days_all - nightShifts) || 0;

        const default_num = (user.work * config[0].value) * days_all;
        let num = default_num;
        const default_over = (user.work * config[0].value) * overtimes * 2;
        let num2 = default_over;
        const default_nights = (user.work * config[0].value) * nightShifts;
        let num3 = default_nights + (default_nights * 0.3);

        let result = num + num2 + num3 + user.attendance_bonus;
        // let result2 = (result > 433700) ? result - 433700 : result;
        this.taxBill(result);
    }

    taxBill(n) {
        let num;
        let age = Number(config[4].value);
        if(n > user.tax_from) num = n - user.tax_from;
        this.precentBill(n, num, age);
        // console.log(n, num, age)

    }

    precentBill(n1, n2, age) {
        let days_all = Number(document.querySelector("#days").value) || 0;
        let overtimes = Number(document.querySelector("#overtimes").value) || 0;
        let nightShifts = Number(document.querySelector("#night-shifts").value) || 0;
        let dayShifts = Number(document.querySelector("#day-shifts").value) || (days_all - nightShifts);
        let currency = document.querySelector("#currency");
        currency.innerText = user.currency;
        let perHour = Number(config[0].value);

        let taxPrecentFrom = Number(document.querySelector("#tax-from").value);
        let taxPrecentTo = Number(document.querySelector("#tax-to").value);
        
        let getPrecent = age < 25 ? Number(config[5].value) : Number(config[6].value)
        let num = ((n1 - n2) - ((n1 - n2) / 100 * getPrecent)).toFixed();
        let num2 = (n2 - (n2 / 100 * taxPrecentFrom)).toFixed();
        let result = Number((+num + +num2) + user.attendance_bonus - 14064);
        let perHourPrecent = perHour - (perHour / 100 * Number(config[5].value));
        outResult = result;
        // console.log(perHourPrecent);
        animationNum('#r-all-days', days_all);
        animationNum('#r-days', dayShifts);
        animationNum('#r-nights', nightShifts);
        
        animationNum('#r-overtimes', overtimes);
        animationNum('#r-per-hour', perHourPrecent);
        animationNum('#r-attendance-bonus', user.attendance_bonus);
        
        animationNum('#r-night-bonus', Number(config[1].value));
        animationNum('#r-tax-to', Number(config[5].value));
        animationNum('#r-tax-from', Number(config[6].value));
        animationNum('#r-result', result);

        base.setList();
    }
}

const math = new myMath();





class Data {
    get() {
        config = JSON.parse(sessionStorage.getItem("settings-cfg"));
        console.clear();
        console.log("%c[GET] Work is end.", "color: green;")
        for(let i = 0; i < cfgValues.length; i++) {
            cfgValues[i].value = config[i].value;
        }
    }
    reset() {
        config = default_config;
        this.update();
        console.log("%c[RESET] Work is end.", "color: crimson;")
        
    }

    set() {
        config = [];
        for(i = 0; i < cfgValues.length; i++) {
            config.push({
                text: cfgValues[i].getAttribute("data-text"),
                value: cfgValues[i].value
            })
        }
        console.log("%c[SET] Work is end.", "color: royalblue;")
        this.update();
    }

    update() {
        sessionStorage.setItem("settings-cfg", JSON.stringify(config));
        console.log("%c[UPDATE] Work is end.", "color: green;")
    }


    setList() {
        list.push({
            id: list.length == 0 ? list.length : list.length,
            date: {
                time: new Date().getTime(),
                simple: new Date().toLocaleString()
            },
            balance: outResult,
            bid: Number(config[0].value),
            age: Number(config[4].value)
        })
        sessionStorage.setItem('list', JSON.stringify(list));

        console.log(`%c[SET LIST: ${list.length}] New item was addedd!`, 'color: green;');
    }
}

const base = new Data();




class Build {
    constructor() {
        setTimeout(() => {
            console.warn("Build class is created!")
        }, 500);

        for(let i = 0; i < list.length; i++) {
            this.create(list[i]);
        }
    }

    create(sources) {
        const path = document.querySelector(".elements");
        path.innerHTML += `
        <div class="item">
            <ul>
                <li class="date"><i title='Дата' class="fa fa-calendar" aria-hidden="true"></i> ${sources.date.simple}</li>
                <li class="balance"><i title='Заработал' class="fa fa-money" aria-hidden="true"></i> ${sources.balance}</li>
                <li class="per-hours"><i title='Ставка в час' class="fa fa-clock-o" aria-hidden="true"></i> ${sources.bid}</li>
                <li class="age-status"><i title='Возраст' class="fa fa-male" aria-hidden="true"></i> ${sources.age}</li>
            </ul>
        </div>
        `
    }
}

const build = new Build();