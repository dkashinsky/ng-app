import { Subject } from 'rxjs';
import { IIngredient } from '../shared/ingredient.model';

export class ShoppingListService {
  readonly ingredientsChanged: Subject<IIngredient[]> = new Subject();

  private ingredients: IIngredient[] = [
    { name: 'Apples', amount: 5 },
    { name: 'Tomatoes', amount: 10 }
  ];

  getIngredients(): IIngredient[] {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: IIngredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: IIngredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
