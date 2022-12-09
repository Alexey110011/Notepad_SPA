import {useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {add_note,remove_note, edit_note,change_note, add_search, remove_search} from './actions'
import { useParams, Link, BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { v4 } from 'uuid'
import './App.css';


export default function App() {
      return (
      <Router>
        <ul className = "nav">
        <Link to="/" className = "nav-link text-warning">Home</Link>
        <Link to="/about" className = "nav-link text-warning">About</Link>
        <Link to="/postList" className = "nav-link text-warning">Posts</Link>
        </ul>
        <Routes>
          <Route path='/' element={<Home />}/> 
          <Route path='about' element={<About />}/> 
          <Route path='postList' element={<Form />}/>
          <Route path = "postList/:postId" element = {<SelectedPost/>}/>
        </Routes>
      </Router>
    )
  }
      
export function Form() {
  const items = useSelector(state=>state.items)
  const editedNote = useSelector(state=>state.editedNote)
  const search = useSelector(state=>state.search)
  const dispatch = useDispatch()   

   async function callBackendAPI(){
    const response = await fetch('/t', {
      method: "POST",
        body:JSON.stringify({
         items:items}
        ),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
    }})
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.message) 
    }console.log(body)
    return body;
}

  function handleSubmit(post/*:string*/) {
    const pattern = /(#[a-zа-я\d-]+)/gi
    const tag = post.match(pattern)
    console.log(tag)
    if (pattern.test(post)) {
      const items1 = [...items,
      {
        post,
        tag: tag ? tag[0] : null,
        id: v4()
      }]
      dispatch(add_note(items1))
    } else {
      const items1 = [...items,
      {
        post,
        tag: null,
        id: v4()
      }]
      dispatch(add_note(items1))
    }
    callBackendAPI()
    console.log(items)
  }

  function handleFirstEdit(id) {
    const edited = items.filter(item=>item.id===id) 
    const editedItem = edited
    dispatch(edit_note(editedItem))
    console.log(editedItem, editedNote)
  }

    function handleChange(e) {
    let search_1 = e.target.value
    console.log(search_1)
    dispatch(add_search(search_1))
  }
  return (
    <div>
     <Note onHandleSubmit = {handleSubmit}/>
     <PostList items= {items} onEdit = {handleFirstEdit} search={search}/>
     <TagList items = {items} onEdit = {handleFirstEdit} handleChange = {handleChange}/>
    </div>
 )
}

const Note = ({ onHandleSubmit = f => f, onHandleEdit = f => f, changePost = f => f, handleClear = f => f}) => {
  const noteRef = useRef()
  let _note
  
  const submit = (e) => {
    e.preventDefault()
    _note = noteRef.current.value
    onHandleSubmit(_note)
    handleClear()
    noteRef.current.value = ''
  }
  return (
    <form className="sometext">
      <textarea className = "form-control ta" ref={noteRef} placeholder="Enter text"></textarea>
      <button className = "btn btn-success save_" onClick={submit}>Save</button>
    </form>
  )
}

export function Home() {
  return (
    <div className = "header-nav">
      <h1>Create new note</h1>
      <Link to = "/postList"><button style ={{backgroundColor:"orange", color:"white", borderRadius:"50%", width:"35px", height:"35px", border: "none"}}>+</button></Link> 
    </div>
  )
}

export function About() {
  return (
    <div className = "header-nav" >
      <h1>About</h1>
    </div>
  )
}


const PostList =({items,search,onRemove,onEdit})=>{
  console.log(items)  
  if(items){
  return (
      <div style = {{marginTop:"-25px"}}>
        {items.map(item=> 
          <div key = {item.id}>
            <Link to ={`/postList/${item.id}`}>
              <div>
                  <Post {...item}
                  onRemove = {()=>onRemove(item.id)}
                  onEdit = {() =>onEdit(item.id)}
                  search={search}/>
              </div>
            </Link>
        </div>)}
      </div>
  )} else {return null}
 }

 const Post=({post, id, search, onRemove, onEdit})=> {
  const dispatch = useDispatch()
  if(!search) {
      return(
      <div className = "post" onClick = {onEdit}>
         {post}
      </div>
      )
  } 
  const regex = new RegExp(`(${search})`,'gi')
  const parts = post.split(regex)

  if(regex.test(post)){
      console.log(parts)
      return(
      <div className = "post">
       <Link to = {`/postList/${id}`} onClick= {()=>dispatch(remove_search())}>
        <span>
          {parts.map((part,i)=>{
          return regex.test(part)?(
          <mark style={{marginLeft:"-2px"}} key = {i}>{part}</mark>)
          :(
              <span key = {i}>{part} </span>
          );
          })}
              </span> </Link>
      </div>
      )} else {return null}
  }

  const Tag = ({tag, onEdit})=> {
    if(tag){
    return(
         <div className = "tag" onClick={onEdit}>
         {tag}
    </div>
    )}
        else {return null}
}

const TagList =({items, onEdit, handleChange})=>{
    if(items){
    return (
        <div>
           <input type= "search" placeholder = "Search by #tag" onChange={handleChange} className = "form-control" style={{width:"250px"}}></input>
           <div style = {{color: "white"}}><b>#Tag List</b></div>
           {items.map(item=> 
              <div key = {item.id}>
                <Link to ={`/postList/${item.id}`}>
                <Tag  {...item} 
                   onEdit ={()=>onEdit(item.id)} />
           </Link>
                </div>
           )}
        </div>
    )} else {return null}
}

const SelectedPost=()=>{
  const items = useSelector(state=>state.items)
  const editedNote = useSelector(state=>state.editedNote)
  const dispatch = useDispatch()
  const noteRef = useRef()
  const params = useParams()
  console.log(params)
  const itemsSel = (items)?items.filter(item=>item.id===params.postId):null
 
  function handleRemove() {
    const items1 = itemsSel[0]
    dispatch(remove_note(items1.id))
  }

 function handleEdit() {
  console.log(editedNote)
  if(editedNote&&noteRef.current.value){
  editedNote[0].post = noteRef.current.value;
  
  changePost(editedNote[0].post)
  handleEdit1()}
 dispatch(change_note(editedNote[0]))
  console.log(editedNote[0].id)
 }

 function handleEdit1() {
  const items1 = items.map(item => {
    if (editedNote && item.id === editedNote[0].id) {
      return editedNote[0]
    } else {
      return item
    }
  })
  console.log(items1)
  dispatch(add_note(items1))
}

function changePost(post) {
  const pattern = /(#[a-zа-я\d-]+)/gi
  const tag = post.match(pattern)
  function obj3(objec) {
    if (objec && objec.length !== 0) {
      console.log(objec)
      objec.splice(0, 1, {
        post: post,
        id: objec[0].id,
        tag: tag ? tag[0] : null
      });
      return objec
    }
  }

  const editedItem1 = obj3(editedNote, post)
  dispatch(edit_note(editedItem1))
  
  console.log(editedItem1)
}
if(editedNote){
return(
  <div>
    <textarea  className = "form-control ta without" style={{display:"block", marginBottom:"10px"}} ref = {noteRef}></textarea><div className = "post">{(itemsSel)?itemsSel[0].post:null}</div>
    <button className = "btn btn-dark" onClick = {()=>noteRef.current.value = itemsSel[0].post}>Edit</button>
    <Link to="/postList">
      <button className = "btn btn-success margin-left" onClick = {handleEdit}>Save</button>
      <button className = "btn btn-danger margin-left" onClick={handleRemove}>Remove</button>
    </Link>
</div>
  )}else {return null}
}

 