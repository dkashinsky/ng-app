import { Subject } from 'rxjs';
import { IIngredient } from '../shared/ingredient.model';

export class ShoppingListService {
  readonly ingredientsChanged: Subject<IIngredient[]> = new Subject();
  readonly startedEditing: Subject<number> = new Subject();

  private ingredients: IIngredient[] = [
    { name: 'Apples', amount: 5 },
    { name: 'Tomatoes', amount: 10 }
  ];

  getIngredients(): IIngredient[] {
    return this.ingredients.slice();
  }

  getIngredient(index: number): IIngredient {
    return this.ingredients[index];
  }

  addIngredient(ingredient: IIngredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: IIngredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, ingredient: IIngredient) {
    this.ingredients[index] = ingredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
