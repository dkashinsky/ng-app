import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IIngredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;

  editedItem: IIngredient;
  editMode: boolean = false;

  private subscription: Subscription;
  private editingItemIndex: number;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editingItemIndex = index;
      this.editedItem = this.shoppingListService.getIngredient(index);

      this.form.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount,
      })
    });
  }

  onSubmit() {
    const { name, amount } = this.form.value;
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editingItemIndex, { name, amount })
    } else {
      this.shoppingListService.addIngredient({ name, amount });
    }

    this.form.reset();
    this.editMode = false;
  }

  onClear() {
    this.editMode = false;
    this.form.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editingItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
