import React, {Component} from 'react';
import {Frame, Toast} from '@shopify/polaris';

class ToastMessage extends Component {
  state = {
    showToast: true,
  };

  render() {
    const {showToast} = this.state;
    const toastType = this.props.type;
    const toastMarkup = toastType === 'message' ? (
      <Toast content={this.props.msg} onDismiss={this.toggleToast} />
    ) : <Toast content={this.props.msg} error onDismiss={this.toggleToast} />;

    return (
        <Frame>
            {
              showToast ? (
                toastMarkup
              ) : null
            }
        </Frame>
    );
  }

  toggleToast = () => {
    this.setState(({showToast}) => ({showToast: !showToast}));
  };
}


export default ToastMessage;