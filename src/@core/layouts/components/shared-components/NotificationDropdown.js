// ** React Imports
import React, {useState, Fragment, useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { getInitials } from 'src/@core/utils/get-initials'
import MyRequest from "../../../components/request";
import Spinner from "../../../components/spinner";
import Error500 from "../../../../pages/500";
import {useRouter} from "next/router";
import Image from "next/image";

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 344
})

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = props => {
  // ** Props
  const { settings, notifications } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hook
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const RenderAvatar = ({ notification }) => {
    const { avatarAlt, avatarImg, avatarIcon, avatarText, avatarColor } = notification
    if (avatarImg) {
      return <Avatar alt={avatarAlt} src={avatarImg} />
    } else if (avatarIcon) {
      return (
        <Avatar skin='light' color={avatarColor}>
          {avatarIcon}
        </Avatar>
      )
    } else {
      return (
        <Avatar skin='light' color={avatarColor}>
          {getInitials(avatarText)}
        </Avatar>
      )
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await MyRequest('products', 'GET', {}, { 'Content-Type': 'application/json' });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, [router.query]);
  return (
    loading ? (
      <Spinner sx={{ height: '20%' }} />
    ) : error ? (
      <Error500 />
    ) : (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          color='error'
          variant='dot'
          invisible={!notifications.length}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        > <Typography variant="caption" color={"red"}>{data.length}</Typography>
          <Icon icon='mdi:bell-outline' />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin='light'
              size='small'
              color='error'
              label={`${data.length} alert`}
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {data.map((notification, index) => (
            <MenuItem key={index} onClick={handleDropdownClose}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Image
                  src={'http://127.0.0.1:8000/storage/product/' + notification.picture}
                  width={40}
                  height={40}
                  alt="image"
                />
                <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>N°</MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>{notification.id}</MenuItemSubtitle>
                </Box>
                 <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>Name</MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>{notification.name}</MenuItemSubtitle>
                </Box>
                 <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>Quantity</MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>{notification.stock}</MenuItemSubtitle>
                </Box>

              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>

      </Menu>
    </Fragment>
  )
  )
}

export default NotificationDropdown
