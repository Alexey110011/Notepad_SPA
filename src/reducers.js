import {createSlice} from '@reduxjs/toolkit'
import * as types from './types'
const initialState = {
    items:[],
    editedNote:[],
    search:''
}

const reducer = (state=initialState, action)=>{
    switch(action.type){
        case types.ADD_NOTE:
            return {...state, items:action.items};
        case types.REMOVE_NOTE:
            return {...state,items:state.items.filter(item=>item.id!==action.id)};
        case types.EDIT_NOTE:
            return {...state, editedNote:action.editedNote};
        case types.CHANGE_NOTE:
            const changede = state.items.map(item=>{
                if(item.id===action.id) {
                return action
                }
                return item}
                );
            return {...state,items:changede};
         case types.ADD_SEARCH:
            return {...state, search:action.search}
         case types.REMOVE_SEARCH:
            return {...state, search:''}
            
            default: return state
    }
}

 export default reducer
 const noteSlice = createSlice({
    name:"note",
    initialState:{
        items:[],
        editedNote:[],
        search:''
    },
    reducers:{
        add_note:(state, action)=>{
            return {...state, items:action.items}
    }
    }
    })
 