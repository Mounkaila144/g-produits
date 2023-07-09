// ** React Imports
import React, {useState, useEffect, useCallback} from 'react'

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

// ** Custom Table Components Imports

import themeConfig from "../../../configs/themeConfig";
import {blue, red, yellow} from "@mui/material/colors";
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

import Fab from "@mui/material/Fab";
import Add from "../../../components/order/add";
import EditModal from "../../../components/categorie/edit";
import {useAuth} from "../../../hooks/useAuth";
import {useCart} from "react-use-cart";
import Image from "next/image";


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


    return <CustomAvatar src={"/images/logos/asana.png"} sx={{mr: 3, width: 34, height: 34}}/>
}

const Categorie = () => {
  // ** State
  const [name, createName] = useState('')
  const [lastname, createLastame] = useState('')
  const [phone, createPhone] = useState('')
  const [adresse, createAdresse] = useState('')
  const [state, createState] = useState(false)

  const [openadd, setOpenadd] = useState(false)
  const [openedit, setOpenedit] = useState(false)
  const [openview, setOpenview] = useState(false)
  const [originalData, setOriginalData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [addCategorieOpen, setAddCategorieOpen] = useState(false)
  const [data, setData] = useState([]);
  const [dataCategorie, setDataCategorie] = useState([]);
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message
  const [errorForm, setErrorForm] = useState(false)

  const [selected, setSelected] = useState([]);
  const [quantity, setQuantity ]= useState();

    const auth = useAuth()
  const {emptyCart, isEmpty, items, inCart, addItem, updateItemQuantity, removeItem, cartTotal} = useCart();
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  const onSubmit = async (e) => {
    e.preventDefault()
    if (name.trim() === '',phone.trim() === '',adresse.trim() === '',lastname.trim() === '') {
      setErrorForm(true);

      return;
    }else{
      setErrorForm(false);

      const formData = {
        "name": name,
        "phone": phone,
        "adresse": adresse,
        "state": state,
        "lastname": lastname,
        "data": items,
        "user": auth.user.id
      }
      try {
        setLoading(true)
        MyRequest('orders', 'POST', formData, {'Content-Type': 'application/json'})
          .then(async (response) => {
            if (response.status === 200) {
              setSuccess(true)
              {
                success &&
                createPhone('')
                createName('')
                createAdresse('')
                createState('')
                createLastame('')
                emptyCart()

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


  //DETED
  const refreshData = () => {
    router.push({pathname: router.pathname, query: {refresh: Date.now()}});
  }
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  //filtre
  const handleSearchChange = event => {
    const value = event.target.value;
    setSearchValue(value);
    const filteredData = filterData(originalData, value);
    setData(filteredData);
  };





  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      await MyRequest('orders', 'GET', {}, {'Content-Type': 'application/json'})
        .then((response) => {
          setOriginalData(response.data);
          setData(response.data)
        });
    };
    fetchData();
  }, [router.query]);

  //fin

  //traduction
  const {t, i18n} = useTranslation()

  //fin
//removeone



  const columns = [
    {
      flex: 0.2,
      minWidth: 100,
      field: 'picture',
      headerName: t('picture'),
      renderCell: ({ row }) => {
        return (
          <Image
            src={'http://127.0.0.1:8000' + "/storage/product/" + row.picture}
            width={70} height={70}
            alt={"image"}/>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'name',
      headerName: t('name'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.name}
          </Typography>
        );
      },
    },

    {
      flex: 0.2,
      minWidth: 200,
      field: 'categorie',
      headerName: t('categorie'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.categorie.name}
          </Typography>
        );
      },
    },


    {
      flex: 0.2,
      minWidth: 100,
      field: 'price',
      headerName: t('price'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.price}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'Supplier',
      headerName: t('suplier'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.suplier.name}
          </Typography>
        );
      },
    },
{
      flex: 0.2,
      minWidth: 100,
      field: 'Quantity',
      headerName: t('quantity'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.quantity}
          </Typography>
        );
      },
    },

{
      flex: 0.2,
      minWidth: 100,
      field: 'total',
      headerName: t('total prix'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.itemTotal}
          </Typography>
        );
      },
    },

    {
      flex: 0.1,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: t('action'),
      renderCell: ({ row }) => {

        return (
          <>
            <IconButton
              size='small'
              sx={{ backgroundColor: yellow[900], borderRadius: 1 }}
              onClick={() => updateItemQuantity(row.id, row.quantity - 1)}
            >
              <Icon icon='ep:remove-filled' fontSize='inherit' />
            </IconButton>

            {row.stock > row.quantity ? (
              <IconButton
                size='small'
                sx={{ backgroundColor: blue[800], borderRadius: 1 }}

                onClick={() => updateItemQuantity(row.id, row.quantity + 1)}
              >
                <Icon icon='zondicons:add-solid' fontSize='inherit' />
              </IconButton>
            ) : (
              <Button variant='outlined' >add</Button>
            )}

            <IconButton
              size='small'
              sx={{ backgroundColor: red[800], borderRadius: 1 }}
              onClick={() => removeItem(row.id)}
            >
              <Icon icon='ic:round-delete' fontSize='inherit' />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    loading ? (
        <Spinner sx={{ height: '100%' }} />
      ) : (
      <Grid container spacing={6}>

        <Grid item xs={12}>
          <Card>
            {/*filtre et post*/}
            <Box sx={{
              p: 5,
              pb: 3,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
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
                <Button variant='outlined' onClick={() => setOpenadd(true)}>
                  {t('to add')}
                </Button>

              </Box>
            </Box>
            {/*liste*/}
            <DataGrid
              autoHeight
              rows={items}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5,10, 25, 50]}
              disableSelectionOnClick
              sx={{'& .MuiDataGrid-columnHeaders': {borderRadius: 1}}}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
            {!isEmpty &&
            <Grid container spacing={2}>

              <Grid item xs={12} lg={4}>
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
              <Grid item xs={12} lg={4}>
                <TextField
                  label={t("lastname")}
                  variant="outlined"
                  fullWidth
                  value={lastname}
                  onChange={(e) => createLastame(e.target.value)}
                  error={errorForm && lastname.trim() === ''}
                  helperText={errorForm && lastname.trim() === '' ? t('is required') : ''}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <TextField
                  label={t("phone")}
                  variant="outlined"
                  fullWidth
                  value={phone}
                  onChange={(e) => createPhone(e.target.value)}
                  error={errorForm && phone.trim() === ''}
                  helperText={errorForm && phone.trim() === '' ? t('is required') : ''}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <TextField
                  label={t("adresse")}
                  variant="outlined"
                  fullWidth
                  value={adresse}
                  onChange={(e) => createAdresse(e.target.value)}
                  error={errorForm && adresse.trim() === ''}
                  helperText={errorForm && adresse.trim() === '' ? t('is required') : ''}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <TextField
                  select
                  label={t("state")}
                  variant="outlined"
                  fullWidth
                  value={state}
                  onChange={(e) => createState(e.target.value)}
                  error={errorForm && state === ''}
                  helperText={errorForm && state === '' ? t('is required') : ''}
                >
                  <MenuItem value={true}>{t("true")}</MenuItem>
                  <MenuItem value={false}>{t("false")}</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <DialogActions className='dialog-actions-dense'>
                  <Button onClick={onSubmit}>{t('ok')}</Button>
                </DialogActions>
              </Grid>
            </Grid>
            }
          </Card>
        </Grid>

        {/*add new*/}
        <Add open={openadd} setOpen={setOpenadd}/>
        {/* Edit categorie modal */}
        <EditModal open={openedit} setOpen={setOpenedit} data={dataCategorie} />


      </Grid>)
    )
}

export default Categorie
