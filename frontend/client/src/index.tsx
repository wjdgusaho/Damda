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

const container = document.getElementById("root")
const root = createRoot(container!)
ReactModal.setAppElement("#root")

export let persistor = persistStore(Store)

root.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <Main />
    </PersistGate>
  </Provider>
)

serviceWorkerRegistration.register()
