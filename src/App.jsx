
import Navbar from "./Navbar"
import Popular from "./Popular"
import Story from "./Story"
import { ToastContainer } from "react-toastify"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import NotFound from "./NotFound"

function App() {
  return (
    <Router>
      <div className="header">
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Story />
          </Route>
          <Route path="/category/:queryCat">
            <Story />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App



