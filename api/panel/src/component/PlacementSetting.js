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
    Link
} from '@shopify/polaris';

import CurrencyPicker from './CurrencyPicker';
import Popup from './Popup';

class PlacementSetting extends Component {
    state = {
        settings: this.props.settings,
    };

    descriptionText = ()  => {
        return (
            this.state.settings.defaultCurrencyPicker ?
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
      const {defaultCurrencyPicker} = this.state.settings;
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
                <CurrencyPicker/>
            </Collapsible>
            <Collapsible open={!defaultCurrencyPicker} id="basic-collapsible">
                <div className="Polaris-Card__Section">
                    <Subheading>Follow these setps</Subheading><br/>
                    <List type="number">
                        <List.Item>Copy this 
                            code <TextStyle variation="code">
                            &#x3C;span icon=&#x22;default&#x22; id=&#x22;octabyte-mcc&#x22;&#x3E;&#x3C;/span&#x3E; 
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
             
            <Popup 
            title="Reach more shoppers with Instagram product tags" 
            video="ta_tTZrarE0" />

            </Collapsible>
        </Card>
      );

    }

    handleChange = () => {
        let updateSettings = this.state.settings;
            updateSettings.defaultCurrencyPicker = !updateSettings.defaultCurrencyPicker;

        this.setState({ settings: updateSettings, open: this.state.open });
      /* this.setState((state) => {
        return {
            defaultPicker: !state.defaultPicker,
            open: !state.open
        };
      }); */
    };
}

export default PlacementSetting;