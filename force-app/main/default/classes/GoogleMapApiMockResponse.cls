@isTest
public class GoogleMapApiMockResponse implements HttpCalloutMock {

    public String googleMapApiResJson;

    public GoogleMapApiMockResponse(String googleMapApiResJson){
       this.googleMapApiResJson = googleMapApiResJson;
    }
    
    public  HTTPResponse respond(HTTPRequest request) {
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody(googleMapApiResJson);
        response.setStatusCode(200);
        return response; 
    }
}