import React,{useState,useEffect} from 'react'
import M from "materialize-css";
import {useHistory} from "react-router-dom"

function CreatePosts() {

    const history = useHistory();
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");

    useEffect(() => {
        if(url){
            fetch("/createPost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    url:url,
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error,classes:"#f44336 red"})
                }else{
                    M.toast({html: "created Successfully",classes:"#76ff03 light-green accent-3"})
                    history.push("/")
                }
            }).catch(err=>{
                console.log(err);
            });
        }
    }, [url]);

    const postImage = ()=>{

        if(localStorage.getItem("jwt")){
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
        }else{
            M.toast({html: "Login First",classes:"#f44336 red"})
        }
    };

    return (
        <div className="card input-filed" 
        style={{margin:"10px auto",maxWidth:"500px",padding:"20px",textAlign:"center"}}
        >
            <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field input-field">
            <div className="btn waves-effect waves-light darken-1">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>

            <button className="btn waves-effect waves-light darken-1" onClick={()=>{postImage()}}>
                Submit Post
            </button>
        </div>
    )
}

export default CreatePosts;
