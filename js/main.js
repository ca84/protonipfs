var text = '';

function read (e) {
  e.preventDefault();

  var file = $('#lefile').get(0).files[0];
  var reader = new FileReader();

  reader.onload = function(el) {
     text = el.target.result;
  };

  reader.readAsText(file);
}

function encrypt (e) {
  e.preventDefault();

  var hkp = new openpgp.HKP('https://pgp.mit.edu');
  hkp.lookup({
      query: 'fcsonline@gmail.com'
  }).then(function(key) {
      var publicKey = openpgp.key.readArmored(key);
      console.log(publicKey);
      openpgp.encryptMessage(publicKey.keys, text).then(function(pgpMessage) {
          // success
          console.log(pgpMessage);
          var ipfs = window.ipfsAPI('localhost', '5001');
          var files = [new ipfs.Buffer(pgpMessage)];

          ipfs.add(files, function(err, file) {
              if(err || !file) return console.error(err)

              console.log(file.Hash)
              console.log(file.Name)
          })
      }).catch(function(error) {
          // failure
      });
  });

  return false;
}

$(document).ready(function () {
  $('#encrypt').click(encrypt);
  $('#read').click(read);
});
