import React,{useState,useContext} from "react";
import {Link,useHistory} from "react-router-dom";
import {userContext} from "../../App"
import M from "materialize-css";

function Login() {

    const {state,dispatch} = useContext(userContext);
    const history = useHistory();
    const [Email,setEmail] = useState("");
    const [Password,setPassword] = useState("");

    const PostData = ()=>{
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                Email:Email,
                Password:Password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#f44336 red"})
            }else{
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user});
                M.toast({html: "Signed in Success",classes:"#76ff03 light-green accent-3"})
                history.push("/")
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    return (
        <div className="my-card">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="Email" value={Email} onChange={(e)=>{setEmail(e.target.value)}}/>
                <input type="password" placeholder="Password" value={Password} onChange={(e)=>{setPassword(e.target.value)}}/>
                <button className="btn waves-effect waves-light" onClick={()=>PostData()}>
                    login
                </button>

                <h5>
                    <Link to="/signup"> Dont have an account ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Login;