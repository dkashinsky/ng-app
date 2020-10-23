import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
}

const initialState: AuthState = {
  user: null
};

export function authReducer(
  state: AuthState = initialState, 
  action: AuthActions.AuthAction
): AuthState {
  switch (action.type) {
    case AuthActions.LOGIN:
      const {email, userId, token, expirationDate } = action.payload;
      const user = new User(email, userId, token, expirationDate);
      return { ...state, user };
    case AuthActions.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
}
