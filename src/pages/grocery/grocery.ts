import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { createTextMaskInputElement } from 'text-mask-core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import {GroceryItem} from '../../helperClasses/GroceryItem';
import { AlertController } from 'ionic-angular';
import { GroceriesProvider } from '../../providers/groceries/groceries';

@Component({
  selector: 'page-grocery',
  templateUrl: 'grocery-list.html'
})
export class GroceryPage {
  name:string;
  quantity:number;
  price: string;
  items: GroceryItem[] =[];
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              public groceriesSerivce: GroceriesProvider,  private fb: FormBuilder) {

  }

  @ViewChild('priceInput') 
  public set priceInput(value: HTMLInputElement) {
    if (!value) {
      return;
    }
    this.registerTextMask(value);
  }

  LoadItems(){
    return this.groceriesSerivce.getItems()
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
      this.groceriesSerivce.addItem(groceryObject);
      this.name = "";
      this.quantity = 0;
      this.price = "";
    }
  }

  deleteItem(item, idx){
    this.groceriesSerivce.removeItem(idx)
    alert(`item ${item.name} deleted from the shopping list`);
  }

  modifyItem(item, idx){
    this.showPrompt(item, idx);
  }

  showPrompt(item, idx) {
    const prompt = this.alertCtrl.create({
      title: `Edit: ${item.name}`,
      message: `Please edit the properties for ${item.name}`,
      inputs: [
        {
          name: 'name',
          value: item.name, 
          disabled: true, 
          label: "Name"
        },
        {
          name: 'price',
          placeholder: `${item.price}`,
          value: item.price , 
          label: "Price"
        },
        {
          label: 'Quantity',
          name: 'quantity',
          placeholder: `${item.quantity}`,
          value: item.quantity
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: newItem => {
            // if (!isNaN(newItem.Price) && newItem.Price != ''){
            //   var formatter = new Intl.NumberFormat('en-US', {
            //     style: 'currency',
            //     currency: 'USD',
            //   });
            //   item.price = `${formatter.format(newItem.Price)}`
            // } 
            
            // if (!isNaN(newItem.Quantity) && newItem.Quantity != ''){
            //   item.quantity = `${newItem.Quantity}`
            // }

            // if (newItem.ExpDate != undefined && newItem.ExpDate != ''){
            //   item.expDate = `${newItem.ExpDate}`
            // }
            this.groceriesSerivce.editItem(newItem, idx)
          }
        }
      ]
    });
    prompt.present();
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
