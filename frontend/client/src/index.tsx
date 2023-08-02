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

const container = document.getElementById("root")
const root = createRoot(container!)
ReactModal.setAppElement("#root")

root.render(
  <Provider store={Store}>
    <Main />
  </Provider>
)

serviceWorkerRegistration.register()
