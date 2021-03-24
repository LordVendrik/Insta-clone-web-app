import React,{useEffect,useState,useContext} from "react";
import {userContext} from "../../App"

function Profile() {
    const [myPics,setPics] = useState([]);
    const {state,dispatch} = useContext(userContext);
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");
    useEffect(()=>{
        fetch("/mypost",{
            headers:{
                Authorization: "Bearer " +localStorage.getItem("jwt") 
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        });
    },[]);

    useEffect(()=>{
        if(image){
            const data = new FormData();
            data.append("file",image);
            data.append("upload_preset","insta-clone");
            data.append("cloud_name","lordvendrik");
            fetch("	https://api.cloudinary.com/v1_1/lordvendrik/image/upload",{
                method:"Post",
                body:data
            }).then(res=>res.json())
            .then(data=>{
                fetch("/updatepic",
                {
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result);
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            })
            .catch(err=>{
                console.log(err)
            });
        }
    },[image])
    
    const updatePhoto = (file)=>{
        setImage(file)
    }

    return (

        <div style={{maxWidth:"1000px",margin:"0px auto"}}>
            <div style={{margin:"18px 0px",borderBottom:"1px solid grey"}}>

            
            <div style={{display:"flex",justifyContent:"space-around"}}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={state?state.pic:"loading"} alt=""/>
                </div>
                    <div>
                    <h4>{state?state.Username:"loading"}</h4>
                    <h4>{state?state.Email:"loading"}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h5>{myPics.length} posts</h5>
                        <h5>{state?state.followers.length:"0"} followers</h5>
                        <h5>{state?state.following.length:"0"} following</h5>
                    </div>
                    </div>
            </div>
            <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn waves-effect waves-light darken-1">
                        <span>Update Profile Pic</span>
                        <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
            </div>

            <div className="gallery">
                {
                    myPics.map(item=>{
                        return(
                            <img key={item._id} className="items" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        
        </div>
    )
}

export default Profile;