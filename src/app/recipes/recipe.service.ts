import { Injectable } from '@angular/core';
import { IIngredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { IRecipe } from './recipe.model';

@Injectable()
export class RecipeService {
  private recipes: IRecipe[] = [
    { 
      name: 'A Test Recipe', 
      description: 'This is simply a test', 
      imagePath: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872',
      ingredients: [
        { name: 'Bread', amount: 1 }
      ]
    },
    { 
      name: 'Another Test Recipe', 
      description: 'This is simply a test', 
      imagePath: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872',
      ingredients: [
        { name: 'Salt', amount: 0.5 }
      ]
    }
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): IRecipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): IRecipe {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: IIngredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
