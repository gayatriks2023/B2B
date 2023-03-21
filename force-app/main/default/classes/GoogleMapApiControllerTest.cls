@isTest
class GoogleMapApiControllerTest {
    

    @isTest
    public static void testGetSuggestions(){
        StaticResource googleMapApiLocationRes = [SELECT Id, Body FROM StaticResource WHERE Name = 'googleMapApiResByLocation'];
        Test.setMock(HttpCalloutMock.class, new GoogleMapApiMockResponse(googleMapApiLocationRes.body.toString())); 
        String strResp;
        Test.startTest(); 
            strResp = GoogleApi.getSuggestions('New York');
        Test.stopTest();
        Map<String,Object> res = ( Map<String,Object>) JSON.deserializeUntyped(strResp);
        System.assertEquals('OK', String.valueOf(res.get('status')));
    }
    
    @isTest
    public static void testPlaceDetails(){
        StaticResource googleMapApiPlaceIdRes = [SELECT Id, Body FROM StaticResource WHERE Name = 'googleMapApiResByPlaceId'];
        Test.setMock(HttpCalloutMock.class, new GoogleMapApiMockResponse(googleMapApiPlaceIdRes.body.toString())); 
        String strResp;
        Test.startTest(); 
            strResp = GoogleApi.getPlaceDetails('ChIJN1t_tDeuEmsRUsoyG83frY4');
        Test.stopTest();
        Map<String,Object> res = ( Map<String,Object>) JSON.deserializeUntyped(strResp);
        System.assertEquals('OK', String.valueOf(res.get('status')));
        
    }

    @isTest
    static void GoogleMapApiControllerTest() {
        StaticResource googleMapApiLocationRes = [SELECT Id, Body FROM StaticResource WHERE Name = 'googleMapApiResByLocation'];
        Test.setMock(HttpCalloutMock.class, new GoogleMapApiMockResponse(googleMapApiLocationRes.body.toString())); 
        Test.startTest();
            GoogleMapApiController.getUserNameHash();
            GoogleMapApiController.calculateDistanceAndRate('Newyork', 'california');
        Test.stopTest();
    }
}