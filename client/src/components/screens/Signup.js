import React,{useEffect, useState} from "react";
import {Link,useHistory} from "react-router-dom";
import M from "materialize-css";

function Signup() {
    const history = useHistory();
    const [Username,setUsername] = useState("");
    const [Email,setEmail] = useState("");
    const [Password,setPassword] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);

    useEffect(()=>{
        if(url){
            uploadFields();
        }
    },[url])

    const uploadPic = ()=>{
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name","lordvendrik");
        fetch("	https://api.cloudinary.com/v1_1/lordvendrik/image/upload",{
            method:"Post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
        })
        .catch(err=>{
            console.log(err)
        });
    }

    const uploadFields = ()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                Username:Username,
                Email:Email,
                Password:Password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#f44336 red"})
            }else{
                M.toast({html: data.message,classes:"#76ff03 light-green accent-3"})
                history.push("/login")
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    const PostData = ()=>{
        if(image){
            uploadPic();
        }else{
            uploadFields();
        }
    }

    return (
        <div className="my-card">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="Username" value={Username} onChange={(e)=>{setUsername(e.target.value)}}/>
                <input type="text" placeholder="Email" value={Email} onChange={(e)=>{setEmail(e.target.value)}}/>
                <input type="password" placeholder="Password" value={Password} onChange={(e)=>{setPassword(e.target.value)}}/>
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light darken-1">
                        <span>Upload Profile Pic</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light" onClick={()=>{PostData()}}>
                    Signup
                </button>

                <h5>
                    <Link to="/login"> Already have an account ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup;