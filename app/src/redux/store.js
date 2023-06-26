import {legacy_createStore as createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {rootReducer} from './rootReducer'



const composerEnhancers = composeWithDevTools({
  name: `Redux`,
  realtime: true,
  trace: true,
  traceLimit: 25,
});

export const store = createStore(rootReducer, composerEnhancers());