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
import React, {useEffect, useState} from "react";
import Spinner from "../../@core/components/spinner";
import Error500 from "../../pages/500";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import { useDropzone } from 'react-dropzone';
import FileUploaderSingle from "./upload";
import {UploadImage} from "../uploadImage/uploadImage";
import {useAuth} from "../../hooks/useAuth";


const EditModal = ({open,setOpen,data}) => {


  console.log(data)
console.log(data)
  //create new post
  const [image, createimage] = useState([])
  const [name, createName] = useState(data.name)
  const [price, createPrice] = useState(data.price)
  const [stock, createStock] = useState(data.stock)
  const [alert, createAlert] = useState(data.alert)
  const [suplier, createSuplier] = useState(data.suplier ? data.suplier.id : '')
  const [categorie, createCategorie] = useState(data.categorie ? data.categorie.id : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorForm, setErrorForm] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message
  const [dataCategorie, setDataCategorie] = useState([]);
  const [dataSuplier, setDataSuplier] = useState([]);

  const router = useRouter();

  useEffect(() => {
    console.log(data)
    createName(data.name);
    createPrice(data.price);
    createStock(data.stock);
    createAlert(data.alert);
    createSuplier(data.suplier ? data.suplier.id : '');
    createCategorie(data.categorie ? data.categorie.id : '');

  }, [data,success]);



  useEffect(() => {
    const fetchData = async () => {
      await MyRequest('categories', 'GET', {}, {'Content-Type': 'application/json'})
        .then((response) => {
          setDataCategorie(response.data)
        });
      await MyRequest('supliers', 'GET', {}, {'Content-Type': 'application/json'})
        .then((response) => {
          setDataSuplier(response.data)
        });

    };

    fetchData();
  }, [router.query]);

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
  const auth = useAuth()
console.log(auth.user.id)
  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = {
      'name': name,
      'price': price,
      'categorie': categorie.id,
      'suplier': suplier.id,
      'stock': stock,
      'alert': alert,
      'user':auth.user.id
    }
    if (name.trim() === '' || categorie === '' || String(stock).trim() === '' || String(price).trim() === '') {
      setErrorForm(true);

      return;
    }else{
      setErrorForm(false);

      try {
        setLoading(true)
        MyRequest('products/'+data.id, 'PUT', formData, {'Content-Type': 'application/json'})
          .then(async (response) => {
            if (response.status === 200) {
              setSuccess(true)

              await refreshData()
              setOpen(false)

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
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("name")}
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => createName(e.target.value)}
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
                  label={t("categorie")}
                  variant="outlined"
                  fullWidth
                  value={categorie}
                  onChange={(e) => createCategorie(e.target.value)}
                  error={errorForm && categorie === ''}
                  helperText={errorForm && categorie === '' ? t('is required') : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {dataCategorie.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  select
                  label={t("suplier")}
                  variant="outlined"
                  fullWidth
                  value={suplier}
                  onChange={(e) => createSuplier(e.target.value)}
                  error={errorForm && suplier === ''}
                  helperText={errorForm && suplier === '' ? t('is required') : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {dataSuplier.map((suplier) => (
                    <MenuItem key={suplier.id} value={suplier.id}>
                      {suplier.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>


              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("stock")}
                  variant="outlined"
                  fullWidth
                  value={stock}
                  onChange={(e) => createStock(e.target.value)}
                  error={errorForm && String(stock).trim() === ''}
                  helperText={errorForm && stock.trim() === '' ? t('is required') : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label={t("price")}
                  variant="outlined"
                  type="price"
                  fullWidth
                  value={price}
                  onChange={(e) => createPrice(e.target.value)}
                  error={errorForm && price.trim() === ''}
                  helperText={errorForm && price.trim() === '' ? t('is required') : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid> <Grid item xs={12} lg={6}>
                <TextField
                  label={t("alert")}
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={alert}
                  onChange={(e) => createAlert(e.target.value)}
                  error={errorForm && alert.trim() === ''}
                  helperText={errorForm && alert.trim() === '' ? t('is required') : ''}
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
