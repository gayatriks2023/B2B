import { LightningElement, api, track } from 'lwc';
import getSuggestions from '@salesforce/apex/GoogleApi.getSuggestions';
import getPlaceDetails from '@salesforce/apex/GoogleApi.getPlaceDetails';
import getUserNameHash from '@salesforce/apex/GoogleMapApiController.getUserNameHash';
import calculateDistanceAndRate from '@salesforce/apex/GoogleMapApiController.calculateDistanceAndRate';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import locJpgIcon from '@salesforce/resourceUrl/locationIcon';
export default class GoogleMapApi extends LightningElement {

    @track locationIcon = locJpgIcon;
    // Result records from GoogleApi's
    @track predictions = [];

    // Selected Location Displying on Input text
    @track originLocation = '';
    // Details of selected location
    @track searchOriginLocationObj = {}
    @track hideOriginLocationResults = false;
    originlocationSearchKey;
    originPlaceId = '';

    @track destinationLocation = '';
    // Details of selected location
    @track searchDestinationLocationObj = {}
    @track hideDestinationLocationResults = false;
    destinationlocationSearchKey;
    destinationPlaceId = '';

    @track rateList;

    vHash;
    connectedCallback(){
        getUserNameHash()
        .then(result => {
            this.vHash = result;
        })
        .catch(error => {
            console.log('>>error', error)
        });
    }

    // Google Locations Origin
    handleOriginLocationChange(event) {
        this.originlocationSearchKey = event.detail.value;
        if(!this.originlocationSearchKey){}
        try {
            this.hideOriginLocationResults = true;
            getSuggestions({
                    input: this.originlocationSearchKey.trim(),
                })
                .then(result => {
                    if (result) {
                        var resp = JSON.parse(result);
                        this.predictions = resp.predictions;
                    } 
                })
                .catch(error => {
                    console.log('>>error', error)
                });
        } catch (error) {
            console.log('>>js error', error)
        }
    }
    hanldeOnOriginLocationKeyDown(evt){
        if(evt.keyCode == 13){
            if(this.hideOriginLocationResults){
                this.getPlaceDetails(this.predictions[0].place_id);
                if(evt.target.blur){
                    evt.target.blur();
                }
            }
        }
    }
    getOriginPlaceDetails(placeId){
        // to delete previously stored values
        this.originLocation = '';
        this.searchOriginLocationObj = {}; 
        this.originPlaceId = placeId;       
        getPlaceDetails({placeId: placeId})
        .then(result => {
            if (result) {
                var placeDetails = JSON.parse(result);
                // lat & long
                this.searchOriginLocationObj.lat = placeDetails.result.geometry.location.lat;
                this.searchOriginLocationObj.lng = placeDetails.result.geometry.location.lng;
                // Details
                for (var i = 0; i < placeDetails.result.address_components.length; i++) {
                    // Street
                    if (placeDetails.result.address_components[i].types[0] == "route"
                        || placeDetails.result.address_components[i].types[0] == "neighborhood"
                        || placeDetails.result.address_components[i].types[0].includes("neighborhood")) {
                            this.searchOriginLocationObj.street = placeDetails.result.address_components[i].long_name;
                    }
                    // City
                    if (placeDetails.result.address_components[i].types[0] == "locality") {
                            let localityDetails = placeDetails.result.address_components[i];
                            this.searchOriginLocationObj.city = placeDetails.result.address_components[i].long_name;
                    }
                    // State
                    if (placeDetails.result.address_components[i].types[0] == "administrative_area_level_1") {
                            this.searchOriginLocationObj.state = placeDetails.result.address_components[i].long_name;
                    }
                    // Country
                    if (placeDetails.result.address_components[i].types[0] == "country") {
                            this.searchOriginLocationObj.country = placeDetails.result.address_components[i].long_name;
                    }
                    // Postal COde
                    if (placeDetails.result.address_components[i].types[0] == "postal_code") {
                            this.searchOriginLocationObj.postalCode = placeDetails.result.address_components[i].long_name;
                    }
                }
                this.originLocation = placeDetails.result.formatted_address;
                this.hideOriginLocationResults = false;      
            }
        })
        .catch(error => {
            console.log('>>error', error)
        });
    }

    handleOriginGetPlaceDetails(event) {
        var placeId = event.target.getAttribute("data-name");
        this.getOriginPlaceDetails(placeId);
    }


    // Google Locations Destination
    handleDestinationLocationChange(event) {
        this.destinationlocationSearchKey = event.detail.value;
        if(!this.destinationlocationSearchKey){}
        try {
            this.hideDestinationLocationResults = true;
            getSuggestions({
                    input: this.destinationlocationSearchKey.trim(),
                })
                .then(result => {
                    if (result) {
                        var resp = JSON.parse(result);
                        this.predictions = resp.predictions;
                    } 
                })
                .catch(error => {
                    console.log('>>error', error)
                });
        } catch (error) {
            console.log('>>js error', error)
        }
    }
    hanldeOnDestinationLocationKeyDown(evt){
        if(evt.keyCode == 13){
            if(this.hideDestinationLocationResults){
                this.getPlaceDetails(this.predictions[0].place_id);
                if(evt.target.blur){
                    evt.target.blur();
                }
            }
        }
    }
    getDestinationPlaceDetails(placeId){
        // to delete previously stored values
        this.destinationLocation = '';
        this.searchDestinationLocationObj = {}; 
        this.destinationPlaceId = placeId;       
        getPlaceDetails({placeId: placeId})
        .then(result => {
            if (result) {
                var placeDetails = JSON.parse(result);
                // lat & long
                this.searchDestinationLocationObj.lat = placeDetails.result.geometry.location.lat;
                this.searchDestinationLocationObj.lng = placeDetails.result.geometry.location.lng;
                // Details
                for (var i = 0; i < placeDetails.result.address_components.length; i++) {
                    // Street
                    if (placeDetails.result.address_components[i].types[0] == "route"
                        || placeDetails.result.address_components[i].types[0] == "neighborhood"
                        || placeDetails.result.address_components[i].types[0].includes("neighborhood")) {
                            this.searchDestinationLocationObj.street = placeDetails.result.address_components[i].long_name;
                    }
                    // City
                    if (placeDetails.result.address_components[i].types[0] == "locality") {
                            let localityDetails = placeDetails.result.address_components[i];
                            this.searchDestinationLocationObj.city = placeDetails.result.address_components[i].long_name;
                    }
                    // State
                    if (placeDetails.result.address_components[i].types[0] == "administrative_area_level_1") {
                            this.searchDestinationLocationObj.state = placeDetails.result.address_components[i].long_name;
                    }
                    // Country
                    if (placeDetails.result.address_components[i].types[0] == "country") {
                            this.searchDestinationLocationObj.country = placeDetails.result.address_components[i].long_name;
                    }
                    // Postal COde
                    if (placeDetails.result.address_components[i].types[0] == "postal_code") {
                            this.searchDestinationLocationObj.postalCode = placeDetails.result.address_components[i].long_name;
                    }
                }
                this.destinationLocation = placeDetails.result.formatted_address;
                this.hideDestinationLocationResults = false;      
            }
        })
        .catch(error => {
            console.log('>>error', error)
        });
    }
    handleDestinationGetPlaceDetails(event) {
        var placeId = event.target.getAttribute("data-name");
        this.getDestinationPlaceDetails(placeId);
    }

    handleGetDirection(){
        if(this.originPlaceId == undefined || this.originPlaceId == null || this.originPlaceId == ''){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select Origin Address',
                    variant: 'error'
                })
            );  
            return;  
        }
        if(this.destinationPlaceId == undefined || this.destinationPlaceId == null || this.destinationPlaceId == ''){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select Destination Address',
                    variant: 'error'
                })
            ); 
            return;   
        }

        this.isShowSpinner = true;
        calculateDistanceAndRate({
            origin: 'place_id:'+this.originPlaceId,
            destination: 'place_id:'+this.destinationPlaceId,
        })
        .then(result => {
            if (result) {
                var resp = JSON.parse(result);
                let distanceRes = JSON.parse(resp.distanceRes);
                let distanceObj = distanceRes.rows[0].elements[0].distance;
                let durationObj = distanceRes.rows[0].elements[0].duration;
                let travelRates = resp.travelRates;
                let rateList = [];
                for(let i=0;i<travelRates.length;i++){
                    rateList.push({
                        'key' : 'key'+i,
                        'cost' : '$' + this.numberWithCommas(parseFloat((travelRates[i].Rate__c * ((distanceObj.value) / 1609))).toFixed(2)),
                        'distance'  : distanceObj.text,
                        'duration' : durationObj.text,
                        'transporationMode': travelRates[i].Transportation_Mode__c
                    })
                }
                this.rateList = rateList;
            } 
            this.isShowSpinner = false;
        })
        .catch(error => {
            console.log('>>error', error);
            this.isShowSpinner = false;
        });
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}