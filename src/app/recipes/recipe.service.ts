import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IIngredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { IRecipe } from './recipe.model';

@Injectable()
export class RecipeService {
  readonly recipesChanged: Subject<IRecipe[]> = new Subject();

  private recipes: IRecipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {}

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
    this.shoppingListService.addIngredients(ingredients);
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
