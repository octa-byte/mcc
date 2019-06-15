import React, { Component } from 'react';
import {SettingToggle, TextStyle, TextContainer, Heading} from '@shopify/polaris';
import APP_URL from '../config';

class AppSetting extends Component {
    state = {
      enable: this.props.enable
    };

    render() {
      const {enable} = this.state;
      const contentStatus = enable ? 'Disable' : 'Enable';
      const textStatus = enable ? 'enabled' : 'disabled';
      
      return (
        <SettingToggle
          action={{
            content: contentStatus,
            onAction: this.handleChange,
          }}
          enabled={enable}
        >
          <TextContainer spacing="tight">
            <Heading>Enable App</Heading>
            <TextStyle variation="subdued">App is {textStatus}</TextStyle>
            <p>
              Enable or disable the app. If disabled, 
              the currency picker will not be displayed and currencies 
              will not be converted.
            </p>
          </TextContainer>
        </SettingToggle>
      );

    }

    handleChange = () => {

      const changedValue = !this.state.enable;

      this.setState({ enable: changedValue  });

      const data = {
        enable: changedValue
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

      /* this.setState(({enabled}) => {
        return {enabled: !enabled};
      }); */
    };
}

export default AppSetting;