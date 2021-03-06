angular.module('inboxControllers').controller('ConfigurationExportContactsCtrl',
  function (
    $log,
    $scope,
    $translate,
    Export,
    FileReader,
    ImportContacts,
    JsonParse,
    Snackbar
  ) {

    'use strict';
    'ngInject';

    $scope.data = null;
    $scope.overwrite = false;

    $scope.export = function() {
      $scope.exporting = true;
      Export({}, 'contacts').then(function() {
        $scope.exporting = false;
      });
    };

    $scope.import = function() {
      var file = $('#import-contacts [name="contacts"]').prop('files')[0];
      if (!file) {
        $translate('Contacts').then(function(fieldName) {
          $translate('field is required', { field: fieldName }).then(function(message) {
            $scope.error = message;
          });
        });
        return;
      }
      $scope.error = false;
      $scope.importing = true;
      FileReader(file)
        .then(JsonParse)
        .then(function(contacts) {
          return ImportContacts(contacts, $scope.overwrite);
        })
        .then(function() {
          $scope.importing = false;
          $translate('contacts.imported').then(Snackbar);
        })
        .catch(function(err) {
          $scope.importing = false;
          $log.error('Error importing contacts', err);
          $translate('Error parsing file').then(function(message) {
            $scope.error = message;
          });
        });
    };

  }
);
