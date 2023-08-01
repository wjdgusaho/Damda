import React from "react"
import Main from "./Main"
import { createRoot } from "react-dom/client"
import "./Pretendard/web/static/pretendard.css"
import "./PyeongChangPeace/PyeongChangPeace.css"
import "../src/index.css"
import {
  universeDarkTheme,
  universeLightTheme,
  heartTheme,
  marbleTheme,
} from "./theme"

const container = document.getElementById("root")
const root = createRoot(container!)

const styleElement = document.createElement("style")
styleElement.innerHTML = `
  html {
    background: ${heartTheme.colorTheme} no-repeat center fixed;
    background-size: cover;
  }
`
document.head.appendChild(styleElement)

root.render(<Main />)
