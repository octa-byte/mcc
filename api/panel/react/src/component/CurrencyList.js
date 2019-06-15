import React, { Component } from 'react';
import {Avatar, Card, ResourceList, TextStyle, Pagination} from '@shopify/polaris';
import APP_URL from '../config'
import Flag from 'react-flagkit'

import { currencyListItems } from './CurrencyListItems';
const initialOffset = 5;

class CurrencyList extends Component {

    
    constructor(props){
      super(props);

      const itemsLenght = currencyListItems.length;
      const listItems = currencyListItems.slice(0, initialOffset); 

      this.state = {
        currencies: this.props.currencies,
        selectedItems: [],
        items: listItems,
        start: 0,
        searchValue: '',
        appliedFilters: [],
        isFirstPage: true,
        isLastPage: itemsLenght > initialOffset ? false : true,
      };
      //appliedFilters: this.props.currencies,
    }

    handlePreviousPage = () => {
      const {start} = this.state;
      const newStart = start - initialOffset;
      const newOffset = newStart + initialOffset;
      const listItems = currencyListItems.slice(newStart, newOffset);

      this.setState({ 
        start: newStart, 
        items: listItems,
        isLastPage: false,
        isFirstPage: newStart === 0 ? true : false
      });
    };
    handleNextPage = () => {
      const {start} = this.state;
      const newStart = start + initialOffset;
      const newOffset = newStart + initialOffset;
      const listItems = currencyListItems.slice(newStart, newOffset);

      this.setState({ 
        start: newStart,
        items: listItems,
        isFirstPage: false,
        isLastPage: currencyListItems.length === newOffset ? true : false  
      });
    };
    handleFiltersChange = (appliedFilters) => {
      const changedValue = appliedFilters;    
      this.setState({ currencies: changedValue, appliedFilters: appliedFilters });    

      const data = {
        currencies: changedValue
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

      // this.setState({appliedFilters});
    };
    handleSelectionChange = (selectedItems) => {
      this.setState({selectedItems});
    };

    addCurrencies = () => {
      let currencies = [];

      this.state.selectedItems.map( (item) => {
        const currentItem = currencyListItems.find((e) => e.id === item);
        currencies.push(currentItem);
      });

      // Currencies badges
      let badges = this.state.appliedFilters;
      currencies.map( (item) => {
        const find = badges.find((e) => e.key === item.id);
        if(find === undefined){
          badges.push({
            key: item.id,
            name: item.name,
            currency: item.currency,
            value: item.name + ' (' + item.currency + ')'
          });
        }  
      });

      const changedValue = badges;    

      this.setState({ 
        currencies: changedValue,
        appliedFilters: badges,
        selectedItems: [] 
      });

      const data = {
        currencies: changedValue
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
    };

    handleSearchChange = (searchValue) => {
      this.setState({searchValue});

      if(!!searchValue) {

        let results = [];
        currencyListItems.map((item) => {
          if (item.name.toLowerCase().indexOf(searchValue) !== -1) {
            results.push(item);
          }
        });

        const itemsLenght = results.length;
        const listItems = results.slice(0, initialOffset); 

        this.setState({
          items: listItems,
          start: 0,
          isFirstPage: true,
          isLastPage: itemsLenght > initialOffset ? false : true,
        });

        return;
      }

      const itemsLenght = currencyListItems.length;
      const listItems = currencyListItems.slice(0, initialOffset);

      this.setState({
        items: listItems,
        start: 0,
        isFirstPage: true,
        isLastPage: itemsLenght > initialOffset ? false : true,
      }); 
      
    };

    renderItem = (item) => {
      const {id, name, currency, flag, currname} = item;
      
      const media = <span><Avatar size="medium" ></Avatar><Flag country={flag} /></span>;
      return (
        <ResourceList.Item
          id={id}
          media={media}
        >
          <h3>
            <TextStyle variation="strong">{name}</TextStyle>
          </h3>
          <div>{currname}, {currency}</div>
        </ResourceList.Item>
      );
    };
    render() {
      const resourceName = {
        singular: 'currency',
        plural: 'currencies',
      };
      const promotedBulkActions = [
        {
          content: this.state.selectedItems.length > 1 ? 'Add currencies' : 'Add currency',
          onAction: () => this.addCurrencies(),
        },
      ];
      const filterControl = (
        <ResourceList.FilterControl
          appliedFilters={this.state.appliedFilters}
          onFiltersChange={this.handleFiltersChange}
          searchValue={this.state.searchValue}
          onSearchChange={this.handleSearchChange}
          additionalAction={{
            content: 'Search',
            onAction: () => console.log('New filter saved'),
          }}
        />
      );

      const paginationMarkup = currencyListItems.length > 0
          ? (
            <div className='currency-list-pagination'>
              <Pagination
                hasNext={!this.state.isLastPage}
                hasPrevious={!this.state.isFirstPage}
                onPrevious={this.handlePreviousPage}
                onNext={this.handleNextPage}
              />
            </div>  
          ) : null;

      return (
        <Card>
          <ResourceList
            resourceName={resourceName}
            items={this.state.items}
            renderItem={this.renderItem}
            selectedItems={this.state.selectedItems}
            onSelectionChange={this.handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            filterControl={filterControl}
          />
          { paginationMarkup }
        </Card>
      );
    }
  }

export default CurrencyList;  
