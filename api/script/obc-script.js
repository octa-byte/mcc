var obcSettings = null;

var settingsLoaded = false;
var shopifyCurrenciesLoaded = false;
var geoPluginLoaded = false;
var geoPluginCurrencyCode = '';
var obcFastCurrencyRatesFrom = 0;
var obcFastCurrencyRatesTo = 1;

function obc_dropdown_toggle() {
    document.getElementById("obc-drop-down").classList.toggle("obc-show");
}

function obc_filter_curr() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("obc-drop-search");
    filter = input.value.toUpperCase();
    div = document.getElementById("obc-drop-down");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function insertCSS(){
    var cssId = 'obc-curr-css';  
    if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://mcc-octabyte.appspot.com/script/style.css';
        link.media = 'all';
        head.appendChild(link);
    }
}

function addDropDown(){

    var pickerLocationCss = '';
    var dropDownCss = '';
    var edge = 0;

    if (obcSettings.pickerType != 'edge') {
        edge = 10;
    }

    switch(obcSettings.pickerLocation){
        case 'tr':
            pickerLocationCss = "top:"+ (0+edge) +"px;right:"+ (0+edge) +"px";
            dropDownCss = 'right:0';
            break;
        case 'tl':
            pickerLocationCss = "top:"+ (0+edge) +"px;left:"+ (0+edge) +"px";
            break;
        case 'tm':
            pickerLocationCss = "top:"+ (0+edge) +"px;left:50%";
            break;
        case 'br':
            pickerLocationCss = "bottom:"+ (0+edge) +"px;right:"+ (0+edge) +"px";
            dropDownCss = 'right:0;bottom:100%';
            break;
        case 'bl':
            pickerLocationCss = "bottom:"+ (0+edge) +"px;left:"+ (0+edge) +"px";
            dropDownCss = 'bottom:100%';
            break;
        case 'bm':
            pickerLocationCss = "bottom:"+ (0+edge) +"px;left:50%";
            dropDownCss = 'bottom:100%';
            break;    
    }

    var obcCurrMarkup = '<div style="'+pickerLocationCss+'" class="obc-dropdown">';
    obcCurrMarkup += '<button class="obc-btn obc-btn-primary obc-dropdown-toggle" type="button" onclick="obc_dropdown_toggle()">';
    obcCurrMarkup += '        <span id="obc-selected-curr" >Select currency</span>';
    obcCurrMarkup += '    <span class="obc-caret"></span></button>';
    obcCurrMarkup += '<ul style="'+dropDownCss+'" id="obc-drop-down" class="obc-dropdown-menu"></ul>';
    obcCurrMarkup += '</div>';

    document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', obcCurrMarkup);
}

function addCustomDropDown(){
    var obcPlacholder = document.getElementById("obc-placeholder");

    if (obcPlacholder === null) {
        console.warn("Currency picker is not setup please check App setting page to see how to configure custom currency picker");
        return false;
    }

    var obcCurrMarkup = '';

    var icon = obcPlacholder.getAttribute('icon');

    if (icon == 'default') {
        var iconURL = "https://mcc-octabyte.appspot.com/script/currsign.svg";
    } else {
        var iconURL = icon;
    }

    obcCurrMarkup += '<img src="'+iconURL+'" alt="Currency Picker" onclick="obc_dropdown_toggle()" />';
    obcCurrMarkup += '<sup class="obc-sup-curr" id="obc-selected-curr"></sup>';
    obcCurrMarkup += '<ul id="obc-drop-down" class="obc-dropdown-menu"></ul>';

    obcPlacholder.innerHTML = obcCurrMarkup;

    return true;
}

function selectCurrencyFromList(){

    document.getElementById("obc-drop-down").addEventListener("click", function (e) {
        if (e.target && e.target.matches("a")) {
            var currName = e.target.innerText;
            document.getElementById("obc-selected-curr").innerText = currName;
            obc_dropdown_toggle();
            convertCurrency(currName);
            localStorage.setItem('obc-currency', currName);
        }
    });
}

function generateCurrencyList(curr){

    if (curr === null) {

    var curriences = ['USD', 'EUR', 'GBP', 'CAD', 'ARS', 'AUD', 'BRL',
        'CLP', 'CNY', 'CYP', 'CZK', 'DKK', 'EEK', 'HKD', 'HUF',
        'ISK', 'INR', 'JMD', 'JPY', 'LVL', 'LTL', 'MTL', 'MXN',
        'NZD', 'NOK', 'PLN', 'SGD', 'SKK', 'SIT', 'ZAR', 'KRW',
        'SEK', 'CHF', 'TWD', 'UYU', 'MYR', 'BSD', 'CRC', 'RON',
        'PHP', 'AED', 'VEB', 'IDR', 'TRY', 'THB', 'TTD', 'ILS',
        'SYP', 'XCD', 'COP', 'RUB', 'HRK', 'KZT', 'TZS', 'XPT',
        'SAR', 'NIO', 'LAK', 'OMR', 'AMD', 'CDF', 'KPW',
        'SPL', 'KES', 'ZWD', 'KHR', 'MVR', 'GTQ',
        'BZD', 'BYR', 'LYD', 'DZD', 'BIF', 'GIP', 'BOB',
        'XOF', 'STD', 'NGN', 'PGK', 'ERN', 'MWK', 'CUP',
        'GMD', 'CVE', 'BTN', 'XAF', 'UGX', 'MAD', 'MNT',
        'LSL', 'XAG', 'TOP', 'SHP', 'RSD', 'HTG', 'MGA', 'MZN',
        'FKP', 'BWP', 'HNL', 'PYG', 'JEP', 'EGP', 'LBP', 'ANG',
        'WST', 'TVD', 'GYD', 'GGP', 'NPR', 'KMF', 'IRR', 'XPD',
        'SRD', 'TMM', 'SZL', 'MOP', 'BMD', 'XPF', 'ETB', 'JOD',
        'MDL', 'MRO', 'YER', 'BAM', 'AWG', 'PEN', 'VEF', 'SLL',
        'KYD', 'AOA', 'TND', 'TJS', 'SCR', 'LKR', 'DJF', 'GNF',
        'VUV', 'SDG', 'IMP', 'GEL', 'FJD', 'DOP', 'XDR', 'MUR',
        'MMK', 'LRD', 'BBD', 'ZMK', 'XAU', 'VND', 'UAH', 'TMT',
        'IQD', 'BGN', 'KGS', 'RWF', 'BHD', 'UZS', 'PKR', 'MKD',
        'AFN', 'NAD', 'BDT', 'AZN', 'SOS', 'QAR', 'PAB', 'CUC',
        'SVC', 'SBD', 'ALL', 'BND', 'KWD', 'GHS', 'ZMW', 'XBT',
        'NTD', 'BYN', 'CNH', 'MRU', 'STN', 'VES'];

    } else {
        var curriences = [];
        for ( c of curr ) {
            curriences.push(c.currency);
        }
    }   

    var obcDropDown = document.getElementById("obc-drop-down");

    var obcDropMarkup = '<input type="text" placeholder="Search.." id="obc-drop-search" onkeyup="obc_filter_curr()">';

    for (c of curriences) {
        obcDropMarkup += '<li><a href="#">' + c + '</a></li>';
    }

    obcDropDown.innerHTML = obcDropMarkup;
}

function enableGeoLocation(){
    document.getElementById("obc-selected-curr").innerText = geoPluginCurrencyCode;
    convertCurrency(geoPluginCurrencyCode);
}

function saveOriginalValue(){
    var moneySpan = document.getElementsByClassName("money");
    for (money of moneySpan) {
        money.style.display = 'block';
        money.setAttribute('obc-money', money.innerText);
    }
}

function convertCurrencyByUserDefined(){
    var curr = localStorage.getItem("obc-currency");
    
    if (curr != null) {
        document.getElementById("obc-selected-curr").innerText = curr;
        convertCurrency(curr);
    }
}

function convertCurrency(currency){

    localStorage.setItem('obcCurrencyCode', currency);
    localStorage.setItem('obc-fast-currency-code', currency);
    localStorage.setItem('obc-fast-setting-currency', obcSettings.currency);

    if( Currency != null || Currency != undefined ) {
        localStorage.setItem('obc-fast-currency-rates-from', Currency.rates[obcSettings.currency]);
        localStorage.setItem('obc-fast-currency-rates-to', Currency.rates[currency]);
    }

    var moneySpan = document.getElementsByClassName('money');
    for (money of moneySpan) {
        var m = money.getAttribute('obc-money');

        var thenum = m.replace( /^\D+/g, '');
        
        var isOnlyNum = /^[0-9, .]+$/.test(m);
        
        var newMoney = 0;

        if( Currency != null || Currency != undefined ) {
            newMoney = Currency.convert(parseFloat(thenum), obcSettings.currency, currency);
        } else {
            newMoney = (parseFloat(thenum) * obcFastCurrencyRatesFrom) / obcFastCurrencyRatesTo;
        }

        
        
        newMoney = newMoney.toFixed(2);
        
        if (isOnlyNum) {
            var moneyCode = '';
        } else {
            var moneyCode = ' ' + currency;
        }

        money.innerText = newMoney + moneyCode;
    }
}


function insertShopifyCurrencies(){
    var script = document.createElement('script');
    script.onload = function() {
        shopifyCurrenciesLoaded = true;
    };
    script.src = "https://cdn.shopify.com/s/javascripts/currencies.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}

function loadSetting(){

    var shopName = window.location.hostname;

    fetch("https://mcc-octabyte.appspot.com/setting/read", { 
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: shopName,
        }), 
    })
      .then(res => res.json())
      .then(
        (result) => {
  
            obcSettings = result;
          settingsLoaded = true;  
        },
        (error) => {
          console.error(error);
        }
    );
/* 
    obcSettings = {
        shop: 'shop',
        accessToken: 'accessToken',
        currency: 'PKR',
        money_format: 'Rs. ${amount} PKR',
        configure: false,
        plan: "free",
        enable: true,
        allCurrencies: true,
        currencies: [
            {
                id:123,
                value: 'PKR'
            },
            {
                id:124,
                value: 'EWE'
            },
            {
                id:125,
                value: 'QWS'
            },
        ],
        geoLocation: false,
        defaultCurrencyPicker: true,
        pickerLocation: "tr",
        pickerType: "float"
    };

    settingsLoaded = true; */
    
}

function showCustomerExplaination(){
    var obcCart = document.getElementById('octabyte-mcc-cart');
    if (obcCart != null) {
        obcCart.style.display = 'block';
        document.getElementById('octabyte-selected-currency').innerText = localStorage.getItem('obcCurrencyCode');
    }
}

function configureSetting(){

    if (obcSettings.defaultCurrencyPicker) {
        addDropDown();
    } else {
        var config = addCustomDropDown();

        if (!config) return;
    }

    if (obcSettings.geoLocation) {
        enableGeoLocation();
    } else {
        convertCurrencyByUserDefined();
    }

    if (obcSettings.allCurrencies) {
        generateCurrencyList(null);
    } else {
        generateCurrencyList(obcSettings.currencies);
    }
    
    //showCustomerExplaination();

    selectCurrencyFromList();

}

function loadGeoPlugin(){
    fetch("https://api.ipdata.co/?api-key=ef319447175d5d1c9b38677eaeea273575e9ec69d8500109ee5cb700", { 
        headers: {
          Accept: 'application/json',
        },
    })
      .then(res => res.json())
      .then(
        (result) => {
            geoPluginCurrencyCode = result.currency.code;
            configureSetting();
        },
        (error) => {
          console.error(error);
        }
    );
}

function fastCurrencyConverter(){
    var fastCurrCode = localStorage.getItem('obc-fast-currency-code');
    var fastSettingCurr = localStorage.getItem('obc-fast-setting-currency');
    obcFastCurrencyRatesFrom = localStorage.getItem('obc-fast-currency-rates-from');
    obcFastCurrencyRatesTo = localStorage.getItem('obc-fast-currency-rates-to');

    if(fastCurrCode != null) {
        obcSettings = {
            currency: fastSettingCurr
        }
        convertCurrency(fastCurrCode);
    }
}

    saveOriginalValue();
    fastCurrencyConverter();
    
    insertCSS();

    showCustomerExplaination();

    insertShopifyCurrencies();

    loadSetting();

    var settingTimer = setInterval(function(){
        if (settingsLoaded && shopifyCurrenciesLoaded) {
            
            if (obcSettings.geoLocation) {
                loadGeoPlugin();
                clearInterval(settingTimer);
            } else {
                configureSetting();
                clearInterval(settingTimer);
            }
        }
    }, 1000);
