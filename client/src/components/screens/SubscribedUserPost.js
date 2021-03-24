import React,{useState,useEffect,useContext} from "react";
import {userContext} from "../../App"
import {Link} from "react-router-dom"

function Home() {
    const [data,setData] = useState([]);
    const {state,dispatch} = useContext(userContext);
    useEffect(()=>{
        fetch("/getsubpost",{
            headers:{
                Authorization: "Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.post);
        })
    },[]);

    const likePost = (id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postID:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            });
            setData(newData);
        }).catch(err=>{
            console.log(err);
        })
    }

    const unlikePost = (id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postID:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            });
            setData(newData);
        }).catch(err=>{
            console.log(err);
        })
    }

    const makeComment = (text,postId)=>{
        fetch("/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postID:postId,
                text:text
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            });
            setData(newData);
        }).catch(err=>{
            console.log(err);
        })
    }

    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id !== result._id
            });
            setData(newData);
        })
    }

    const deleteComment = (postID,commentID)=>{
        fetch("/deletecomment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postID,
                commentID
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            });
            setData(newData);
        }).catch(err=>{
            console.log(err);
        })
    }

    return (
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>

                        <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id ?"/profile/"+item.postedBy._id:"/profile"}>{item.postedBy.Username}</Link> {item.postedBy._id == state._id &&  
                        <i className="material-icons" style={{float:"right"}}
                        onClick={()=>{deletePost(item._id)}}
                        >delete</i>
                        }
                        </h5>


                        <div className="card-image">
                            <img src={item.photo} alt=""/>
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            
                            {item.likes.includes(state._id)
                            ?
                                <i className="material-icons"
                                onClick={()=>{unlikePost(item._id)}}
                                >thumb_down</i>
                            :
                                <i className="material-icons"
                                onClick={()=>{likePost(item._id)}}
                                >thumb_up</i>
                            }
                           
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.comments.map(record=>{
                                    return(
                                        <h6 key={record._id}><span style={{fontWeight:"800"}}>{record.postedBy.Username+" : " }</span>{record.text}{record.postedBy._id == state._id &&  
                                            <i className="material-icons" style={{float:"right"}}
                                            onClick={()=>{deleteComment(item._id,record._id)}}
                                            >delete</i>
                                            }</h6>
                                    )
                                })
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makeComment(e.target[0].value,item._id);
                            }}>
                                <input type="text" placeholder="Add Comment"></input>
                            </form>
                        </div>
                    </div>
                    )
                })
            }
        </div>
    )
}

export default Home;