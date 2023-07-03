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

// ** Custom Table Components Imports

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

import Fab from "@mui/material/Fab";
import Add from "../../../components/suplier/add";
import EditModal from "../../../components/suplier/edit";
import ViewModal from "../../../components/suplier/view";


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


    return <CustomAvatar src={"/images/avatars/7.png"} sx={{mr: 3, width: 34, height: 34}}/>
}

const SuplierList = () => {
  // ** State
  const [openadd, setOpenadd] = useState(false)
  const [openedit, setOpenedit] = useState(false)
  const [openview, setOpenview] = useState(false)
  const [originalData, setOriginalData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [addSuplierOpen, setAddSuplierOpen] = useState(false)
  const [data, setData] = useState([]);
  const [dataSuplier, setDataSuplier] = useState([]);
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message
  const [selected, setSelected] = useState([]);


  //DETED
  const SubmitremoveAll = () => {
    var data=Object.values(selected);

    setLoading(true)
    MyRequest('supliers/1', 'DELETE', {'data':data}, {'Content-Type': 'application/json'})
      .then(async (response) => {
        if (response.status === 200) {
          setSuccess(true)
          await refreshData()
        } else {
          setError(true)
        }
      }).finally(() => setLoading(false))
      .catch(error => {
        setError(true)
      });
  };

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
      await MyRequest('supliers', 'GET', {}, {'Content-Type': 'application/json'})
        .then((response) => {
          setOriginalData(response.data);
          setData(response.data)
        });
    };
    fetchData();
  }, [router.query]);

  //fin

  //traduction
  const toggleAddSuplierDrawer = () => setAddSuplierOpen(!addSuplierOpen)
  const {t, i18n} = useTranslation()

  //fin
//removeone

  useEffect(() => {
    console.log(selected);
  }, [selected]);



  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'name',
      headerName: t('Suplier'),
      renderCell: ({ row }) => {
        const { name, phone } = row;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
             label="iOS Style"
   {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href='/apps/suplier/view/overview/'>{name}</StyledLink>
              <Typography noWrap variant='caption'>
                {`${phone}`}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: t('phone'),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.phone}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      field: 'adresse',
      minWidth: 150,
      headerName: t('adresse'),
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: red[500] } }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {t(row.adresse)}
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
        const [anchorEl, setAnchorEl] = useState(null);

        const rowOptionsOpen = Boolean(anchorEl);

        const handleRowOptionsClick = (event) => {
          setAnchorEl(event.currentTarget);
        };

        const handleRowOptionsClose = () => {
          setAnchorEl(null);
        };

        const handleEdit = (suplier) => {
          // Set the suplier data to be edited
          setDataSuplier(suplier);
          setOpenedit(true);
          handleRowOptionsClose();
        };

const handleView = (suplier) => {
          // Set the suplier data to be edited
          setDataSuplier(suplier);
          setOpenview(true);
        };

        const Submitremove = () => {
          var data=Object.values([row.id]);

          setLoading(true)
          MyRequest('supliers/'+row.id, 'DELETE', {'data':data}, {'Content-Type': 'application/json'})
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
                {t('view')}
              </MenuItem>
              <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit(row)}>
                <Icon icon='mdi:pencil-outline' fontSize={20} />
                {t('edit')}
              </MenuItem>
              <MenuItem onClick={()=>Submitremove()} sx={{ '& svg': { mr: 2 } }}>
                <Icon icon='mdi:delete-outline' fontSize={20} />
                {t('delete')}
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
                <Button variant='outlined' onClick={() => setOpenadd(true)}>
                  {t('to add')}
                </Button>

              </Box>
            </Box>
            {/*liste*/}
            <DataGrid
              autoHeight
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

          </Card>
        </Grid>
        {/*add new*/}
        <Add open={openadd} setOpen={setOpenadd}/>
        {/* Edit suplier modal */}
        <EditModal open={openedit} setOpen={setOpenedit} data={dataSuplier} />
         {/* View suplier modal */}
        <ViewModal open={openview} setOpen={setOpenview} data={dataSuplier} />

      </Grid>)
    )
}

export default SuplierList
