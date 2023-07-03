import ApexChartWrapper from "../../@core/styles/libs/react-apexcharts";
import KeenSliderWrapper from "../../@core/styles/libs/keen-slider";
import Grid from "@mui/material/Grid";
import EcommerceSalesOverview from "../../views/dashboards/ecommerce/EcommerceSalesOverview";
import CardStatisticsCharacter from "../../@core/components/card-statistics/card-stats-with-image";
import EcommerceWeeklySalesBg from "../../views/dashboards/ecommerce/EcommerceWeeklySalesBg";
import EcommerceTotalVisits from "../../views/dashboards/ecommerce/EcommerceTotalVisits";
import EcommerceSalesThisMonth from "../../views/dashboards/ecommerce/EcommerceSalesThisMonth";
import EcommerceActivityTimeline from "../../views/dashboards/ecommerce/EcommerceActivityTimeline";
import EcommerceSalesOverviewWithTabs from "../../views/dashboards/ecommerce/EcommerceSalesOverviewWithTabs";
import EcommerceImpressionsOrders from "../../views/dashboards/ecommerce/EcommerceImpressionsOrders";
import EcommerceMarketingSales from "../../views/dashboards/ecommerce/EcommerceMarketingSales";
import EcommerceLiveVisitors from "../../views/dashboards/ecommerce/EcommerceLiveVisitors";
import EcommerceTable from "../../views/dashboards/ecommerce/EcommerceTable";
import EcommerceVisitsByDay from "../../views/dashboards/ecommerce/EcommerceVisitsByDay";
import {useAuth} from "../../hooks/useAuth";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import MyRequest from "../../@core/components/request";
import {useTranslation} from "react-i18next";
import Spinner from "../../@core/components/spinner";


const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false); // New state variable for success message

  useEffect(() => {
    const fetchData = async () => {
      await MyRequest('dashboard', 'GET', {}, {'Content-Type': 'application/json'})
        .then((response) => {
          setData(response.data)
        });
    };

    // Fetch data every 5 seconds
    fetchData()
    const interval = setInterval(() => {fetchData()}, 5000);

    return () => clearInterval(interval);
  }, []);

  //traduction
  const {t, i18n} = useTranslation()

  return (
    data?
      <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12} md={6}>
            <EcommerceSalesOverview user={data.TotalCategorie} product={data.TotalProduct} suplier={data.TotalOrder}/>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: data.TotalUser,
                title: 'All Users',
                chipColor: 'primary',
                chipText: 'of the app',
                src: '/images/cards/card-stats-img-1.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: data.TotalSuplier,
                trend: 'negative',
                title: 'All Suppliers',
                chipColor: 'success',
                chipText: 'of the app',
                src: '/images/cards/card-stats-img-2.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <EcommerceImpressionsOrders alert={data.TotalProductAlert} noAlert={data.TotalProduct-data.TotalProductAlert}/>
          </Grid>
          <Grid item xs={12} md={5} sx={{ order: [2, 2, 1] }}>
            <EcommerceMarketingSales data={data} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ order: [1, 1, 2] }}>
            <EcommerceLiveVisitors data={data} />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>:
      <Spinner sx={{ height: '100%' }} />


  )
}

export default Home
