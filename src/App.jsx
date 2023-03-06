import { useReducer } from 'react'
import RecursiveComponent from './RecursiveComponent'

export const ACTION_TYPE = {
  NEW_FILE: 'new-file',
  DELETE_FILE: 'delete-file',
  TOGGLE_ACTIVE: 'toggle-active'
}

export class File {
  constructor({ isFolder = false, name = '', children = [], parentId = null }) {
    this.id = new Date().getTime() + Math.floor(Math.random() * 999)
    this.isFolder = isFolder
    this.name = name
    this.children = children
    this.isActive = true
    this.parentId = parentId
  }
  getId() {
    return this.id
  }
  getName() {
    return this.name
  }
  getIsFolder() {
    return this.isFolder
  }
  getIsActive() {
    return this.isActive
  }
  getChildren() {
    return this.children
  }
  getParentId() {
    return this.parentId
  }
  setIsActive(isActive) {
    this.isActive = isActive
  }
  pushChildren(file) {
    this.children.push(file)
  }
  setChildren(children) {
    this.children = [...children]
  }
}

function recusivelySetIsActive(id, isActive, list) {
  return list.map(l => {
    if(l.getId() === id) {
      l.setIsActive(isActive)
    }
    recusivelySetIsActive(id, isActive, l.getChildren())
    return l
  })
}

function recursivelyPushChildren(id, file, list) {
  return list.map(l => {
    if(l.getId() === id) {
      l.pushChildren(file)
    }
    recursivelyPushChildren(id, file, l.getChildren())
    return l
  })
}

function recursivelyDeleteFile(id, list) {
  return list.filter(l => {
    const check = l.getId() !== id
    l.setChildren(recursivelyDeleteFile(id, l.getChildren()))
    return check
  })
}

function reducer(structure, action) {
  switch(action.type) {
    case ACTION_TYPE.NEW_FILE:
      return recursivelyPushChildren(action.payload.id, action.payload.file, structure)
    case ACTION_TYPE.TOGGLE_ACTIVE:
      return recusivelySetIsActive(action.payload.id, action.payload.isActive, structure)
    case ACTION_TYPE.DELETE_FILE:
      return recursivelyDeleteFile(action.payload.id, structure)
    default:
      return structure
  }
}

function App() {
  const [structure, dispatch] = useReducer(reducer, 
    [
      new File({isFolder: true, name: 'root', children: []})
    ]
    )
  
  return (
    <>
      <RecursiveComponent data={structure} dispatch={dispatch} />
    </>
  )
}

export default App
