import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CustomAvatar from "../../@core/components/mui/avatar";
import Typography from "@mui/material/Typography";
import CustomChip from "../../@core/components/mui/chip";
import Box from "@mui/material/Box";
import Icon from "../../@core/components/icon";
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import Image from "next/image";


const roleColors = {
  admin: 'error',
  client: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}


const ViewModal = ({ open, setOpen, data }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const {t, i18n} = useTranslation()

  if (data) {
    return (
      <Dialog
        maxWidth="xl"
        open={open}

        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center' }}>{t('view')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={6}>
            <Grid item xs={12} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{borderRadius:3}}>
              <Image
                src={'http://127.0.0.1:8000/storage/product/' + data.picture}
                width={300}
                layout="responsive"
                height={300}
                alt="image" />
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
            <Card>
              <CardContent sx={{pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <Typography variant='h6' sx={{mb: 2}}>
                  {data.name}
                </Typography>
                <Grid container>
                  <Grid item xs={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
               Price:
                  </Grid>
                  <Grid item xs={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>

                  <CustomChip
                  skin='light'
                  size='small'
                  label={data.price}
                  color={"info"}
                  sx={{
                    height: 20,
                    fontWeight: 600,
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': {mt: -0.25}
                  }}
                />
                  </Grid>
                </Grid>
              </CardContent>

              <CardContent sx={{my: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Box sx={{mr: 8, display: 'flex', alignItems: 'center'}}>
                    <CustomAvatar skin='light' variant='rounded' sx={{mr: 3}}>
                      <Icon icon='solar:tag-price-bold'/>
                    </CustomAvatar>
                    <div>
                      <Typography variant='h6' sx={{lineHeight: 1.3}}>
                        {data.vendue}
                      </Typography>
                      <Typography variant='body2'>Sell</Typography>
                    </div>
                  </Box>
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <CustomAvatar skin='light' variant='rounded' sx={{mr: 3}}>
                      <Icon icon='healthicons:rdt-result-out-stock'/>
                    </CustomAvatar>
                    <div>
                      <Typography variant='h6' sx={{lineHeight: 1.3}}>
                        {data.stock}
                      </Typography>
                      <Typography variant='body2'>Quantity</Typography>
                    </div>
                  </Box>
                </Box>
              </CardContent>

              <CardContent>
                <Typography variant='h6'>Details</Typography>
                <Divider sx={{mt: theme => `${theme.spacing(4)} !important`}}/>
                <Box sx={{pt: 2, pb: 1}}>
                  <Box sx={{display: 'flex', mb: 2.7}}>
                    <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                      {t('name')}:
                    </Typography>
                    <Typography variant='body2'>{data.name}</Typography>
                  </Box>
                  <Box sx={{display: 'flex', mb: 2.7}}>
                    <Typography variant='subtitle2' sx={{mr: 2, color: 'text.primary'}}>
                      {t('alert')}:
                    </Typography>
                    <Typography variant='body2'>{data.alert}</Typography>
                  </Box>

                  <Box sx={{display: 'flex', mb: 2.7}}>
                    <Typography sx={{mr: 2, fontWeight: 500, fontSize: '0.875rem'}}>{t('categorie')}:</Typography>
                    <Typography variant='body2' sx={{textTransform: 'capitalize'}}>
                      {data.categorie && data.categorie.name}
                    </Typography>
                  </Box>
                   <Box sx={{display: 'flex', mb: 2.7}}>
                    <Typography sx={{mr: 2, fontWeight: 500, fontSize: '0.875rem'}}>{t('suplier')}:</Typography>
                    <Typography variant='body2' sx={{textTransform: 'capitalize'}}>
                      {data.suplier && data.suplier.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t('created at')}:</Typography>
                    <Typography variant='body2'>{new Date(data.created_at).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t('updated at')}:</Typography>
                    <Typography variant='body2'>{new Date(data.updated_at).toLocaleString()}</Typography>
                  </Box>


                </Box>
              </CardContent>
            </Card>
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ViewModal;
