import React, { Component } from 'react';
import {SettingToggle, TextStyle, TextContainer, Heading} from '@shopify/polaris';

class GeoLocation extends Component {
    state = {
      settings: this.props.settings,
    };

    render() {
      const {geoLocation} = this.state.settings;
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
        </SettingToggle>
      );

    }

    handleChange = () => {
      let updateSettings = this.state.settings;
          updateSettings.geoLocation = !updateSettings.geoLocation;
      
      this.setState({ settings: updateSettings });    
      /* this.setState(({enabled}) => {
        return {enabled: !enabled};
      }); */
    };
}

export default GeoLocation;