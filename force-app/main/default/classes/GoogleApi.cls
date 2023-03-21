public with sharing class GoogleApi {

    /**
    * @description : Auto suggestion Web Service 
    * @param : input: SearchAddress , types: Results Types , langug : language for getting the results
    * @return : string
    **/  
    @AuraEnabled
    public static string getSuggestions(String input) {
    system.debug('**input '+input);
       String url = 'callout:GoogleMapApi/maps/api/place/autocomplete/json?'
            + 'input=' + EncodingUtil.urlEncode(input, 'UTF-8') +'&types=geocode'
            + getKey();   
          system.debug('**url '+url);
        String response = getResponse(url); 
        system.debug('Response suggestions***'+response);
        return response;
    }
    
    /**
        * ───────────────────────────────────────────────────────────────┐
        * @description Place Details Web Service 
        * ───────────────────────────────────────────────────────────────
        * @param   String Unique Place Id , langug : language for getting the results
        * @return  String
        * ───────────────────────────────────────────────────────────────┘
    */
    @AuraEnabled
    public static string getPlaceDetails(String placeId) {
        String url = 'callout:GoogleMapApi/maps/api/place/details/json?'
            + 'placeid=' + EncodingUtil.urlEncode(placeId, 'UTF-8')
            + getKey(); 
        String response = getResponse(url);
        system.debug('Response places****'+response);
        return response;
    }

    /**
    * @description : Distance Matrix 
    * @param : input: destination,  origin
    * @return : string
    **/  
    @AuraEnabled
    public static string getDistance(String origin, String destination) {
    system.debug('**input '+origin + ': '+ destination);
       String url = 'callout:GoogleMapApi/maps/api/distancematrix/json?'
                    +  'destinations='+EncodingUtil.urlEncode(destination, 'UTF-8')
                    +  '&origins='+EncodingUtil.urlEncode(origin, 'UTF-8') 
                    +   getKey();   
          system.debug('**url '+url);
        String response = getResponse(url); 
        system.debug('Distance***'+response);
        return response;
    }

    
    /**
        * ───────────────────────────────────────────────────────────────┐
        * @description Common Utility method for making call out
        * ───────────────────────────────────────────────────────────────
        * @param   string GoogleMapApi base URL
        * @return  String
        * ───────────────────────────────────────────────────────────────┘
    */
    public static string getResponse(string strURL){
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();
        req.setMethod('GET');
        req.setEndpoint(strURL);
        req.setTimeout(120000);
        String responseBody;
            res = h.send(req); 
            responseBody = res.getBody(); 
        system.debug('responseBody---'+responseBody);
        return responseBody; 
    }

    /**
        * ───────────────────────────────────────────────────────────────┐
        * @description To get the google Api key from custom label
        * ───────────────────────────────────────────────────────────────
        * @param   
        * @return  String
        * ───────────────────────────────────────────────────────────────┘
    */
    public static string getKey(){
        String googleApiKey = System.Label.Google_Api_Key;
        /*Enter your API key here*/
        string key = googleApiKey;
        string output = '&key=' + key;   
        return output;
    }
}