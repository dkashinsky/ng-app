import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(
  state: AuthState = initialState, 
  action: AuthActions.AuthAction
): AuthState {
  switch (action.type) {
    case AuthActions.LOGIN:
      const {email, userId, token, expirationDate } = action.payload;
      const user = new User(email, userId, token, expirationDate);
      return { ...state, user, authError: null, loading: false };
    case AuthActions.LOGOUT:
      return { ...state, user: null };
    case AuthActions.LOGIN_START:
      return { ...state, authError: null, loading: true };
    case AuthActions.LOGIN_FAIL:
        return { ...state, user: null, authError: action.payload, loading: false };
    default:
      return state;
  }
}
