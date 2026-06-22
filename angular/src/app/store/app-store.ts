import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import { environment } from '../../environments/environment';

type AppState = {
  isProductionMode: boolean;
};

const initialState: AppState = {
  isProductionMode: true,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setProductionMode(isProductionMode: boolean) {
      console.log(`Setting production mode to ${isProductionMode}`);
      return patchState(store, { isProductionMode });
    }
  })),
  withHooks({
    onInit(store) {
      store.setProductionMode(environment.production);
    }
  }),
);
