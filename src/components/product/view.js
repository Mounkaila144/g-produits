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

  const renderClient = row => {
    if (row.role === "admin") {
      return <CustomAvatar src={"/images/avatars/3.png"} variant='rounded'
                           alt={data.fullName}
                           sx={{width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem'}}/>
    } else {
      return <CustomAvatar src={"/images/avatars/1.png"} variant='rounded'
                           alt={data.fullName}
                           sx={{width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem'}}/>
    }
  }
  const {t, i18n} = useTranslation()

  if (data) {
    return (
      <Dialog
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" sx={{ textAlign: 'center' }}>{t('view')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    {renderClient(data)}
                  <Typography variant='h6' sx={{mb: 2}}>
                    {data.name}
                  </Typography>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={data.role}
                    color={roleColors[data.role]}
                    sx={{
                      height: 20,
                      fontWeight: 600,
                      borderRadius: '5px',
                      fontSize: '0.875rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': {mt: -0.25}
                    }}
                  />
                </CardContent>

                <CardContent sx={{my: 1}}>
                  <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Box sx={{mr: 8, display: 'flex', alignItems: 'center'}}>
                      <CustomAvatar skin='light' variant='rounded' sx={{mr: 3}}>
                        <Icon icon='mdi:check'/>
                      </CustomAvatar>
                      <div>
                        <Typography variant='h6' sx={{lineHeight: 1.3}}>
                          305
                        </Typography>
                        <Typography variant='body2'>Commande Done</Typography>
                      </div>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <CustomAvatar skin='light' variant='rounded' sx={{mr: 3}}>
                        <Icon icon='line-md:remove'/>
                      </CustomAvatar>
                      <div>
                        <Typography variant='h6' sx={{lineHeight: 1.3}}>
                          568
                        </Typography>
                        <Typography variant='body2'>Commande not done</Typography>
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
                        {t('email')}:
                      </Typography>
                      <Typography variant='body2'>{data.email}</Typography>
                    </Box>

                    <Box sx={{display: 'flex', mb: 2.7}}>
                      <Typography sx={{mr: 2, fontWeight: 500, fontSize: '0.875rem'}}>{t('role')}:</Typography>
                      <Typography variant='body2' sx={{textTransform: 'capitalize'}}>
                        {data.role}
                      </Typography>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                      <Typography sx={{mr: 2, fontWeight: 500, fontSize: '0.875rem'}}>{t('created at')}:</Typography>
                      <Typography variant='body2'>{data.created_at}</Typography>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                      <Typography sx={{mr: 2, fontWeight: 500, fontSize: '0.875rem'}}>{t('updated at')}:</Typography>
                      <Typography variant='body2'>{data.updated_at}</Typography>
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
