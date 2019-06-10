import React, { Component } from 'react';
import {Avatar, Card, ResourceList, TextStyle, Pagination} from '@shopify/polaris';

import { currencyListItems } from './CurrencyListItems';
const initialOffset = 3;

class CurrencyList extends Component {

    
    constructor(props){
      super(props);

      const itemsLenght = currencyListItems.length;
      const listItems = currencyListItems.slice(0, initialOffset); 

      this.state = {
        settings: this.props.settings,
        selectedItems: [],
        items: listItems,
        start: 0,
        searchValue: '',
        appliedFilters: this.props.settings.currencies,
        isFirstPage: true,
        isLastPage: itemsLenght > initialOffset ? false : true,
      };
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
      console.log('Todo: currencies updates send request to API');
      let updateSettings = this.state.settings;
          updateSettings.currencies = appliedFilters;
      this.setState({ settings: updateSettings, appliedFilters: appliedFilters });    
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

      let updateSettings = this.state.settings;
          updateSettings.currencies = badges;

      this.setState({ 
        settings: updateSettings,
        appliedFilters: badges,
        selectedItems: [] 
      });

      console.log('Todo: send request to API to add currencies');
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
      const {id, name, currency} = item;
      const media = <Avatar customer size="medium" name={name} />;
      return (
        <ResourceList.Item
          id={id}
          media={media}
        >
          <h3>
            <TextStyle variation="strong">{name}</TextStyle>
          </h3>
          <div>{currency}</div>
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