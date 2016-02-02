!function ($, jQuery, window, document) {
    'use strict';

    /**
     * @public
     * @constructor
     *
        * @param $scope
        * @param Upload
        * @param $timeout
        * @param {EmployeesResource} EmployeesResource
        */
    function TestFileUploadController($scope, Upload, $timeout, EmployeesResource) {
 
        $scope.uploadPdfFile = function(file, errFiles) {
                      
            $scope.uploadFile('document.contract', file, errFiles);
        }
               
        $scope.uploadImageFile = function(file, errFiles) {
            
            $scope.uploadFile('image.portrait', file, errFiles);
        }
        
        $scope.uploadFile = function(businessType, file, errFiles) {
            
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            
            if (!file) return;
            
            // Create document first
            
            var document = { 'businessType': businessType, 'mimeType': file.type };
            
            EmployeesResource.addDocument(82, document).$promise.then(function (result) {
                file.result = result.location;
                $scope.location = result.location;
                alert(result.location);
               
                // Using HTML5 FileReader
                var fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);               
                fileReader.onload = function(e) {          
                    Upload.http({
                        url: $scope.location + '/content',
                        method: 'PUT',
                        headers: { 'Content-Type': file.type, 'Content-Length': file.size },
                        data: e.target.result
                        // data: { file: file }
                    }).then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });                  
                };               
            }, function (error) {
                $scope.errorMsg = error;
            });
        }
    }
    
    app.module.controller('testFileUploadController', TestFileUploadController);
}();