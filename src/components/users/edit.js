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


const EditModal = ({open,setOpen,data}) => {


  //edit new post
  const [name, editName] = useState(data.name);
  const [email, editEmail] = useState(data.email);
  const [role, editRole] = useState(data.role);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message

  const [errorForm, setErrorForm] = useState(false)
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
              setOpen(false)
            } else {
              setError(true)
            }
          }).finally(() => setLoading(false))
          .catch(error => {
            setError(true);
          });

      } catch (e) {
        setError(true)
      }
    }

  }
  const {t, i18n} = useTranslation()

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
            Edit
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
                  onChange={(e) => editName(e.target.value)}
                  error={errorForm && name.trim() === ''}
                  helperText={errorForm && name.trim() === '' ? t('is required') : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  select
                  label={t("role")}
                  variant="outlined"
                  fullWidth
                  value={role}
                  onChange={(e) => editRole(e.target.value)}
                  error={errorForm && role === ''}
                  helperText={errorForm && role === '' ? t('is required') : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  onChange={(e) => editEmail(e.target.value)}
                  error={errorForm && email.trim() === ''}
                  helperText={errorForm && email.trim() === '' ? t('is required') : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
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

export default EditModal;
