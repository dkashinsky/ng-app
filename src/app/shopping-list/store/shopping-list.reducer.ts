import { IIngredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface AppState {
  shoppingList: ShoppingListState;
}

export interface ShoppingListState {
  ingredients: IIngredient[];
  editedIngredient: IIngredient;
  editedIngredientIndex: number;
}

const initialState: ShoppingListState = {
  ingredients: [
    { name: 'Apples', amount: 5 },
    { name: 'Tomatoes', amount: 10 }
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(
  state: ShoppingListState = initialState, 
  action: ShoppingListActions.ShoppingListAction)
: ShoppingListState {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };  
    case ShoppingListActions.ADD_INGREDIENTS:
      return { ...state, ingredients: [...state.ingredients, ...action.payload] };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = { ...ingredient, ...action.payload };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return { 
        ...state, 
        ingredients: updatedIngredients, 
        editedIngredientIndex: -1, 
        editedIngredient: null 
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return { 
        ...state, 
        ingredients: state.ingredients.filter((_, index: number) => index !== state.editedIngredientIndex), 
        editedIngredientIndex: -1, 
        editedIngredient: null
      };  
    case ShoppingListActions.START_EDIT:
      return { ...state, editedIngredientIndex: action.payload, editedIngredient: { ...state.ingredients[action.payload] } };
    case ShoppingListActions.STOP_EDIT:
      return { ...state, editedIngredientIndex: -1, editedIngredient: null };
    default:
      return state;
  }
}
