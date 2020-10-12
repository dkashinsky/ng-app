import { IIngredient } from '../shared/ingredient.model';

export interface IRecipe {
  name: string;
  description: string;
  imagePath: string;
  ingredients: IIngredient[];
}
