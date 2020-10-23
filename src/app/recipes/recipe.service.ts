import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { IIngredient } from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import { IRecipe } from './recipe.model';

@Injectable()
export class RecipeService {
  readonly recipesChanged: Subject<IRecipe[]> = new Subject();

  private recipes: IRecipe[] = [];

  constructor(private store: Store<fromShoppingList.AppState>) {}

  setRecipes(recipes: IRecipe[]): void {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(): IRecipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): IRecipe {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: IIngredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: IRecipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: IRecipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
