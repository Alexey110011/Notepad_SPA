//import { useActionData } from 'react-router-dom'
import * as constants from './types'

export const add_note = (items) =>{
    return {
        type:constants.ADD_NOTE,
        items
    }
}

export const remove_note = (id) => {
    return {
        type:constants.REMOVE_NOTE,
        id
    }
}

export const edit_note = (editedNote) => {
    return {
        type:constants.EDIT_NOTE,
       editedNote
    }
}

export const change_note = (id) => {
    return {
        type:constants.CHANGE_NOTE,
        id
    }
}

export const add_search = (search)=>{
    return {
        type:constants.ADD_SEARCH,
        search
    }
}

export const remove_search = ()=>{
    return {
        type:constants.ADD_SEARCH,
    }
}