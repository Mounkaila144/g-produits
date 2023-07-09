const navigation = () => {
  return [
    {
      sectionTitle: ''
    },
    {
      sectionTitle: ''
    },

    {
      title: 'Dashboard',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:home-outline',
      badgeColor: 'error',
      path: '/mkl'
    },
    {
      title: 'Users',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:account-outline',
      path: '/mkl/user'
    },
     {
      title: 'categorie-product',
      action: 'read',
      subject: 'acl-page',
      icon: 'carbon:categories',
      path: '/mkl/categorie'
    },
    {
      title: 'Products',
      action: 'read',
      subject: 'acl-page',
      icon: 'fluent-mdl2:product-list',
      path: '/mkl/product'
    },
     {
      title: 'Supplier',
      action: 'read',
      subject: 'acl-page',
      icon: 'raphael:users',
      path: '/mkl/suplier'
    },
     {
      title: 'Orders',
      action: 'read',
      subject: 'acl-page',
      icon: 'fa:first-order',
      path: '/mkl/order'
    },
     {
      title: 'Orders List',
      action: 'read',
      subject: 'acl-page',
      icon: 'fa:first-order',
      path: '/mkl/order/list'
    },
    {
      title: 'Services',
      icon: 'mdi:chart-donut',
      children: [
        {
          title: 'Listes des services',
          path: '/charts/apex-charts'
        },
        {
          title: 'Commandes Services ',
          path: '/charts/recharts'
        },
        {
          title: 'Statistique Services',
          path: '/charts/chartjs'
        }
      ]
    },
  ]
}

export default navigation
