import React from 'react';
import APIURL from '../helpers/environment';
import '../App.css';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Button, Fab, GridList, GridListTile } from '@material-ui/core';
import { BoardResponse } from './BoardInterface';
import BoardUpdate from './BoardUpdate';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import BoardCreate from './BoardCreate';
import OpenWithIcon from '@material-ui/icons/OpenWith';

export interface BoardDisplayProps {
  token: any
  fetchBoards: any
  boards: BoardResponse[]
  setSelectedBoardId: any
}

export interface BoardDisplayState {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 450,
      height: 500,
      padding: 15,
      margin: 10,

    },

    media: {
      height: 250,
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      position: 'absolute',
      maxWidth: 450,
      height: 400,
      padding: 10,
      margin: 10,
      backgroundColor: theme.palette.background.paper,
      border: '0.4em solid #5D88D2',
      boxShadow: theme.shadows[5],
      textAlign: 'center'
    },
    paper1: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    }
  }),
);


export default function BoardDisplay(props: BoardDisplayProps) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [boardRow, setBoardRow] = React.useState({})

  const handleOpen = (board: BoardResponse) => {
    setBoardRow(board)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDelete = (board: BoardResponse) => {
    setBoardRow(board);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  //DELETE board
  const deleteBoard = (boardRow: any) => {
    fetch(`${APIURL}/api/board/delete/${boardRow.id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': props.token
      })
    })
      .then(() => props.fetchBoards());
      handleCloseDelete();
  }

  const boardsMapping = () => {
    return (props.boards.map((board: BoardResponse, index: number) => {
      var itemRouteUrl = `display-board-contents/${board.id}`
      return (
        <GridListTile>
          <Card className={classes.root} key={index}>
            <CardActionArea>
              {board.image ?
                <CardMedia
                  className={classes.media}
                  image={board.image}
                /> :
                <CardMedia

                  className={classes.media}
                  image="https://miro.medium.com/max/11232/0*QU7D58Yw4z8sjXEx"

                // <CloudinaryContext cloudName="verasenv">
                //   <Image publicId="vision-board_svj19q" width="0.4" crop="scale" />
                // </CloudinaryContext>
                />
              }

              <CardActions style={{ alignItems: 'center', padding: '10px', textAlign: 'center', display: 'flex', justifyContent: 'space-evenly' }}>
                <Fab
                  size="small"
                >
                  <Link to={itemRouteUrl} onClick={() => props.setSelectedBoardId(board.id)} ><OpenWithIcon color='action' /></Link>
                </Fab>
                <Fab onClick={() => handleOpen(board)}
                  size="small"
                  type="button"
                  color="primary"
                >
                  <EditIcon />
                </Fab>

            
                <Fab onClick={() => handleOpenDelete(board)}
                  size="small"
                  color="secondary"
                >
                  <DeleteIcon />
                </Fab>

                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <Fade in={open}>
                    <Container className={classes.paper}>
                      <BoardUpdate
                        fetchBoards={props.fetchBoards}
                        token={props.token}
                        boardToUpdate={boardRow}
                        handleClose={handleClose}
                      />
                      <br />
                      <br />
                      <Fab
                        style={{ margin: '5px', alignItems: 'right' }}
                        onClick={handleClose}
                        size="small"
                      >
                        <CancelOutlinedIcon />
                      </Fab>
                    </Container>
                  </Fade>
                </Modal>

                <Modal
                    className={classes.modal}
                    open={openDelete}
                    onClose={handleCloseDelete}>
                    <Fade in={openDelete}>
                        <div className={classes.paper1}>
                            <Typography variant="h5" color="textSecondary" component="p">
                              Are you sure you want to delete this board and all items?</Typography>
              
                            <Button onClick={() => deleteBoard(boardRow)}
                            size="small"
                            variant="contained"
                            style={{margin: '10px'}}>
                            Yes
                            </Button>

                            <Button onClick={handleCloseDelete}
                            size="small"
                            color='secondary'
                            variant="contained">
                              No
                              </Button>
                        </div>
                    </Fade>
                </Modal>


              </CardActions>
              <CardContent >
                <Typography variant="h5" color="textSecondary" component="p">
                  {board.boardTitle}
                </Typography>
                <Typography variant="h6" style={{ textOverflow: 'hidden' }}
                  color="textSecondary" component="p">
                  {board.description}
                </Typography>
                <Typography variant="h6" color="textSecondary" component="p">
                  {board.tags}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card >
        </GridListTile>
      )
    })
    )
  }
  return (
    <div>

      <GridList cellHeight={500} cols={2}>
        <GridListTile>
          <BoardCreate
            fetchBoards={props.fetchBoards}
            token={props.token} />
        </GridListTile>
        {boardsMapping()}

      </GridList>
    </div>
  )
}
