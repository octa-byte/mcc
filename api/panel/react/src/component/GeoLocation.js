import React, { Component } from 'react';
import {SettingToggle, TextStyle, TextContainer, Heading, Frame, Toast} from '@shopify/polaris';
import APP_URL from '../config';

class GeoLocation extends Component {
    state = {
      geoLocation: this.props.geoLocation,
      plan: this.props.plan,
      showToast: false,
    };

    render() {
      const {geoLocation} = this.state;
      const contentStatus = geoLocation ? 'Disable' : 'Enable';
      const textStatus = geoLocation ? 'enabled' : 'disabled';

      return (
     
        <SettingToggle
          action={{
            content: contentStatus,
            onAction: this.handleChange,
          }}
          enabled={geoLocation}
        >
          <TextContainer spacing="tight">
            <Heading>Customer Geo-Location</Heading>
            <TextStyle variation="subdued">Geo-Location is {textStatus}</TextStyle>.
            <p>
                You can set a default currency based on
                the customer's current location. If this 
                app can't find a suitable match, we will use your default currency.
            </p>
          </TextContainer>
          {
            this.state.showToast ? (
              <div style={{height: '0px'}}>
              <Frame>
              <Toast
              content="Not available in free plan"
              action={{
                content: 'upgrade',
                onAction: () => { this.upgradeAccount() },
              }}
              duration={10000}
              onDismiss={this.toggleToast}
              />
              </Frame>
              </div>
            ) : ''
          }
        </SettingToggle>

      );

    }

    upgradeAccount = () => {
      const shop = this.props.shop;
      const billingURL = 'https://mcc-octabyte.appspot.com/billing?shop=' + encodeURIComponent(shop);
      window.open(billingURL, "_self");
    }

    toggleToast = () => {
      this.setState(({showToast}) => ({showToast: !showToast}));
    };

    handleChange = () => {

      const {plan} = this.state;

      if(plan === "paid") {

      const changedValue = !this.state.geoLocation;    
      
      this.setState({ geoLocation: changedValue });

      const data = {
        geoLocation: changedValue
      };
      
      let shopName = window.location.search;
      shopName = shopName.replace('?','');
      fetch(APP_URL + "/update", { 
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop: shopName,
          data: data
        }), 
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );

      } else {
        
        this.setState({ showToast: true });
      }

      /* this.setState(({enabled}) => {
        return {enabled: !enabled};
      }); */
    };
}

export default GeoLocation;