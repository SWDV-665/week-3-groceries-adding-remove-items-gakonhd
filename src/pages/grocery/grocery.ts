import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { createTextMaskInputElement } from 'text-mask-core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import {GroceryItem} from '../../helperClasses/GroceryItem';

@Component({
  selector: 'page-grocery',
  templateUrl: 'grocery-list.html'
})
export class GroceryPage {
  name:string;
  quantity:number;
  price: string;
  items: GroceryItem[] =[];
  constructor(public navCtrl: NavController, private fb: FormBuilder) {

  }

  @ViewChild('priceInput') 
  public set priceInput(value: HTMLInputElement) {
    if (!value) {
      return;
    }
    this.registerTextMask(value);
  }

  AddItem(){
    if ( this.name === '' || this.name === undefined){
      alert('Please enter a valid grocery item');
    } else if (this.price === undefined){
      alert('Price is invalid. Please input a valid number');
    }else if (isNaN(this.quantity) || this.quantity == 0){
      alert('Quantity is invalid. Please input a valid number');
    } else{
      var groceryObject =  new GroceryItem(
         this.name, 
         this.quantity, 
         this.price
      );
      this.items.push(groceryObject);
      this.name = "";
      this.quantity = 0;
      this.price = "";
    }
  }

  deleteItem(item, idx){
    this.items.splice(idx, 1);
    alert(`item ${item.name} deleted from the shopping list`);
  }

  get priceForm() {
    return this.form.get('priceForm') as FormControl;
  }

  // form validator for masking
  public form: FormGroup = this.fb.group({
    priceForm: [null, [Validators.required]],
  });

  // mask the input to behave like currency
  private registerTextMask(inputElement: HTMLInputElement) {
    const numberMask = createNumberMask({
      prefix: '$ ',
      allowDecimal: true
    })

    const maskedInput = createTextMaskInputElement({
      inputElement,
      mask: numberMask,
      guide: false,
    });
    
    this.priceForm.valueChanges.subscribe(value => {
      maskedInput.update(value);
    });
  }

}
