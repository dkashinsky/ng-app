import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { IRecipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root'})
export class RecipesResolverService implements Resolve<IRecipe[]> {
  constructor(private dataStorage: DataStorageService, private recipesService: RecipeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IRecipe[] | Observable<IRecipe[]> | Promise<IRecipe[]> {
    const recipes: IRecipe[] = this.recipesService.getRecipes();

    return recipes.length ? recipes : this.dataStorage.fetchRecipes();
  }
}
