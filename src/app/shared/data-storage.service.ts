import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IRecipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipesService: RecipeService) {}

  fetchRecipes(): Observable<IRecipe[]> {
    return this.http
      .get<IRecipe[]>('https://ng-app-dcc58.firebaseio.com/recipes.json')
      .pipe(
        map((recipes: IRecipe[]) => recipes.map(recipe => ({ ...recipe, ingredients: recipe.ingredients ?? [] }))),
        tap((recipes: IRecipe[]) => this.recipesService.setRecipes(recipes))
      );
  }

  storeRecipes(): void {
    const recipes: IRecipe[] = this.recipesService.getRecipes();
    this.http.put('https://ng-app-dcc58.firebaseio.com/recipes.json', recipes).subscribe(
      (recipes: IRecipe[]) => console.log(recipes)
    );
  }
}
