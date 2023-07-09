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


const EditPicture= ({open,setOpen,data}) => {

  //create new post
  const [image, createimage] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorForm, setErrorForm] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message

  const router = useRouter();


  const refreshData = () => {
    router.push({pathname: router.pathname, query: {refresh: Date.now()}});
  }
  const auth = useAuth()
console.log(auth.user.id)
  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('picture', image);
      try {
        setLoading(true)
        MyRequest(`products/${data.id}/picture`, 'POST', formData, {'Content-Type': 'multipart/form-data'})
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
            {t('Edit picture')}
          </DialogTitle>
          {errorForm && (
            <Alert variant='filled' severity='error'>
              {t('an error occurred')}
            </Alert>
          )

          }
          <DialogContent>
            <Grid container spacing={2}>
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

export default EditPicture;
