import React,{useEffect,useState,useContext} from "react";
import {userContext} from "../../App";
import {useParams} from "react-router-dom";

function Profile() {
    const [userProfile,setProfile] = useState(null);
    const [showFollow,setShowFollow] = useState(true);
    const {state,dispatch} = useContext(userContext);
    const {userid} = useParams();

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization": "Bearer " +localStorage.getItem("jwt") 
            }
        }).then(res=>res.json())
        .then(result=>{
            setProfile(result);
        });
    },[]);

    const followUser = ()=>{
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })

            setShowFollow(false);
        })
    }

    const unfollowUser = ()=>{
        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id);
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true);
        })
    }
    
    return (
        <>

        {userProfile? 

        <div style={{maxWidth:"1000px",margin:"0px auto"}}>
            <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0px",borderBottom:"1px solid grey"}}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={userProfile.user.pic} alt=""/>
                </div>
                <div>
                    <h4>{userProfile.user.Username}</h4>
                    <h5>{userProfile.user.Email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h5>{userProfile.posts.length} posts</h5>
                        <h5>{userProfile.user.followers.length} followers</h5>
                        <h5>{userProfile.user.following.length} following</h5>
                    </div>

                    {userProfile.user.followers.includes(state._id)?
                    <button style={{
                        margin:"10px"
                    }} 
                    className="btn waves-effect waves-light" onClick={()=>unfollowUser()}>
                    unfollow
                    </button>
                    :
                    <button style={{
                    margin:"10px"
                    }} 
                    className="btn waves-effect waves-light" onClick={()=>followUser()}>
                        follow
                    </button>  
                    }
                    
                </div>
            </div>

            <div className="gallery">
                {
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className="items" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        
        </div>

        :<h2>Loading...!</h2>}
        </>
    )
}

export default Profile;