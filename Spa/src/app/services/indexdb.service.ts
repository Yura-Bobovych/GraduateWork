import { Injectable } from '@angular/core';

@Injectable()
export class IndexdbService {

  constructor() {}
  Do() {
    const open = indexedDB.open("MyDatabase", 3);

    open.onupgradeneeded = function() {
      var db = open.result;
      var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
      var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
    };
    open.onsuccess = function() {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("MyObjectStore", "readwrite");
      var store = tx.objectStore("MyObjectStore");
      var index = store.index("NameIndex");
  
      // Add some data
      store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
      store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35, qwe: 10});
      for (let i = 0; i < 100000; i++) {
        console.log('+');
        store.put({id: i, data: i});
      }
      // Query the data
      var getJohn = store.get(12345);
      var getBob = index.get(["Smith", "Bob"]);
  
      getJohn.onsuccess = function() {
          console.log(getJohn.result.name.first);  // => "John"
      };
  
      getBob.onsuccess = function() {
          console.log(getBob.result.name.first);   // => "Bob"
      };
  
      // Close the db when the transaction is done
      tx.oncomplete = function() {
          db.close();
      };
    }
  }
}
