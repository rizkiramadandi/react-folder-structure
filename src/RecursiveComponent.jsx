import { File, ACTION_TYPE } from './App'
import FileImage from './assets/file.svg'
import FolderImage from './assets/folder.svg'

export default function RecursiveComponent({ data, dispatch }) {
    function toggle(id, isActive) {
        dispatch({type: ACTION_TYPE.TOGGLE_ACTIVE, payload: { id: id, isActive: !isActive }})
    }

    function newFile(id, file) {
        dispatch({type: ACTION_TYPE.NEW_FILE, payload: { id: id, file: file }})
    }

    function deleteFile(id) {
        if(confirm('Are you sure want to do this action?')) dispatch({type: ACTION_TYPE.DELETE_FILE, payload: { id: id }})
    }

    return (
        <div style={{ paddingLeft: '20px' }}>
            { data.map(d => {
                return (
                    <div key={d.getId()}>
                        <span className='data'>
                            <img src={ d.getIsFolder() ? FolderImage : FileImage } alt="SVG"/>
                            <span>{ d.getName() }</span>
                        </span>

                        { d.getParentId() ? (
                        <button role="button" onClick={() => deleteFile(d.getId())}>
                            Delete
                        </button>
                        ) : (<></>) }

                        { d.getIsFolder() ? (
                            <>
                                <button role="button" onClick={() => newFile(d.getId(), new File({isFolder: true, name: 'folder', parentId: d.getId()}))}>
                                    New Folder
                                </button>
                                <button role="button" onClick={() => newFile(d.getId(), new File({name: 'file', parentId: d.getId() }))}>
                                    New File
                                </button>
                            </>
                        ) : (
                            <></>
                        )
                        }

                        { d.getIsActive() ? ( 
                            <>
                                { d.getChildren().length > 0 ? (
                                    <button role="button" onClick={() => toggle(d.getId(), d.getIsActive())}>
                                        Hide Children
                                    </button>
                                    ) : (<></>) 
                                }
                                <div>
                                    <RecursiveComponent data={d.getChildren()} dispatch={dispatch} />
                                </div>
                            </>
                        ) : (
                            <>
                            { d.getChildren().length > 0 ? (
                                <button role="button" onClick={() => toggle(d.getId(), d.getIsActive())}>
                                    Show Children
                                </button>
                                ) : (<></>) }
                            </>
                        ) }
                    </div>
                )
            }) }
        </div>
    )
}