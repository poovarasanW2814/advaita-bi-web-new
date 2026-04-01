This project is all about dashboard. this will give key insigts to users using dashboards. In the application itself option is given to create the dashboards.
all the components for ex dashboard layout, chart, table , pivot table, dropdown everything is taken from syncfusion angular component.
when user clicks on plus icon in create page , a dropdonw is given of all the components for dashboard. object structure of each component is same like this.
const newPanel = {
      id: `layout_${newNumericId}`,
      sizeX: 10, // Default width
      sizeY: 8,  // Default height
      row: newRow,
      col: 0, // Default to the first column
      content: {},
      panelType: `${this.panelType}`,
      header: ` ${this.panelType} ${newNumericId}`,
      connection_id: this.connectionId,
};

Only properties inside the content object is different based on panelType. So similarity will be there . this will add to panelSeriesArray. for each panel edit option is given where a popup form will open and there properties will be there. for ex chart or dropdown different form will be open according to there panelType. 

Now i want to add one component called ExpandableFilters. now for other values from panelTypeDataArray this dropdown there respective component will come  and on click of there edit button there form will be open. Same when ExpandableFilters will select a new object will create same like newPanel this. on click of this edit button of this component open a small popup box whree show a dropdown component and a submit button. in dropdown show values like     { Class: 'fas fa-caret-square-down', PanelType: 'DropdownList', Id: '8' },
{ Class: 'fas fa-chevron-circle-down', PanelType: 'MultiSelectDropDown', Id: '9' }, like this exact same structure and the submit button logic for this also will be the same like this onPanelDropdownSubmit. 
in this method one more property will come called expandable_filter_id or something like this. this property will take same value of id in this method onPanelDropdownSubmit only. 
 when user select dropdownList in the popup of expandable filter popup then logic of onPanelDropdownSubmit this method take and create a new method. the object structure everuthing will be the same only when u click on edit button of expandable filter then pass expandable filter id value to the new newPanel object.expandable_filter_id.
  the dropdown or multiselectDropdown component object will be added in panelSeries array only like other components only expandable_filter_id this will be the same for that expandable filter components like dropdown. So easily i can differentiate which are the components are coming under which expandable filter layout component.
   Show a icon to expand and compress the div. when i click the toggle should happen. the main div after header of syncfusion angular content layout in dashboard laout should hide and show. 
   after resizing the panel if i do toggle that time also there structure of col, row, sizeX, sizeY which is stored in storeage. the dropdown component and its structure will be the same like how given there in dropdown component in dashboard directly. 
   create same card layout like header and content. in header show same icon and there method is same given in main dashboard layout. 
Dont change the logic of any exisitng working component for ex dropdown and all. this is a new feature i am adding. whenever resize will happen for the panel component according to that the new component in that should get placed. 

Add all these functionlity in dashboard create page. dont touch working code. read the code and the structure of component and code related to this page. 

Make all these changes in create page only. because the new componet is also part of panelSeriesArray. follow the same structure given in create page for other components. only add the logic given in above instruction. dont create new pages and all.
