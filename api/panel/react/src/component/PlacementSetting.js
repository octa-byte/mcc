import React, { Component } from 'react';
import {
    SettingToggle,
    TextStyle, 
    TextContainer, 
    Heading, 
    Collapsible, 
    Card, 
    List, 
    Subheading, 
    Banner,
    Link,
    Frame,
    Toast
} from '@shopify/polaris';

import CurrencyPicker from './CurrencyPicker';
import Popup from './Popup';
import APP_URL from '../config';

class PlacementSetting extends Component {
    state = {
        defaultCurrencyPicker: this.props.defaultCurrencyPicker,
        plan: this.props.plan,
        showToast: false,
    };

    descriptionText = ()  => {
        return (
            this.state.defaultCurrencyPicker ?
            <p>
                Select where the default currency picker will be placed on your store.
                You can also add the <TextStyle variation="strong">custom</TextStyle> picker.
            </p>
            :
            <p>
               Make sure you set up custom currency picker in your theme, otherwise
               picker will not work. You can also 
               use <TextStyle variation="strong">default</TextStyle> picker.     
            </p>
        );            
    };

    /* generateCode = () => {
        console.log('Open poopup');
        this.setState({ activeIconPanel: true });
    }; */

    render() {
      const {defaultCurrencyPicker} = this.state;
      const contentStatus = defaultCurrencyPicker ? 'Customize' : 'Default';
      const textStatus = defaultCurrencyPicker ? 'Default picker is enabled' : 'Custom picker is enabled';

      return (
        <Card> 
            <SettingToggle
            action={{
                content: contentStatus,
                onAction: this.handleChange,
            }}
            enabled={defaultCurrencyPicker}
            >
            <TextContainer spacing="tight">
                <Heading>Currency Picker</Heading>
                <TextStyle variation="subdued">{textStatus}</TextStyle>.
                { this.descriptionText() }
            </TextContainer>
            </SettingToggle>
            <Collapsible open={defaultCurrencyPicker} id="basic-collapsible">
                <CurrencyPicker 
                    pickerType={this.props.pickerType}
                    pickerLocation={this.props.pickerLocation} />
            </Collapsible>
            <Collapsible open={!defaultCurrencyPicker} id="basic-collapsible">
                <div className="Polaris-Card__Section">
                    <Subheading>Follow these setps</Subheading><br/>
                    <List type="number">
                        <List.Item>Copy this 
                            code <TextStyle variation="code">
                            &#x3C;span icon=&#x22;default&#x22; id=&#x22;obc-placeholder&#x22;&#x3E;&#x3C;/span&#x3E; 
                            </TextStyle> 
                        </List.Item>
                        <List.Item>Go to <b>Themes</b> inside <b>Online store</b></List.Item>
                        <List.Item>Click on <b>Actions -> Edit Code</b> </List.Item>
                        <List.Item>Open <b>theme.liquid</b> from <b>Layout</b> folder</List.Item>
                        <List.Item>
                            Place the code where you want to show <b>currency picker</b>
                        </List.Item>
                        <List.Item>Save the file.</List.Item>
                    </List>   
                    <br/>
                    <Banner status="info" onDismiss={() => {}}>
                        <p>
                            You can also customize currency picker <b>icon</b>{' '}
                            <Link url="">For detailed information check it.</Link>
                        </p>
                    </Banner>
                </div>
             
            {
                this.props.defaultCurrencyPicker ?
                <Popup 
                title="Reach more shoppers with Instagram product tags" 
                video="ta_tTZrarE0" />
                : ''
            } 
            

            </Collapsible>
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
        </Card>
      );

    }

    upgradeAccount = () => {
        const shop = this.props.shop;
        const billingURL = 'https://mcc-octabyte.appspot.com/billing?shop=' + encodeURIComponent(shop);
        window.open(billingURL, "_top");
    }
  
    toggleToast = () => {
        this.setState(({showToast}) => ({showToast: !showToast}));
    };

    handleChange = () => {
        const {plan} = this.state;

        if(plan === "paid") {
            const changedValue = !this.state.defaultCurrencyPicker;    

            this.setState({ defaultCurrencyPicker: changedValue, open: this.state.open });

        const data = {
            defaultCurrencyPicker: changedValue
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
            // TODO: show toast to upgrade account
            this.setState({ showToast: true });
        }

      /* this.setState((state) => {
        return {
            defaultPicker: !state.defaultPicker,
            open: !state.open
        };
      }); */
    };
}

export default PlacementSetting;