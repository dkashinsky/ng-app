import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IIngredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: IIngredient[] = [];
  private ingredientSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientSubscription = this.shoppingListService.ingredientsChanged.subscribe((ingredients: IIngredient[]) => {
      this.ingredients = ingredients;
    });
  }

  onIngredientAdded(ingredient: IIngredient) {
    this.shoppingListService.addIngredient(ingredient);
  }

  ngOnDestroy() {
    this.ingredientSubscription.unsubscribe();
  }
}
