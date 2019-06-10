import React, { Component } from 'react';
import {SettingToggle, TextStyle, TextContainer, Heading, Collapsible, Card} from '@shopify/polaris';

import CurrencyList from './CurrencyList';

class CurrencySetting extends Component {
    state = {
      settings: this.props.settings,
      open: false,
    };

    descriptionText = ()  => {
        return (
            this.state.settings.allCurrencies ?
            <p>
                By default all currencies all enabled, If you want to support only 
                specific currencies then <TextStyle variation="strong">change</TextStyle> the setting.
            </p>
            :
            <p>
               Only below currencies are allowed, If you want to allow currencies
               then enable <TextStyle variation="strong">All currencies</TextStyle>     
            </p>
        );            
    };

    render() {
      const {allCurrencies} = this.state.settings;
      const {open} = this.state;
      const contentStatus = allCurrencies ? 'Change' : 'All currencies';
      const textStatus = allCurrencies ? 'All currencies are enabled' : 'Allow only these currencies';

      return (
        <Card> 
            <SettingToggle
            action={{
                content: contentStatus,
                onAction: this.handleChange,
            }}
            enabled={allCurrencies}
            >
            <TextContainer spacing="tight">
                <Heading>Currencies</Heading>
                <TextStyle variation="subdued">{textStatus}</TextStyle>.
                { this.descriptionText() }
            </TextContainer>
            </SettingToggle>
            <Collapsible open={open} id="basic-collapsible">
                <CurrencyList settings={this.props.settings} />
            </Collapsible>
        </Card>
      );

    }

    handleChange = () => {
      let updateSettings = this.state.settings;
          updateSettings.allCurrencies = !updateSettings.allCurrencies;

      this.setState({ settings: updateSettings, open: !this.state.open });    
      /* this.setState((state) => {
        return {
            allCurrencies: !state.allCurrencies,
            open: !state.open
        };
      }); */
    };
}

export default CurrencySetting;