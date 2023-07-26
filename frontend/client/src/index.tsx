import React from 'react'
import Main from './Main'
import { createRoot } from 'react-dom/client'
import './Pretendard/web/static/pretendard.css'
import './PyeongChangPeace/PyeongChangPeace.css'
import '../src/index.css'

const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
root.render(<Main />)
