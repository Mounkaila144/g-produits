// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

const EcommerceMarketingSales = ({data}) => {
  // ** States
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // ** Hook
  const theme = useTheme()


  return (
    <Card>
      <CardHeader
        title='Products sell by dates'
        titleTypographyProps={{ variant: 'h6' }}
        sx={{ '& .swiper-dots': { mt: 0.75, mr: -1.75 } }}
      />
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Box component='img' src={'/images/cards/marketing-expense-logo.png'}  sx={{ mr: 5, width: 84, borderRadius: 1 }} />
          <Grid item xs={6} >
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ mb: 2.5, fontWeight: 600 }}>Today </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={6} >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='caption'>{data.productVendueJour}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ mb: 2.5, fontWeight: 600 }}>this Month </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={6} >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='caption'>{data.productVendueMoi}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Grid item xs={6} >
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ mb: 2.5, fontWeight: 600 }}>This Year </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={6} >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='caption'>{data.productVendueAnnee}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ mb: 2.5, fontWeight: 600 }}>For all time</Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={6} >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant='caption'>{data.productVendue}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default EcommerceMarketingSales
