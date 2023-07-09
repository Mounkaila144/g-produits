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

  console.log(data)

  //edit new post
  const [name, editName] = useState(data.name);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message

  const [errorForm, setErrorForm] = useState(false)
  const router = useRouter();

  useEffect(() => {
    editName(data.name);
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
    if (name.trim() === '') {
      setErrorForm(true);

      return;
    }else{
      setErrorForm(false);

      const formData = {
        "name": name
      }
      try {
        setLoading(true)
        MyRequest('categories/'+data.id, 'PUT', formData, {'Content-Type': 'application/json'})
          .then(async (response) => {
            if (response.status === 200) {
              setSuccess(true)

              await refreshData()
              setOpen(false)

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
            {t('edit')}
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
              <Grid item xs={12} lg={12}>
                <TextField
                  label={t("name")}
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => editName(e.target.value)}
                  error={errorForm && name.trim() === ''}
                  helperText={errorForm && name.trim() === '' ? t('is required') : ''}
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
