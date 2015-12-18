var hkp = new openpgp.HKP('https://pgp.mit.edu');
var ipfs = ipfsAPI('localhost', '5001');
var key;

function search (e) {
  e.preventDefault();

  hkp.lookup({
    query: $('#recipient').val()
  }).then(function(key_found) {
    key = key_found;
  });
}

function read () {
  var deferred = jQuery.Deferred();
  var file = $('#file').get(0).files[0];
  var reader = new FileReader();

  reader.onload = function(el) {
    deferred.resolve(el.target.result);
  };

  reader.readAsText(file);

  return deferred;
}

function encrypt (e) {
  e.preventDefault();

  var publicKey = openpgp.key.readArmored(key);

  read()
  .then(function (text) {
    openpgp.encryptMessage(publicKey.keys, text).then(function(pgpMessage) {
      var files = [new ipfs.Buffer(pgpMessage)];

      ipfs.add(files, function(err, file) {
        if(err || !file) return console.error(err)

        console.log(file.Hash)
      });
    });
  });
}

$(document).ready(function () {
  $('#search').click(search);
  $('#encrypt').click(encrypt);
});
