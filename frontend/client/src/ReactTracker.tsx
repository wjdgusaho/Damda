import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import ReactGA from "react-ga4"

const ReactTracker = () => {
  const location = useLocation()
  const [initiailzed, setInitiailzed] = useState(false)

  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS)
      setInitiailzed(true)
    }
  }, [])

  useEffect(() => {
    if (initiailzed) {
      ReactGA.set({ page: location.pathname })
      ReactGA.send("pageview")
    }
  }, [initiailzed, location])
}

export default ReactTracker
