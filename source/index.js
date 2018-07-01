import idb from 'idb';
import 'babel-polyfill';

class CurrencyController {
    constructor(){
        this.openDB = this.openDB.bind(this);
        this.getRates = this.getRates.bind(this);
    }
    openDB() {
        if (!navigator.serviceWorker) {
            return Promise.resolve();
        }
        return idb.open('converter', 2, (upgradeDb) => {
            switch (upgradeDb.oldVersion) {
                case 0:
                    upgradeDb.createObjectStore('currencies', { keyPath: 'id' });
            }
            switch (upgradeDb.oldVersion) {
                case 1:
                    upgradeDb.createObjectStore('queries', { keyPath: 'id' });
            }
        });
    }
    getCurrencies() {
        var DB = this.openDB();
        fetch('https://free.currencyconverterapi.com/api/v5/currencies')
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                DB.then(function (db) {
                    var tx = db.transaction('currencies', 'readwrite');
                    var currenciesStore = tx.objectStore('currencies');
                    var Obj = JSON.parse(JSON.stringify(myJson));
                    const arr = Object.keys(Obj.results);
                    console.log(arr);
                    arr.forEach(element => {
                        currenciesStore.put(
                        Object.assign({}, Obj.results[element], {
                            id: element,
                        }));
                    });
                    return tx.complete;
                }).then(function () {
                    console.log('People added');
                });
            });
    }
    makeElement({name, type}){
        var d = document;
        let elem = d.createElement(type);
        elem.name = name;
        return elem;
    }
    buildDropdown() {
        let dbPromise = this.openDB();
        let makeElement = this.makeElement;
        dbPromise.then(function (db) {
            var tx = db.transaction('currencies');
            var currenciesStore = tx.objectStore('currencies');
            // var idIndex = currenciesStore.index('id');
            return currenciesStore.getAll();
        }).then(function (curr) {
            const d = document;
            let baseCurr = makeElement({name: "baseCurr", type:"select"});
            let targetCurr = makeElement({name: "targetCurr", type:"select"});
            curr.forEach(element => {
                const domElem = d.createElement("option");
                domElem.value = element.id;
                domElem.textContent = element.id;
                baseCurr.appendChild(domElem);
                targetCurr.appendChild(domElem.cloneNode(true));
            });
            d.body.appendChild(baseCurr);
            d.body.appendChild(targetCurr);
        });
    }

    getRates(){
        var DB = this.openDB();
        // fromCurrency = encodeURIComponent(fromCurrency);
        // toCurrency = encodeURIComponent(toCurrency);
        // var query = `${fromCurrency}_${toCurrency}`;

        // var url = 'https://free.currencyconverterapi.com/api/v5/convert?q='
        //     + query + '&compact=ultra&apiKey=' + apiKey;

        DB.then(function (db) {
            var tx = db.transaction('currencies');
            var currenciesStore = tx.objectStore('currencies');
            // var idIndex = currenciesStore.index('id');
            return currenciesStore.getAll();
        }).then((curr) => {
            let l = curr.length;
            let i = curr.length - 1;
            let index = 0;
            var obj = {};
                do {
                    let arr = [];
                    for (let item of curr){
                        arr.push(`${ item.id }_${(curr[index]).id}`);
                    }
                    let id = curr[index].id;
                    obj[id] = arr;
                    index++
                } while (index < i)
                return obj;
            });
    }

    storeQueries(){
        let rr = this.getRates();
        this.openDB().then(function (db) {
            var tx = db.transaction('queries', 'readwrite');
            var queryStore = tx.objectStore('queries');
            console.log(Obj);
            return;
            for (const [key, value] of Object.entries(Obj)){
                queryStore.put(key,value);
            }
            return tx.complete;
        }).then(function () {
            console.log('Queries added');
        });
}
}

let boot = new CurrencyController();
boot.getCurrencies();
boot.buildDropdown();
// boot.getRates();
boot.storeQueries();