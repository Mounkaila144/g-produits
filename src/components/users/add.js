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
import {useTranslation} from "react-i18next";


const Add = ({open,setOpen}) => {



  //create new post
  const [name, createName] = useState('')
  const [password, createPassword] = useState('')
  const [email, createEmail] = useState('')
  const [role, createRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorForm, setErrorForm] = useState(false)
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
         setError(true)
        });

    } catch (e) {
      setError(true)
    }
    }

  }
  const {t, i18n} = useTranslation()

  //fin
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
              {t('add')}
            </DialogTitle>
            {success && (
              <Alert variant='filled' severity='success'>
                {t('success creation')}
              </Alert>
            )}
            {errorForm && (
              <Alert variant='filled' severity='error'>
                {t('an error occurred')}
              </Alert>
            )

            }
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label={t("name")}
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => createName(e.target.value)}
                    error={errorForm && name.trim() === ''}
                    helperText={errorForm && name.trim() === '' ? t('is required') : ''}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    select
                    label={t("role")}
                    variant="outlined"
                    fullWidth
                    value={role}
                    onChange={(e) => createRole(e.target.value)}
                    error={errorForm && role === ''}
                    helperText={errorForm && role === '' ? t('is required') : ''}
                  >
                    <MenuItem value={t("admin")}>{t("admin")}</MenuItem>
                    <MenuItem value={t("client")}>{t("client")}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label={t("email")}
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => createEmail(e.target.value)}
                    error={errorForm && email.trim() === ''}
                    helperText={errorForm && email.trim() === '' ? t('is required') : ''}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label={t("password")}
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => createPassword(e.target.value)}
                    error={errorForm && password.trim() === ''}
                    helperText={errorForm && password.trim() === '' ? t('is required') : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DialogActions className='dialog-actions-dense'>
                    <Button onClick={onSubmit}>{t('ok')}</Button>
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
