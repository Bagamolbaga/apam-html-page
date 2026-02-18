const { useState, useMemo, useEffect } = React;

const CLOUDINARY_CLOUD_NAME = 'dobdjgonp';

// Countries data - updated with pensionsPdf as public_id from Cloudinary
const countries = [
  {
    name: 'Algeria',
    countryCode: 'DZ',
    assetManagementPdf: 'DZA_Algeria_Asset_Management_V2_i7yopz',
    pensionsPdf: 'DZA_Algeria_Pensions_pvnwju',
  },
  {
    name: 'Angola',
    countryCode: 'AO',
    assetManagementPdf: 'AGO_Angola_Asset_Management_ta1fvd',
    pensionsPdf: 'AGO_Angola_Pensions_suwmzr',
  },
  {
    name: 'Benin',
    countryCode: 'BJ',
    assetManagementPdf: null,
    pensionsPdf: 'BEN_Benin_Pensions_jl6ie1',
  },
  {
    name: 'Botswana',
    countryCode: 'BW',
    assetManagementPdf: 'BWA_Botswana_Asset_Management_gd9tuz',
    pensionsPdf: 'BWA_Botswana_Pensions_bluiby',
  },
  {
    name: 'Burkina Faso',
    countryCode: 'BF',
    assetManagementPdf: null,
    pensionsPdf: 'BFA_Burkina_Faso_Pensions_dk5zkx',
  },
  {
    name: 'Burundi',
    countryCode: 'BI',
    assetManagementPdf: 'BDI_Burundi_Asset_Management_q33h5f',
    pensionsPdf: 'BDI_Burundi_Pensions_xgpimt',
  },
  {
    name: 'Cameroon',
    countryCode: 'CM',
    assetManagementPdf: null,
    pensionsPdf: 'CMR_Cameroon_Pensions_fslyia',
  },
  {
    name: 'Cabo Verde',
    countryCode: 'CV',
    assetManagementPdf: 'CPV_Cabo_Verde_Asset_Management_zjmo7g',
    pensionsPdf: 'CPV_Cabo_Verde_Pensions_lzfkg4',
  },
  {
    name: 'Central African Republic',
    countryCode: 'CF',
    assetManagementPdf: null,
    pensionsPdf: 'CAF_Central_African_Republic_Pensions_opb8ss',
  },
  {
    name: 'Chad',
    countryCode: 'TD',
    assetManagementPdf: null,
    pensionsPdf: 'TCD_Chad_Pensions_to5gme',
  },
  {
    name: 'Comoros',
    countryCode: 'KM',
    assetManagementPdf: null,
    pensionsPdf: 'COM_Comoros_Pensions_wg5w07',
  },
  {
    name: 'Republic of the Congo',
    countryCode: 'CG',
    assetManagementPdf: null,
    pensionsPdf: 'COG_Congo-Brazaville_Pensions_my2nfy',
  },
  {
    name: "Côte d'Ivoire",
    countryCode: 'CI',
    assetManagementPdf: null,
    pensionsPdf: 'CIV_Côte_d_Ivoire_Pensions_ge3fxv',
  },
  {
    name: 'Djibouti',
    countryCode: 'DJ',
    assetManagementPdf: null,
    pensionsPdf: 'DJI_Djibouti_Pensions_msdttj',
  },
  {
    name: 'Democratic Republic of the Congo',
    countryCode: 'CD',
    assetManagementPdf: null,
    pensionsPdf: 'COD_DRC_Pensions_jvsl57',
  },
  {
    name: 'Egypt',
    countryCode: 'EG',
    assetManagementPdf: 'EGY_Egypt_Asset_Management_xpvywv',
    pensionsPdf: 'EGY_Egypt_Pensions_f8yxao',
  },
  {
    name: 'Equatorial Guinea',
    countryCode: 'GQ',
    assetManagementPdf: null,
    pensionsPdf: 'GNQ_Equatorial_Guinea_Pensions_wznk3f',
  },
  {
    name: 'Eritrea',
    countryCode: 'ER',
    assetManagementPdf: null,
    pensionsPdf: 'ERI_Eritrea_Pensions_kzylkd',
  },
  {
    name: 'Eswatini',
    countryCode: 'SZ',
    assetManagementPdf: 'SWZ_Eswatini_Asset_Management_ggkgem',
    pensionsPdf: 'SWZ_Eswatini_Pensions_nwref3',
  },
  {
    name: 'Ethiopia',
    countryCode: 'ET',
    assetManagementPdf: 'ETH_Ethiopia_Asset_Management_dsxsya',
    pensionsPdf: 'ETH_Ethiopia_Pensions_d7iyh6',
  },
  {
    name: 'Gabon',
    countryCode: 'GA',
    assetManagementPdf: null,
    pensionsPdf: 'GAB_Gabon_Pensions_b7jlhw',
  },
  {
    name: 'The Gambia',
    countryCode: 'GM',
    assetManagementPdf: 'GMB_Gambia_Asset_Management_ayyqcy',
    pensionsPdf: 'GMB_Gambia_Pensions_cotfeh',
  },
  {
    name: 'Ghana',
    countryCode: 'GH',
    assetManagementPdf: 'GHA_Ghana_Asset_Management_h4y2xl',
    pensionsPdf: 'GHA_Ghana_Pensions_suxgjr',
  },
  {
    name: 'Guinea',
    countryCode: 'GN',
    assetManagementPdf: null,
    pensionsPdf: 'GIN_Guinea_Pensions_oxhpmr',
  },
  {
    name: 'Guinea-Bissau',
    countryCode: 'GW',
    assetManagementPdf: null,
    pensionsPdf: 'GNB_Guinea_Bissau_Pensions_d9zztc',
  },
  {
    name: 'Kenya',
    countryCode: 'KE',
    assetManagementPdf: 'KEN_Kenya_Asset_Management_v4_ihcuz7',
    pensionsPdf: 'KEN_Kenya_Pensions_kfehxz',
  },
  {
    name: 'Lesotho',
    countryCode: 'LS',
    assetManagementPdf: 'LSO_Lesotho_Asset_Management_dfdwhi',
    pensionsPdf: 'LSO_Lesotho_Pensions_tfq3hh',
  },
  {
    name: 'Liberia',
    countryCode: 'LR',
    assetManagementPdf: null,
    pensionsPdf: 'LBR_Liberia_Pensions_hdmrxi',
  },
  {
    name: 'Libya',
    countryCode: 'LY',
    assetManagementPdf: 'LBY_Libya_Asset_Management_junnaw',
    pensionsPdf: 'LBY_Libya_Pensions_bofmyf',
  },
  {
    name: 'Madagascar',
    countryCode: 'MG',
    assetManagementPdf: null,
    pensionsPdf: 'MDG_Madagascar_Pensions_pb4q5o',
  },
  {
    name: 'Malawi',
    countryCode: 'MW',
    assetManagementPdf: 'MWI_Malawi_Asset_Management_s4foot',
    pensionsPdf: 'MWI_Malawi_Pensions_nkvetz',
  },
  {
    name: 'Mali',
    countryCode: 'ML',
    assetManagementPdf: null,
    pensionsPdf: 'MLI_Mali_Pensions_mc3nv1',
  },
  {
    name: 'Mauritania',
    countryCode: 'MR',
    assetManagementPdf: null,
    pensionsPdf: 'MRT_Mauritania_Pensions_bjkrm0',
  },
  {
    name: 'Mauritius',
    countryCode: 'MU',
    assetManagementPdf: 'MUS_Mauritius_Asset_Management_gcr5sb',
    pensionsPdf: 'MUS_Mauritius_Pensions_ae12dv',
  },
  {
    name: 'Morocco',
    countryCode: 'MA',
    assetManagementPdf: 'MAR_Morocco_Asset_Management_V2_cunxjn',
    pensionsPdf: 'MAR_Morocco_Pensions_ufxgxl',
  },
  {
    name: 'Mozambique',
    countryCode: 'MZ',
    assetManagementPdf: 'MOZ_Mozambique_Asset_Management_bs0fmp',
    pensionsPdf: 'MOZ_Mozambique_Pensions_oo4emo',
  },
  {
    name: 'Namibia',
    countryCode: 'NA',
    assetManagementPdf: 'NAM_Namibia_Asset_Management_cizit2',
    pensionsPdf: 'NAM_Namibia_Pensions_v107ne',
  },
  {
    name: 'Niger',
    countryCode: 'NE',
    assetManagementPdf: null,
    pensionsPdf: 'NER_Niger_Pensions_pn6x2e',
  },
  {
    name: 'Nigeria',
    countryCode: 'NG',
    assetManagementPdf: 'NGN_Nigeria_Asset_Management_gdeujx',
    pensionsPdf: 'NGN_Nigeria_Pensions_xkydpy',
  },
  {
    name: 'Rwanda',
    countryCode: 'RW',
    assetManagementPdf: 'RWA_Rwanda_Asset_Management_syxobf',
    pensionsPdf: 'RWA_Rwanda_Pensions_tuznnd',
  },
  {
    name: 'São Tomé and Príncipe',
    countryCode: 'ST',
    assetManagementPdf: null,
    pensionsPdf: 'STP_Sao_Tome_and_Principe_Pensions_nz6dzg',
  },
  {
    name: 'Senegal',
    countryCode: 'SN',
    assetManagementPdf: null,
    pensionsPdf: 'SEN_Senegal_Pensions_vet3v6',
  },
  {
    name: 'Seychelles',
    countryCode: 'SC',
    assetManagementPdf: 'SYC_Seychelles_Asset_Management_ggutp2',
    pensionsPdf: 'SYC_Seychelles_Pensions_yfyxc4',
  },
  {
    name: 'Sierra Leone',
    countryCode: 'SL',
    assetManagementPdf: 'SLE_Sierra_Leone_Asset_Management_chzwmf',
    pensionsPdf: 'SLE_Sierra_Leone_Pensions_rpjvrv',
  },
  {
    name: 'Somalia',
    countryCode: 'SO',
    assetManagementPdf: null,
    pensionsPdf: 'SOM_Somalia_Pensions_bzl4yp',
  },
  {
    name: 'South Africa',
    countryCode: 'ZA',
    assetManagementPdf: 'ZAF_South_Africa_Asset_Management_eomizd',
    pensionsPdf: 'ZAF_South_Africa_Pensions_bdmlxb',
  },
  {
    name: 'South Sudan',
    countryCode: 'SS',
    assetManagementPdf: null,
    pensionsPdf: 'SSD_South_Sudan_Pensions_o8nn5g',
  },
  {
    name: 'Sudan',
    countryCode: 'SD',
    assetManagementPdf: 'SDN_Sudan_Asset_Management_plh1ef',
    pensionsPdf: 'SDN_Sudan_Pensions_jaxx39',
  },
  {
    name: 'Tanzania',
    countryCode: 'TZ',
    assetManagementPdf: 'TZA_Tanzania_Asset_Management_gnw1yd',
    pensionsPdf: 'TZA_Tanzania_Pensions_jdd38n',
  },
  {
    name: 'Togo',
    countryCode: 'TG',
    assetManagementPdf: null,
    pensionsPdf: 'TGO_Togo_Pensions_owjbxd',
  },
  {
    name: 'Tunisia',
    countryCode: 'TN',
    assetManagementPdf: 'TUN_Tunisia_Asset_Management_cxgzpg',
    pensionsPdf: 'TUN_Tunisia_Pensions_l1rwws',
  },
  {
    name: 'Uganda',
    countryCode: 'UG',
    assetManagementPdf: 'UGA_Uganda_Asset_Management_yo4jh0',
    pensionsPdf: 'UGA_Uganda_Pensions_uzp3xk',
  },
  {
    name: 'Zambia',
    countryCode: 'ZM',
    assetManagementPdf: 'ZAM_Zambia_Asset_Management_ktt9jc',
    pensionsPdf: 'ZMB_Zambia_Pensions_wfsy1e',
  },
  {
    name: 'Zimbabwe',
    countryCode: 'ZW',
    assetManagementPdf: 'ZWE_Zimbabwe_Asset_Management_xhveea',
    pensionsPdf: 'ZWE_Zimbabwe_Pensions_d6kobd',
  },
];

// Main App Component - displays all countries in 2 columns with search
function App() {
  const [tab, setTab] = useState('assetManagement');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPensionsData = async () => {
      const res = await fetch(
        `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/pdf-management.json`,
      );

      const data = await res.json();

      console.log({ data });
    };

    fetchPensionsData();
  }, []);

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 0px 20px 0px',
  };

  const subtitleStyle = {
    textAlign: 'center',
    fontSize: '18px',
    color: '#4b5563',
    marginBottom: '24px',
    maxWidth: '800px',
    margin: '0 auto 24px',
  };

  const inputContainerStyle = {
    marginBottom: '20px',
    width: '100%',
    margin: '0 auto 20px',
  };

  // Filter and sort countries based on search query
  const filteredCountries = useMemo(() => {
    let result = [...countries].sort((a, b) => a.name.localeCompare(b.name));

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((country) => country.name.toLowerCase().includes(query));
    }

    return result.filter((country) => {
      if (tab === 'assetManagement') {
        return !!country.assetManagementPdf;
      }

      if (tab === 'pensions') {
        return !!country.pensionsPdf;
      }
    })
  }, [searchQuery, tab]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div style={containerStyle}>
      <p style={subtitleStyle}>
        Browse pension and asset management reports by country. Each country features two
        downloadable reports.
      </p>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '30px' }}>
        <Button
          isActive={tab === 'assetManagement'}
          onClick={() => setTab('assetManagement')}
        >
          Asset Management
        </Button>
        <Button isActive={tab === 'pensions'} onClick={() => setTab('pensions')}>
          Pensions
        </Button>
      </div>
      <div style={inputContainerStyle}>
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search countries..."
        />
      </div>
      <div className="country-grid">
        {filteredCountries.map((country) => (
          <CountryCard key={country.name} country={country} tab={tab} />
        ))}
      </div>
      {filteredCountries.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>
          No countries found matching "{searchQuery}"
        </p>
      )}
    </div>
  );
}

// Render to all elements with class "react"
document.querySelectorAll('.react').forEach((container) => {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
});
