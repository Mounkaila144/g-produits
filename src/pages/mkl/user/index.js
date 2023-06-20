// ** React Imports
import {useState, useEffect, useCallback} from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import {DataGrid} from '@mui/x-data-grid'
import {styled} from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import {getInitials} from 'src/@core/utils/get-initials'

// ** Actions Imports

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import themeConfig from "../../../configs/themeConfig";
import {red} from "@mui/material/colors";
import MyRequest from "../../../@core/components/request";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {useRouter} from "next/router";
import {t} from "i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Error500 from "../../500";
import Spinner from "../../../@core/components/spinner";
import Alert from "@mui/material/Alert";


const StyledLink = styled(Link)(({theme}) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column
const renderClient = row => {
  if (row.role === "admin") {
    return <CustomAvatar src={"/images/avatars/3.png"} sx={{mr: 3, width: 34, height: 34}}/>
  } else {
    return <CustomAvatar src={"/images/avatars/1.png"} sx={{mr: 3, width: 34, height: 34}}/>
  }
}

const RowOptions = ({id}) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical'/>
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{style: {minWidth: '8rem'}}}
      >
        <MenuItem
          component={Link}
          sx={{'& svg': {mr: 2}}}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20}/>
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{'& svg': {mr: 2}}}>
          <Icon icon='mdi:pencil-outline' fontSize={20}/>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{'& svg': {mr: 2}}}>
          <Icon icon='mdi:delete-outline' fontSize={20}/>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'name',
    headerName: t('User'),
    renderCell: ({row}) => {
      const {name, email} = row

      return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {renderClient(row)}
          <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
            <StyledLink href='/apps/user/view/overview/'>{name}</StyledLink>
            <Typography noWrap variant='caption'>
              {`${email}`}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'email',
    headerName: t('email'),
    renderCell: ({row}) => {
      return (
        <Typography noWrap variant='body2'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'role',
    minWidth: 150,
    headerName: t('role'),
    renderCell: ({row}) => {
      return (
        <Box sx={{display: 'flex', alignItems: 'center', '& svg': {mr: 3, color: red[500]}}}>
          <Typography noWrap sx={{color: 'text.secondary', textTransform: 'capitalize'}}>
            {t(row.role)}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: t('action'),
    renderCell: ({row}) => <RowOptions id={row.id}/>
  }
]

const UserList = () => {
  // ** State
  const [roleFilter, setRoleFilter] = useState('');
  const [originalData, setOriginalData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false)


  const handleSearchChange = event => {
    const value = event.target.value;
    setSearchValue(value);
    const filteredData = filterData(originalData, value, roleFilter);
    setData(filteredData);
  };

  const filterData = (data, searchVal, roleVal) => {
    return data.filter(user =>
      user.name.toLowerCase().includes(searchVal.toLowerCase()) &&
      (roleVal === '' || user.role.toLowerCase() === roleVal.toLowerCase())
    );
  };


  const handleRoleFilterChange = event => {
    const value = event.target.value;
    setRoleFilter(value);
  };


  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      await MyRequest('users', 'GET', {}, {'Content-Type': 'application/json'})
        .then((response) => {
          setOriginalData(response.data);
          setData(response.data)
        });
    };
    fetchData();
  }, [router.query]);

  useEffect(() => {
    const filteredData = filterData(originalData, searchValue, roleFilter);
    setData(filteredData);
  }, [searchValue, roleFilter, originalData]);


  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const {t, i18n} = useTranslation()


  const [name, createName] = useState('')
  const [password, createPassword] = useState('')
  const [email, createEmail] = useState('')
  const [role, createRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorForm, setErrorForm] = useState(false)
  const [errorText, setErrorText] = useState("une eureur c'est produits ")
  const [success, setSuccess] = useState(false); // New state variable for success message


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
    if (name.trim() === '' || role === '' || email.trim() === '' || password.trim() === '') {
      setErrorForm(true);

      return;
    }

    const formData = {
      "name": name,
      "password": password,
      "role": role,
      "email": email
    }
    try {
      setLoading(true)
      MyRequest('register', 'POST', formData, {'Content-Type': 'application/json'})
        .then(async (response) => {
          if (response.status === 200) {
            await refreshData()
            {
              success &&
              createEmail('')
              createName('')
              createRole('')
              createPassword('')
            }
            await refreshData()

            setSuccess(true)
            setErrorForm(false)

          } else {
            setError(true)
          }
        }).finally(() => setLoading(false))
        .catch(error => {
          setErrorText("une eureur c'est produits ");
        });

    } catch (e) {
      setError(true)
    }

  }
  if (loading) {
    return (
      <Spinner sx={{height: '100%'}}/>
    )
  } else if (error) {
    return (<Error500/>)
  } else {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>

            <Box sx={{
              p: 5,
              pb: 3,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{display: 'flex', alignItems: 'center', marginRight: 6, marginBottom: 2}}>
                <TextField
                  size='small'
                  value={searchValue}
                  placeholder={t('search')}
                  onChange={handleSearchChange}
                  sx={{flex: 1}}
                />
              </Box>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <TextField
                  select
                  size='small'
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  label={t("role")}
                  sx={{minWidth: 150}}
                >
                  <MenuItem value=''>{t("all")}</MenuItem>
                  <MenuItem value={t('admin')}>{t('admins')}</MenuItem>
                  <MenuItem value={t('client')}>{t('clients')}</MenuItem>
                </TextField>
                <Button variant='outlined' onClick={() => setOpen(true)}>
                  {t('to add')}
                </Button>
                <Dialog maxWidth={'sm'} open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
                  <DialogTitle id='form-dialog-title' sx={{textAlign: 'center'}}>Add user</DialogTitle>
                  {success && (
                    <Alert variant='filled' severity='success'>
                      l'utilisateur a bien ete cree
                    </Alert>
                  )}
                  {errorForm && (
                    <Alert variant='filled' severity='error'>
                      {errorText}
                    </Alert>
                  )

                  }
                  <DialogContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          label="Name"
                          variant="outlined"
                          fullWidth
                          value={name}
                          onChange={(e) => createName(e.target.value)}
                          error={errorForm && name.trim() === ''}
                          helperText={errorForm && name.trim() === '' ? 'Name is required' : ''}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          select
                          label="Role"
                          variant="outlined"
                          fullWidth
                          value={role}
                          onChange={(e) => createRole(e.target.value)}
                          error={errorForm && role === ''}
                          helperText={errorForm && role === '' ? 'Role is required' : ''}
                        >
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="client">Client</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          label="Email"
                          variant="outlined"
                          fullWidth
                          value={email}
                          onChange={(e) => createEmail(e.target.value)}
                          error={errorForm && email.trim() === ''}
                          helperText={errorForm && email.trim() === '' ? 'Email is required' : ''}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          label="Password"
                          variant="outlined"
                          type="password"
                          fullWidth
                          value={password}
                          onChange={(e) => createPassword(e.target.value)}
                          error={errorForm && password.trim() === ''}
                          helperText={errorForm && password.trim() === '' ? 'Password is required' : ''}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <DialogActions className='dialog-actions-dense'>
                          <Button onClick={onSubmit}>Envoyer</Button>
                        </DialogActions>
                      </Grid>
                    </Grid>
                  </DialogContent>

                </Dialog>
              </Box>
            </Box>

            <DataGrid
              autoHeight
              rows={data}
              columns={columns}
              checkboxSelection
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{'& .MuiDataGrid-columnHeaders': {borderRadius: 0}}}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />

          </Card>
        </Grid>

        <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer}/>
      </Grid>
    )
  }
}

export default UserList
