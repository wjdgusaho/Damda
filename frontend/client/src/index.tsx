import React from "react"
import Main from "./Main"
import { createRoot } from "react-dom/client"
import "./Pretendard/web/static/pretendard.css"
import "./PyeongChangPeace/PyeongChangPeace.css"
import "../src/index.css"
import { Provider } from "react-redux"
import Store from "./store/Store"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import ReactModal from "react-modal"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
import { BrowserRouter } from "react-router-dom"
import ReactGA from "react-ga4"

const container = document.getElementById("root")
const root = createRoot(container!)
ReactModal.setAppElement("#root")
if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS)
}

export let persistor = persistStore(Store)

root.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

serviceWorkerRegistration.register()
