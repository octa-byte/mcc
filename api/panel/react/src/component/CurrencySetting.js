import React, { Component } from 'react';
import {SettingToggle, TextStyle, TextContainer, Heading, Collapsible, Card} from '@shopify/polaris';

import CurrencyList from './CurrencyList';
import APP_URL from '../config';

class CurrencySetting extends Component {
    state = {
      allCurrencies: this.props.allCurrencies,
      open: !this.props.allCurrencies,
    };

    descriptionText = ()  => {
        return (
            this.state.allCurrencies ?
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
      const {allCurrencies} = this.state;
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
                <CurrencyList currencies={this.props.currencies} />
            </Collapsible>
        </Card>
      );

    }

    handleChange = () => {

      const changedValue = !this.state.allCurrencies;    

      this.setState({ allCurrencies: changedValue, open: !this.state.open });    

      const data = {
        allCurrencies: changedValue
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

      /* this.setState((state) => {
        return {
            allCurrencies: !state.allCurrencies,
            open: !state.open
        };
      }); */
    };
}

export default CurrencySetting;