import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Gavel from "@material-ui/icons/Gavel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import withStyles from "@material-ui/core/styles/withStyles";
import {signUpUser} from "../lib/auth";
import Link from 'next/link';

function Transition(props) {
  return <Slide direction='up' {...props}/>;
}

class Signup extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    error: '',
    openError: false,
    openSuccess: false,
    isLoading: false,
    createdUser: ''
  };

  handleClose = () => {
    this.setState({openError: false});
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  showError = (err) => {
    const error = err.response && err.response.data || err.message;
    this.setState({openError: true, error, isLoading: false, createdUser: ''});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {name, email, password} = this.state;

    this.setState({isLoading: true, error: ''});

    const user = {name, email, password};
    signUpUser(user)
        .then(createdUser => {
          console.log(createdUser);
          this.setState({
            isLoading: false,
            createdUser,
            error: '',
            openSuccess: true
          })
        })
        .catch(this.showError);
  }

  render() {
    const {classes} = this.props;
    const {error, openError, openSuccess, createdUser, isLoading} = this.state;
    return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <Gavel/>
            </Avatar>
            <Typography variant='h5' component='h1'>
              Sign Up
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor="name">Name</InputLabel>
                <Input type="text" id='name' name='name' onChange={this.handleChange}/>
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <Input type="email" name='email' onChange={this.handleChange}/>
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='password'>Password</InputLabel>
                <Input type="password" name='password' onChange={this.handleChange}/>
              </FormControl>
              <Button type='submit'
                      fullWidth
                      variant='contained'
                      color='primary'
                      className={classes.submit}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Button>
            </form>
            {
              error && <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  open={openError}
                  onClose={this.handleClose}
                  autoHideDuration={6000}
                  message={<span className={classes.snack}>{error}</span>}
              />
            }
          </Paper>

          <Dialog open={openSuccess} disableBackdropClick={true} TransitionComponent={Transition}>
            <DialogTitle>
              <VerifiedUserTwoTone className={classes.icon}/>
              New Account
            </DialogTitle>
            <DialogContent>
              <DialogContentText>User {createdUser} successfully created!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color='primary' variant='contained'>
                  <Link href='/signin'>
                    <a className={classes.signinLink}>sign in</a>
                  </Link>
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    )
  }
}

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  signinLink: {
    textDecoration: "none",
    color: "white"
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.secondary.light
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  }
});

export default withStyles(styles)(Signup);
