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


const EditModal = ({open,setOpen,data}) => {

  console.log(data)

  //edit new post
  const [name, editName] = useState(data.name);
  const [email, editEmail] = useState(data.email);
  const [role, editRole] = useState(data.role);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message

  const [errorForm, setErrorForm] = useState(false)
  const [errorText, setErrorText] = useState("une eureur c'est produits ")
  const router = useRouter();

  useEffect(() => {
    editName(data.name);
    editEmail(data.email);
    editRole(data.role);
  }, [data,success]);


  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 20000);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  const refreshData = () => {
    router.push({pathname: router.pathname, query: {refresh: Date.now()}});
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (name.trim() === '' || role === '' || email.trim() === '') {
      setErrorForm(true);

      return;
    }else{
      setErrorForm(false);

      const formData = {
        "name": name,
        "role": role,
        "email": email
      }
      try {
        setLoading(true)
        MyRequest('users/'+data.id, 'PUT', formData, {'Content-Type': 'application/json'})
          .then(async (response) => {
            if (response.status === 200) {
              setSuccess(true)

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
            Edit user
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
                  onChange={(e) => editName(e.target.value)}
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
                  onChange={(e) => editRole(e.target.value)}
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
                  onChange={(e) => editEmail(e.target.value)}
                  error={errorForm && email.trim() === ''}
                  helperText={errorForm && email.trim() === '' ? 'Email is required' : ''}
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

export default EditModal;
