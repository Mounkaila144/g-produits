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


const Add = ({open,setOpen}) => {



  //create new post
  const [image, createimage] = useState([])
  const [name, createName] = useState('')
  const [price, createPrice] = useState('')
  const [stock, createStock] = useState('')
  const [alert, createAlert] = useState('')
  const [suplier, createSuplier] = useState('')

  const [categorie, createCategorie] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorForm, setErrorForm] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message
  const [dataCategorie, setDataCategorie] = useState([]);
  const [dataSuplier, setDataSuplier] = useState([]);

  const router = useRouter();

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

  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('categorie', categorie);
    formData.append('suplier', suplier);
    formData.append('stock', stock);
    formData.append('alert', alert);
    formData.append('picture', image);

    if (name.trim() === '' || categorie === '' || stock.trim() === '' ||alert.trim() === '' || price.trim() === '') {
      setErrorForm(true);

      return;
    }else{
      setErrorForm(false);

    try {
      setLoading(true)
      MyRequest('products', 'POST', formData, {'Content-Type': 'multipart/form-data'})
        .then(async (response) => {
          if (response.status === 200) {
            setSuccess(true)

            {
              success &&
              createStock('')
              createName('')
              createSuplier('')
              createCategorie('')
              createPrice('')
              createAlert('')
              createimage([])
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
  const getImage = (image) => {
    // 👇️ take parameter passed from Child component
    createimage(image);
  };

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
                    label={t("categorie")}
                    variant="outlined"
                    fullWidth
                    value={categorie}
                    onChange={(e) => createCategorie(e.target.value)}
                    error={errorForm && categorie === ''}
                    helperText={errorForm && categorie === '' ? t('is required') : ''}
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
                    error={errorForm && stock.trim() === ''}
                    helperText={errorForm && stock.trim() === '' ? t('is required') : ''}
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
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    label={t("alert")}
                    variant="outlined"
                    type="alert"
                    fullWidth
                    value={alert}
                    onChange={(e) => createAlert(e.target.value)}
                    error={errorForm && alert.trim() === ''}
                    helperText={errorForm && alert.trim() === '' ? t('is required') : ''}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <UploadImage image={getImage}/>
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
