import React, { Component } from 'react';
import {SettingToggle, TextStyle, TextContainer, Heading} from '@shopify/polaris';

class AppSetting extends Component {
    state = {
      settings: this.props.settings
    };

    render() {
      console.log('settings in render func');
      console.log(this.state.settings);
      const {enable} = this.state.settings;
      const contentStatus = enable ? 'Disable' : 'Enable';
      const textStatus = enable ? 'enabled' : 'disabled';
      console.log(enable);
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
      console.log("===== AppSettings.js=============");
      console.log('Setting before updateing');
      console.log(this.state.settings);
      let updateSettings = this.state.settings;
          updateSettings.enable = !updateSettings.enable;

      this.setState({ settings: updateSettings  });

      console.log('updated settings');
      console.log(updateSettings);
      console.log('Setting after updateing');
      console.log(this.state.settings);
      console.log("-----------------------------------");
      /* this.setState(({enabled}) => {
        return {enabled: !enabled};
      }); */
    };
}

export default AppSetting;