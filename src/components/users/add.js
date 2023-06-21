import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MyRequest from "../../@core/components/request";
import {useEffect, useState} from "react";
import Spinner from "../../@core/components/spinner";
import Error500 from "../../pages/500";
import {useRouter} from "next/router";


const Add = ({open,setOpen}) => {



  //create new post
  const [name, createName] = useState('')
  const [password, createPassword] = useState('')
  const [email, createEmail] = useState('')
  const [role, createRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorForm, setErrorForm] = useState(false)
  const [errorText, setErrorText] = useState("une eureur c'est produits ")
  const [success, setSuccess] = useState(false); // New state variable for success message
  const router = useRouter();


  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  const refreshData = () => {
    router.push({pathname: router.pathname, query: {refresh: Date.now()}});
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (name.trim() === '' || role === '' || email.trim() === '' || password.trim() === '') {
      setErrorForm(true);

      return;
    }else{
      setErrorForm(false);
    const formData = {
      "name": name,
      "password": password,
      "role": role,
      "email": email
    }
    try {
      setLoading(true)
      MyRequest('register', 'POST', formData, {'Content-Type': 'application/json'})
        .then(async (response) => {
          if (response.status === 200) {
            setSuccess(true)

            {
              success &&
              createEmail('')
              createName('')
              createRole('')
              createPassword('')
            }
            await refreshData()

            setErrorForm(false)

          } else {
            setError(true)
          }
        }).finally(() => setLoading(false))
        .catch(error => {
          setErrorText("une eureur c'est produits ");
        });

    } catch (e) {
      setError(true)
    }
    }

  }

    return (

      <Dialog
        maxWidth={'sm'}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        {loading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : error ? (
          <Error500 />
        ) : (
          <>
            <DialogTitle id='form-dialog-title' sx={{ textAlign: 'center' }}>
              Add user
            </DialogTitle>
            {success && (
              <Alert variant='filled' severity='success'>
                l'utilisateur a bien ete cree
              </Alert>
            )}
            {errorForm && (
              <Alert variant='filled' severity='error'>
                {errorText}
              </Alert>
            )

            }
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => createName(e.target.value)}
                    error={errorForm && name.trim() === ''}
                    helperText={errorForm && name.trim() === '' ? 'Name is required' : ''}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    select
                    label="Role"
                    variant="outlined"
                    fullWidth
                    value={role}
                    onChange={(e) => createRole(e.target.value)}
                    error={errorForm && role === ''}
                    helperText={errorForm && role === '' ? 'Role is required' : ''}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="client">Client</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => createEmail(e.target.value)}
                    error={errorForm && email.trim() === ''}
                    helperText={errorForm && email.trim() === '' ? 'Email is required' : ''}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => createPassword(e.target.value)}
                    error={errorForm && password.trim() === ''}
                    helperText={errorForm && password.trim() === '' ? 'Password is required' : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DialogActions className='dialog-actions-dense'>
                    <Button onClick={onSubmit}>Envoyer</Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    );
};

export default Add;
