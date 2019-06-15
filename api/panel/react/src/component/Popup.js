import React, { Component } from 'react';
import {Modal} from '@shopify/polaris';


class Popup extends Component {
    state = {
      active: true,
    };
    render() {
      const {active} = this.state;
      return (
          <Modal
            open={active}
            onClose={this.handleChange}
            title={ this.props.title }
            primaryAction={{
              content: 'I Got It',
              onAction: this.handleChange,
            }}
            secondaryActions={[
              {
                content: 'Contact us',
                onAction: this.handleChange,
              },
            ]}
          >
            <Modal.Section>
              <div style={{ textAlign: 'center' }}>
                <iframe 
                    width="560" 
                    height="315" 
                    src={`https://www.youtube.com/embed/${this.props.video}?rel=0`} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
              </div>
            </Modal.Section>
            { this.props.children !== undefined ?
            <div style={{ backgroundColor: '#fff', padding: '2rem' }}>
                { this.props.children }  
            </div>
            : ''
            }
          </Modal>
      );
    }
    handleChange = () => {
      this.setState(({active}) => ({active: !active}));
    };
}

export default Popup;