import React,{useEffect,createContext,useReducer,useContext} from "react";
import './App.css';
import Navbar from "./components/navbar";
import {BrowserRouter,Route, Switch,useHistory} from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePosts from "./components/screens/CreatePosts";
import {initialState,reducer} from "./reducer/reducer";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPost from "./components/screens/SubscribedUserPost";

export const userContext = createContext();

const Routing = ()=>{
  
  const history = useHistory();
  const {state,dispatch} = useContext(userContext);
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user});
    }else{
      history.push("/login");
    }
  },[]);

  return(
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route exact path="/profile">
        <Profile/>
      </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route path="/create">
        <CreatePosts/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile/>
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPost/>
      </Route>
    </Switch>
  )
}


function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <userContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar/>
    <Routing/>
    </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
