import { IIngredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface ShoppingListState {
  ingredients: IIngredient[];
}

const initialState: ShoppingListState = {
  ingredients: [
    { name: 'Apples', amount: 5 },
    { name: 'Tomatoes', amount: 10 }
  ]
};

export function shoppingListReducer(
  state: ShoppingListState = initialState, 
  action: ShoppingListActions.AddIngredient)
: ShoppingListState {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };  
    default:
      return state;
  }
}
