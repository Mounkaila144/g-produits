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


import {red} from "@mui/material/colors";
import MyRequest from "../../../@core/components/request";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {useRouter} from "next/router";
import {t} from "i18next";
import Error500 from "../../500";
import Spinner from "../../../@core/components/spinner";
import Alert from "@mui/material/Alert";
import Add from "../../../components/product/add";
import EditModal from "../../../components/product/edit";
import ViewModal from "../../../components/product/view";
import Fab from "@mui/material/Fab";
import Image from "next/image";
import {useAuth} from "../../../hooks/useAuth";
import EditPicture from "../../../components/product/editPicture";



// ** renders client column

const UserList = () => {
  const router = useRouter();

  // ** State
  const [openadd, setOpenadd] = useState(false)
  const [openedit, setOpenedit] = useState(false)
  const [openeditPiture, setOpeneditPiture] = useState(false)
  const [openview, setOpenview] = useState(false)
  const [categorieFilter, setCategorieFilter] = useState('');
  const [suplierFilter, setSupplierFilter] = useState('');
  const [originalData, setOriginalData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [data, setData] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message
  const [selected, setSelected] = useState([]);
  const [dataCategorie, setDataCategorie] = useState([]);
  const [dataSuplier, setDataSuplier] = useState([]);
  const auth = useAuth()
  const refreshData = () => {
    router.push({pathname: router.pathname, query: {refresh: Date.now()}});
  }
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
console.log(dataUser)

  const SubmitremoveAll = () => {
    var data=Object.values(selected);

    setLoading(true)
    MyRequest('products/1', 'DELETE', {'data':data,'user':auth.user.id}, {'Content-Type': 'application/json'})
      .then(async (response) => {
        if (response.status === 200) {
          setSuccess(true)
          console.log('yesss')
          await refreshData()
          setError(false)
        } else {
          setError(true)
        }
      }).finally(() => setLoading(false))
      ;
  };

  //filtre
  const handleSearchChange = event => {
    const value = event.target.value;
    setSearchValue(value);
    const filteredData = filterData(originalData, value, categorieFilter, suplierFilter);
    setData(filteredData);
  };


  const filterData = (data, searchVal, roleVal, suplierVal) => {
    return data.filter(product =>
      product.name.toLowerCase().includes(searchVal.toLowerCase()) &&
      (roleVal === '' || product.categorie.id === roleVal) &&
      (suplierVal === '' || product.suplier.id === suplierVal)
    );
  };



  const handleCategorieFilterChange = event => {
    const value = event.target.value;
    setCategorieFilter(value);
  };
  const handleSupplierFilterChange = event => {
    const value = event.target.value;
    setSupplierFilter(value);
  };

  useEffect(() => {
    const filteredData = filterData(originalData, searchValue, categorieFilter, suplierFilter);
    setData(filteredData);
  }, [searchValue, categorieFilter, suplierFilter, originalData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await MyRequest('products', 'GET', {}, { 'Content-Type': 'application/json' });
        setData(response.data);
        setLoading(false);
        setData(response.data)

      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, [router.query]);


  const columns = [

    {
      flex: 0.2,
      maxWidth: 50,
      field: 'id',
      headerName: t('id'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.id}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      maxWidth: 250,
      field: 'picture',
      headerName: t('picture'),
      renderCell: ({ row }) => {
        const handleView = (user) => {
          // Set the user data to be edited
          setDataUser(user);
          setOpenview(true);
        };
        return (
          <div
            style={{ cursor: 'pointer' }}
          >
            <Image
              src={'http://127.0.0.1:8000/storage/product/' + row.picture}
              width={100}
              height={100}
              alt="image"
              onDoubleClick={() => handleView(row)}
            />
          </div>
        );
      },
    },
    {
      flex: 0.2,
      maxWidth: 250,
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
      minWidth: 150,
      field: 'quantity sell',
      headerName: t('quantity sell'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.vendue}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      field: 'quantity',
      minWidth: 100,
      headerName: t('quantity'),
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: red[500] } }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {t(row.stock)}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.15,
      field: 'alert',
      minWidth: 100,
      headerName: t('alert'),
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: red[500] } }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {t(row.stock)}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: t('action'),
      renderCell: ({ row }) => {
        const [anchorEl, setAnchorEl] = useState(false);

        const rowOptionsOpen = Boolean(anchorEl);
        const handleEditPicture= (user) => {
          // Set the user data to be edited
          setDataUser(user);
          setOpeneditPiture(true);
          handleRowOptionsClose();
        };

        const handleRowOptionsClick = (event) => {
          setAnchorEl(event.currentTarget);
        };

        const handleRowOptionsClose = () => {
          setAnchorEl(null);
        };

        const handleEdit = (user) => {
          // Set the user data to be edited
          setDataUser(user);
          setOpenedit(true);
          handleRowOptionsClose();
        };

        const handleView = (user) => {
          // Set the user data to be edited
          setDataUser(user);
          setOpenview(true);
        };

        const Submitremove = () => {
          var data=Object.values([row.id]);

          setLoading(true)
          MyRequest('products/'+row.id, 'DELETE', {'data':data,'user':auth.user.id}, {'Content-Type': 'application/json'})
            .then(async (response) => {
              if (response.status === 200) {
                await refreshData()
                setSuccess(true)

              } else {
                setError(true)
              }
            }).finally(() =>{
            setLoading(false)

          })
            .catch(error => {
              setError(true)
            });
          handleRowOptionsClose();
        };


        return (
          <>
            <IconButton size='small' onClick={handleRowOptionsClick}>
              <Icon icon='mdi:dots-vertical' />
            </IconButton>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              open={rowOptionsOpen}
              onClose={handleRowOptionsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{ style: { minWidth: '8rem' } }}
            >
              <MenuItem
                sx={{ '& svg': { mr: 2 } }}
                onClick={() => handleView(row)}
              >
                <Icon icon='mdi:eye-outline' fontSize={20} />
                View
              </MenuItem>
              <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit(row)}>
                <Icon icon='mdi:pencil-outline' fontSize={20} />
                Edit
              </MenuItem>
              <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEditPicture(row)}>
                <Icon icon='mdi:pencil-outline' fontSize={20} />
                Edit picture
              </MenuItem>

              <MenuItem onClick={()=>Submitremove()} sx={{ '& svg': { mr: 2 } }}>
                <Icon icon='mdi:delete-outline' fontSize={20} />
                Delete
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  return (
    loading ? (
        <Spinner sx={{ height: '100%' }} />
      ) : error ? (
        <Error500 />
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
                  {t('delete successful')}
                </Alert>
              )}
              {selected.length > 0 && <Fab  aria-label='delect selelcted' color='error' size='medium'
                                                  onClick={SubmitremoveAll}
              >
                <Icon icon='ic:baseline-delete' fontSize={30} />
              </Fab>}
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
                  value={suplierFilter}
                  onChange={handleSupplierFilterChange}
                  label={t("suplier")}
                  sx={{minWidth: 150, marginRight: 3}}
                >
                  <MenuItem value=''>{t("all")}</MenuItem>
                  {/* Remplacez `dataSuppliers` par votre liste de fournisseurs */}
                  {dataSuplier.map((suplier) => (
                    <MenuItem key={suplier.id} value={suplier.id}>
                      {suplier.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size='small'
                  value={categorieFilter}
                  onChange={handleCategorieFilterChange}
                  label={t("categorie")}
                  sx={{minWidth: 150,marginRight:3}}
                >
                  <MenuItem value=''>{t("all")}</MenuItem>
                  {dataCategorie.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Button variant='contained' onClick={() => setOpenadd(true)}>
                  {t('to add')}
                </Button>





              </Box>
            </Box>
            {/*liste*/}
            <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rowHeight={100}
              rows={data}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5,10, 25, 50]}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => {
                setSelected(ids);
              }}
              selectionModel={selected}
              sx={{'& .MuiDataGrid-columnHeaders': {borderRadius: 1}}}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
            </div>

          </Card>
        </Grid>
        {/*add new*/}
        <Add open={openadd} setOpen={setOpenadd}/>
        {/* Edit user modal */}
        <EditModal open={openedit} setOpen={setOpenedit} data={dataUser} />
        <EditPicture open={openeditPiture} setOpen={setOpeneditPiture} data={dataUser} />
         {/* View user modal */}
        <ViewModal open={openview} setOpen={setOpenview} data={dataUser} />

      </Grid>)
    )
}

export default UserList
