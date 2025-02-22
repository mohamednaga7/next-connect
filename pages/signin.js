import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Lock from "@material-ui/icons/Lock";
import withStyles from "@material-ui/core/styles/withStyles";
import {signInUser} from "../lib/auth";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Link from "next/link";
import Router from 'next/router';

class Signin extends React.Component {
  state = {
    email: '',
    password: '',
    error: '',
    openError: false,
    isLoading: false,
  };

  handleClose = () => {
    this.setState({openError: false});
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  showError = (err) => {
    const error = err.response && err.response.data || err.message;
    this.setState({openError: true, error, isLoading: false});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {email, password} = this.state;

    this.setState({isLoading: true, error: ''});

    const user = {email, password};
    signInUser(user)
        .then(() => {
          Router.push('/')
        })
        .catch(this.showError);
  }

  render() {
    const {classes} = this.props;
    const {error, openError, isLoading} = this.state;
    return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <Lock/>
            </Avatar>
            <Typography variant='h5' component='h1'>
              Sign In
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
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
                      className={classes.submit}>{isLoading ? 'Signing In...' : 'Sign In'}</Button>
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
    color: theme.palette.protectedTitle
  }
});

export default withStyles(styles)(Signin);
