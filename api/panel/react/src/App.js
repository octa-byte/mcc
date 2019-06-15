import React, { Component } from 'react';
import {AppProvider, Page, Banner, Link} from '@shopify/polaris';

import AppSetting from './component/AppSetting';
import GeoLocation from './component/GeoLocation';
import CurrencySetting from './component/CurrencySetting';
import PlacementSetting from './component/PlacementSetting';
import CustomerExplanation from './component/CustomerExplanation';
import PageLoading from './component/PageLoading';
import ToastMessage from './component/ToastMessage';
import APP_URL from './config';
import Popup from './component/Popup';

class App extends Component {

  state = {
    isLoading: true,
    error: false,
    settings: {},
    showToast: true,
    extConfig: true,
  }
  
  toggleToast = () => {
    this.setState(({showToast}) => ({showToast: !showToast}));
  };

  render() {
    const {isLoading, error, settings, extConfig} = this.state;

    return (
      <AppProvider>
        <div>
        {
          isLoading ?
          <PageLoading/>
          :
          <Page title="Settings" separator>
            <AppSetting enable={settings.enable} />
            <CurrencySetting allCurrencies={settings.allCurrencies} currencies={settings.currencies}/>
            <GeoLocation shop={settings.shop} geoLocation={settings.geoLocation} plan={settings.plan}/>
            <PlacementSetting 
              defaultCurrencyPicker={settings.defaultCurrencyPicker}
              shop={settings.shop}
              plan={settings.plan}
              pickerType={settings.pickerType}
              pickerLocation={settings.pickerLocation} />
            <CustomerExplanation/>
          </Page>            
        }
        {
          error ? 
          <ToastMessage msg="Server error" type="error" />
          : ''
        }
        {
          !extConfig ?
            <Popup title="Configure your application" video="ta_tTZrarE0" >
                <Banner status="info" onDismiss={() => { }}>
                  <p>
                    You need to configure your store to function it properly{' '}
                    <Link url="https://help.shopify.com/en/manual/using-themes/change-the-layout/help-script-find-money-formats">More info.</Link>
                  </p>
                </Banner>              
            </Popup>
          :'' 
        }
        </div>
      </AppProvider>
    );
  }

  componentDidMount = () => {
    let shopName = window.location.search;
    shopName = shopName.replace('?','');
    console.log(shopName);
    
    
    fetch(APP_URL + "/read", { 
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shop: shopName,
      }), 
    })
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
        if(result.money_format.includes("money")){
          this.setState({ settings: result, isLoading: false, extConfig: true });
        }else{
          this.setState({ settings: result, extConfig:false });
        }

      },
      (err) => {
        console.log(err);
        this.setState({ error: true, isLoading:false, extConfig:false });
      }
    );

    /* this.setState({
      settings: {
        shop: 'shop',
        accessToken: 'accessToken',
        currency: 'PKR',
        money_format: 'Rs. ${amount} PKR',
        configure: false,
        plan: "free",
        enable: true,
        allCurrencies: true,
        currencies: [],
        geoLocation: false,
        defaultCurrencyPicker: true,
        pickerLocation: "tr",
        pickerType: "edge"},

      isLoading: false,  
      });    */

  } 

}

export default App;
