import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IIngredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListState } from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<ShoppingListState>;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{shoppingList: ShoppingListState}>
  ) { }

  ngOnInit(): void {
    this.ingredients$ = this.store.select(state => state.shoppingList);
  }

  onIngredientAdded(ingredient: IIngredient) {
    this.shoppingListService.addIngredient(ingredient);
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }
}
