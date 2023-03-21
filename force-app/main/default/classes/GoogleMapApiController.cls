public with sharing class GoogleMapApiController {
   

    /**
    * @description : user base64 hash
    * @return : string
    **/  
    @AuraEnabled
    public static string getUserNameHash() {
        return EncodingUtil.base64Encode(Blob.valueOf(UserInfo.getName()));
    }

    /**
    * @description : Calculate Distance and Rate 
    * @param : input: destination,  origin
    * @return : string
    **/  
    @AuraEnabled
    public static String calculateDistanceAndRate(String origin, String destination) {
        System.debug('**input '+origin + ': '+ destination);
        List<Travel_Rate__mdt> travelRates = 
            [
                SELECT 
                    Id,
                    Transportation_Mode__c,
                    Rate__c
                FROM Travel_Rate__mdt
            ];
        String distanceRes = GoogleApi.getDistance(origin, destination);
        Map<String,Object> resMap = new Map<String,Object>();
        resMap.put('status', true);
        resMap.put('distanceRes', distanceRes);
        resMap.put('travelRates', travelRates);  
        return JSON.serializePretty(resMap);
    }


}