import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Home from './pages/Home'
import { Step1, Step2a, Step2b } from './pages/New'

export default function App () {
  return (
    <Router>
        <Switch>
            <Route path="/new-1">
                <Step1 />
            </Route>
            <Route path="/step-2a">
                <Step2a />
            </Route>
            <Route path="/step-2b">
                <Step2b />
            </Route>
            <Route path="/">
                <Home />
            </Route>
        </Switch>
    </Router>
  )
}
