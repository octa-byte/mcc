import React, { Component } from 'react';
import {AppProvider, Page} from '@shopify/polaris';

import AppSetting from './component/AppSetting';
import GeoLocation from './component/GeoLocation';
import CurrencySetting from './component/CurrencySetting';
import PlacementSetting from './component/PlacementSetting';
import CustomerExplanation from './component/CustomerExplanation';
import PageLoading from './component/PageLoading';
import ToastMessage from './component/ToastMessage';
import APP_URL from './config';

class App extends Component {

  state = {
    isLoading: true,
    error: false,
    settings: {},
    showToast: true
  }
  
  toggleToast = () => {
    this.setState(({showToast}) => ({showToast: !showToast}));
  };

  render() {
    const {isLoading, error, settings} = this.state;

    return (
      <AppProvider>
        <div>
        {
          isLoading ?
          <PageLoading/>
          :
          <Page title="Settings" separator>
            <AppSetting settings={settings} />
            <CurrencySetting settings={settings}/>
            <GeoLocation settings={settings}/>
            <PlacementSetting settings={settings}/>
            <CustomerExplanation settings={settings}/>
          </Page>            
        }
        {
          error ? 
          <ToastMessage msg="Server error" type="error" />
          : ''
        }
        </div>
      </AppProvider>
    );
  }

  componentDidMount = () => {

    this.setState({
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
      });
    
    /* fetch(APP_URL + "/read", { method: 'GET' })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({ isLoading:false });
        console.log(result);
      },
      (error) => {
        this.setState({ error: true });
        console.log(error);
      }
    )*/ 

  } 

}

export default App;
