public with sharing abstract class BackendResponse {
    @AuraEnabled
    public Boolean isSuccess;

    @AuraEnabled
    public String errorMessage;
}