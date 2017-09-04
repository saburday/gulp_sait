function  chatCtrl(){
  var vm = this;

  vm.test = 'Some word';
}
angular.module('cbschat')
.controller('chatCtrl', [chatCtrl])
