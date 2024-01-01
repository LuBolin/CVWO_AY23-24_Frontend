import { Fab } from "@mui/material";
import { Fragment } from "react";
import AddIcon from '@mui/icons-material/Add';

interface NewPostBoxProps {
    onNewPost: () => void;
}

function NewPostButton({ onNewPost }: NewPostBoxProps) {
    return <Fragment>
        <Fab className='fab' onClick={onNewPost} color="primary" aria-label="add">
            <AddIcon />
        </Fab>
    </Fragment>
}

export default NewPostButton;