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
  const [phone, createPhone] = useState('')
  const [adresse, createAdresse] = useState('')
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
    if (name.trim() === '' || adresse === '' || phone.trim() === '') {
      setErrorForm(true);

      return;
    }else{
      setErrorForm(false);

    const formData = {
      "name": name,
      "phone": phone,
      "adresse": adresse
    }
    try {
      setLoading(true)
      MyRequest('supliers', 'POST', formData, {'Content-Type': 'application/json'})
        .then(async (response) => {
          if (response.status === 200) {
            setSuccess(true)

            {
              success &&
              createAdresse('')
              createName('')
              createPhone('')
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
                    label={t("phone")}
                    variant="outlined"
                    fullWidth
                    value={phone}
                    onChange={(e) => createPhone(e.target.value)}
                    error={errorForm && phone === ''}
                    helperText={errorForm && phone === '' ? t('is required') : ''}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label={t("adresse")}
                    variant="outlined"
                    fullWidth
                    value={adresse}
                    onChange={(e) => createAdresse(e.target.value)}
                    error={errorForm && adresse === ''}
                    helperText={errorForm && adresse === '' ? t('is required') : ''}
                  >
                  </TextField>
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
