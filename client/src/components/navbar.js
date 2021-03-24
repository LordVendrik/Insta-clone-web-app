import React,{useContext} from 'react'
import {Link,useHistory} from "react-router-dom";
import {userContext} from "../App";

function Navbar() {

  const{state,dispatch} = useContext(userContext);
  const history = useHistory();
  const renderList = ()=>{
    if(state){
      return[
        <li key="1" ><Link to="/profile">profile</Link></li>,
        <li key="2"><Link to="/create">CreatePost</Link></li>,
        <li key="3"><Link to="/myfollowingpost">My following Post</Link></li>,
        <li key="4">
          <button className="btn waves-effect waves-light darken-1" 
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push("/login");
            }}>
            Logout
          </button>
        </li>
      ]
    }else{
      return[
        <li key="6"><Link to="/login">login</Link></li>,
        <li key="5"><Link to="/signup">signup</Link></li>
      ]
    }
  };

    return (
        <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/login"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}

export default Navbar;
