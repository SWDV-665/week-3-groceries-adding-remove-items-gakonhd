import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroceryItem } from '../../helperClasses/GroceryItem';

/*
  Generated class for the GroceriesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceriesProvider {
  
  groceryItems = [] as GroceryItem[]

  constructor() {
    console.log('Hello GroceriesProvider Provider');
  }

  getItems(){
    return this.groceryItems
  }

  addItem(item){
    this.groceryItems.push(item)
  }

  removeItem(idx){
    this.groceryItems.splice(idx, 1);
  }

  editItem(newItem, idx){
    this.groceryItems[idx] = newItem
  }
}
