var settings = null;

var settingsLoaded = false;
var shopifyCurrenciesLoaded = false;
var geoPluginLoaded = false;
var geoPluginCurrencyCode = '';

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

    if (settings.pickerType != 'edge') {
        edge = 10;
    }

    switch(settings.pickerLocation){
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
        var iconURL = "curr-sign.svg";
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
        'W