// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

const salesData = [
  {
    stats: '8,458',
    color: 'primary',
    title: 'User',
    icon: <Icon icon='mdi:account-outline' />
  },
  {
    stats: '$28.5k',
    color: 'warning',
    title: 'Total Profit',
    icon: <Icon icon='mdi:poll' />
  },
  {
    color: 'info',
    stats: '2,450k',
    title: 'Transactions',
    icon: <Icon icon='mdi:trending-up' />
  }
]

const renderStats = () => {
  return salesData.map((sale, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' variant='rounded' color={sale.color} sx={{ mr: 4 }}>
          {sale.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {sale.stats}
          </Typography>
          <Typography variant='caption'>{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const EcommerceSalesOverview = ({user,suplier,product}) => {
  return (
    <Card>
      <CardHeader
        sx={{ pb: 3.25 }}
        title='Total Content'
        titleTypographyProps={{ variant: 'h6' }}

        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
            <Typography variant='caption' sx={{ mr: 1.5 }}>
              Total of all content in application
            </Typography>
            <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
              100%
            </Typography>
            <Icon icon='mdi:chevron-up' fontSize={20} />
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4} >
            <Box  sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' color={'primary'} sx={{ mr: 4 }}>
                <Icon icon='mdi:account-outline' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {user}
                </Typography>
                <Typography variant='caption'>Categorie</Typography>
              </Box>
            </Box>
          </Grid>
           <Grid item xs={12} sm={4} >
            <Box  sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' color={'warning'} sx={{ mr: 4 }}>
                <Icon icon='raphael:users' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {suplier}
                </Typography>
                <Typography variant='caption'>Orders</Typography>
              </Box>
            </Box>
          </Grid>
           <Grid item xs={12} sm={4} >
            <Box  sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' color={'info'} sx={{ mr: 4 }}>
                <Icon icon='fluent-mdl2:product-list' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  {product}
                </Typography>
                <Typography variant='caption'>products</Typography>
              </Box>
            </Box>
          </Grid>


        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceSalesOverview
